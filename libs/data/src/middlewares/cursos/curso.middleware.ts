import useSWR from 'swr';

import { getProgresos } from './progreso.middleware';
import { get, post, put, putFile, remove } from '../../services';
import {
  ProgresoTipoEnum,
  IModulo,
  ILeccion,
  IProgreso,
  ICurso,
} from '../../models';
import {
  POST_HttpResponse,
  PropsByID,
  PropsByQuery,
  PUT_HttpResponse,
  REMOVE_HttpResponse,
} from '../_middleware';
import { extractQuery } from '../_utils';

const ENDPOINT_ADMIN = '/godAPI/cursos/';
const ENDPOINT_CAMPUS = '/openAPI/cursos/';

export const getCurso = async ({
  id,
  userId,
  client,
}: PropsByID & { userId?: number }) => {
  const dataCurso = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id
  );

  return client === 'admin'
    ? dataCurso.data
    : await treatDataCurso({ dataCurso, userId, client });
};

export const getCursos = async ({
  query = [],
  userId,
  treatData = true,
  client = 'campus',
}: PropsByQuery & {
  userId?: number;
  treatData?: boolean;
}) => {
  let [queryTxt, errors] = extractQuery(query);
  const dataCursos = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt
  );

  if (!treatData || client === 'admin') return dataCursos.data;
  else return await treatDataCursos({ dataCursos, userId, client });
};

export const useCurso = ({
  id = 0,
  userId,
  query = [],
  strategy = 'accept-all',
  client,
}: PropsByID & { userId?: number }) => {
  if (
    !id ||
    (strategy === 'invalidate-on-undefined' &&
      query.find((q) => Object.values(q)?.find((q) => !q)))
  )
    return { curso: undefined, isLoading: true, isError: undefined };

  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(
    `${client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS}${id}${queryTxt}`,
    (e) =>
      get(e).then((data) => {
        if (data.isAxiosError) return { error: data };
        else if (client === 'admin') return data?.data;
        else return treatDataCurso({ dataCurso: data, userId, client });
      })
  );

  return {
    curso: data?.error === undefined ? data : undefined,
    isLoading: !error && !data,
    isError: error || data?.error === 404,
  };
};

export const useCursos = ({
  query = [],
  userId,
  strategy = 'accept-all',
  client = 'campus',
}: PropsByQuery & { userId?: number }) => {
  if (
    strategy === 'invalidate-on-undefined' &&
    query.find((q) => Object.values(q)?.find((q) => !q))
  )
    return { cursos: undefined, isLoading: true, isError: undefined };

  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(ENDPOINT_CAMPUS + queryTxt, (e) =>
    get(e).then((data) => {
      if (data.isAxiosError) return { error: data };
      else if (client === 'admin') return data?.data;
      else return treatDataCursos({ dataCursos: data, userId, client });
    })
  );

  return {
    cursos: data?.error === undefined ? data : undefined,
    isLoading: !error && !data,
    isError: error,
  };
};

const treatDataCurso = async ({
  dataCurso,
  client = 'campus',
  userId,
}: {
  dataCurso: any;
  userId?: number;
  client?: 'admin' | 'campus';
}) => {
  if (dataCurso?.response?.status === 404) return { error: 404 };

  if (!dataCurso?.data || !userId) return undefined;

  const dataProgresos = await getProgresos({
    client,
    query: [
      { curso_id: dataCurso.data.id },
      { tipo: ProgresoTipoEnum.COMPLETADO },
      { user_id: userId },
      { limit: 10000 },
    ],
  }); //TODO Adecuar límite de progreso (lo ideal sería infinito)

  const duracionTotal = dataCurso.data.modulos?.reduce(
    (acc: any, m: IModulo) => (acc += +(m.meta?.duracionTotal || 0)),
    0
  );
  const totalLecciones = dataCurso.data.modulos?.reduce(
    (acc: any, m: IModulo) => (acc += +(m.lecciones?.length || 0)),
    0
  );
  const totalProgreso = dataProgresos?.meta?.total
    ? Math.min(
        100,
        Math.floor((dataProgresos?.meta.total / totalLecciones) * 100)
      )
    : 0;

  dataCurso.data.meta = {
    leccionesCount: totalLecciones,
    progreso_count: totalProgreso,

    duracionTotal: duracionTotal,
    isCompleted: totalProgreso === 100,
    isActive: totalProgreso > 0 && totalProgreso < 100,
    isBlocked: !dataCurso.data.modulos || dataCurso.data.modulos?.length === 0,
  };

  let countLeccionIndexOverModulos = 0;

  dataCurso.data.modulos.sort((a: any, b: any) => a.orden - b.orden);

  dataCurso.data.modulos.forEach((modulo: IModulo, indexM: number) => {
    let isModuloBlocked = false;
    const progresosDelModelo = dataProgresos?.data?.filter(
      (p) => p.moduloId === modulo.id
    );

    modulo.lecciones?.sort((a: any, b: any) => a.orden - b.orden);

    modulo.lecciones?.forEach((leccion: ILeccion) => {
      const current = progresosDelModelo?.find(
        (p: IProgreso) => p.leccionId === leccion.id
      );

      leccion.meta = {
        ...leccion.meta,
        isCompleted: current !== undefined,
        indexOverModelo: ++countLeccionIndexOverModulos,
      };
    });

    if (indexM === 0) isModuloBlocked = false;
    else {
      const prevModulo = dataCurso.data.modulos[indexM - 1].lecciones;

      // Si el anterior módulo tiene alguna lección sin completar, este estará bloqueado.
      isModuloBlocked =
        prevModulo?.find((l: any) => l.meta.isCompleted === false) !==
        undefined;
    }

    modulo.lecciones?.forEach((leccion: ILeccion) => {
      const isLeccionBlocked = isModuloBlocked;

      leccion.meta = { ...leccion.meta, isBlocked: isLeccionBlocked };
    });

    modulo.meta = {
      ...modulo.meta,
      isBlocked: isModuloBlocked,
      leccionesCount: modulo.lecciones?.length || 0,
      progresos_count: progresosDelModelo?.length || 0,
    };
  });

  return dataCurso.data;
};

const treatDataCursos = async ({
  dataCursos,
  client = 'campus',
  userId,
}: {
  dataCursos: any;
  client?: 'admin' | 'campus';
  userId?: number;
}) => {
  if (!dataCursos?.data || !userId) return undefined;

  const cursosListaIDs = dataCursos?.data?.data?.map((c: ICurso) => c.id) || [];

  // TODO Adecuar límite de progreso (lo ideal sería infinito)
  const dataProgresosTotal =
    cursosListaIDs?.length > 0
      ? await getProgresos({
          client,
          query: [
            { lista: `[${cursosListaIDs}]` },
            { tipo: ProgresoTipoEnum.COMPLETADO },
            { user_id: userId },
            { limit: 100000 },
          ],
        })
      : { data: [] };

  for (const curso of dataCursos.data.data) {
    const dataProgresos =
      dataProgresosTotal?.data?.filter((p) => p.cursoId === curso.id) || [];

    const duracionTotal = curso.modulos?.reduce(
      (acc: any, m: IModulo) => (acc += +(m.meta?.duracionTotal || 0)),
      0
    );
    const totalLecciones = curso.modulos?.reduce(
      (acc: any, m: IModulo) => (acc += +(m.meta?.leccionesCount || 0)),
      0
    );
    const totalProgreso =
      dataProgresos?.length > 0
        ? Math.min(
            100,
            Math.floor((dataProgresos?.length / totalLecciones) * 100)
          )
        : 0;

    // Contamos el número de modulos que hay, sin tener en cuenta repetidos.
    const modulosCompletados = new Set(
      dataProgresos?.map((p) => p.moduloId) || []
    ).size;

    curso.meta = {
      duracionTotal: duracionTotal,
      progreso_count: totalProgreso,
      leccionesCount: totalLecciones,
      modulosCompletados: modulosCompletados,
      isCompleted: totalProgreso >= 100,
      isActive: totalProgreso > 0 && totalProgreso < 100,
      isBlocked: !curso.modulos || curso.modulos?.length === 0,
    };
  }

  return dataCursos.data.data;
};

/** Filtra todos los cursos del listado que pertenezcan a la hoja de ruta indicada, ordenándolos segun la hoja de ruta */
export const filterCursosByRuta = (
  ruta: number[] = [],
  cursos: ICurso[] = []
): ICurso[] => {
  const localCopy = [...cursos];

  const res: any[] = [];

  for (const id of ruta) res.push(localCopy.find((c) => c.id === id));

  return res.filter((c) => c);
};

/** Filtra todos los cursos del listado que NO pertenezcan a la hoja de ruta indicada */
export const filterCursosOutsideRuta = (
  ruta: number[] = [],
  cursos: ICurso[] = []
): ICurso[] => {
  return [...cursos]?.filter((c: any) => !ruta?.includes(c.id));
};

export const addCurso = ({ curso }: { curso: ICurso }) => {
  return post(ENDPOINT_ADMIN, curso)
    .then((response: POST_HttpResponse) => ({
      message: `Curso ${curso.titulo} creado correctamente.`,
      value: response.data.data,
      fullResponse: response,
    }))
    .catch((error: POST_HttpResponse) => {
      let message;

      if (error.errors && error.errors.length > 0)
        message = error.errors.reduce(
          (acc, err) => (acc += `\n${err.message}`),
          ''
        );
      else message = error.message;

      throw {
        title: 'Error inesperado',
        message:
          message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const updateCurso = ({ id, curso }: PropsByID & { curso: any }) => {
  return put(ENDPOINT_ADMIN + id, curso)
    .then((response: PUT_HttpResponse) => ({
      message: `Curso ${curso.titulo} actualizado correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: PUT_HttpResponse) => {
      let message;

      if (error.errors && error.errors.length > 0)
        message = error.errors.reduce(
          (acc, err) => (acc += `\n${err.message}`),
          ''
        );
      else message = error.message;

      throw {
        title: 'Error inesperado',
        message:
          message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const updateCursoFile = (id: string, name: string, file: File) => {
  var formData = new FormData();
  formData.set(name, file);

  return putFile(ENDPOINT_ADMIN + id, formData)
    .then((response: PUT_HttpResponse) => {
      return {
        message: `Archivo subido correctamente.`,
        value: response.data,
        fullResponse: response,
      };
    })
    .catch((error: PUT_HttpResponse) => {
      let message;

      if (error.errors && error.errors.length > 0)
        message = error.errors.reduce(
          (acc, err) => (acc += `\n${err.message}`),
          ''
        );
      else message = error.message;

      throw {
        title: 'Error inesperado',
        message:
          message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const removeCurso = ({ id }: PropsByID) => {
  return remove(ENDPOINT_ADMIN + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Curso ${response.data} eliminado correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: REMOVE_HttpResponse) => {
      let message;

      if (error.errors && error.errors.length > 0)
        message = error.errors.reduce(
          (acc, err) => (acc += `\n${err.message}`),
          ''
        );
      else message = error.message;

      throw {
        title: 'Error inesperado',
        message:
          message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};
