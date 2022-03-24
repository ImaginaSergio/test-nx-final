import useSWR from 'swr';

import { IProyecto } from '../../models';
import { get, post, put, remove } from '../../services';
import { PropsByQuery, PropsByID, POST_HttpResponse, PUT_HttpResponse, REMOVE_HttpResponse } from '../_middleware';
import { extractQuery } from '../_utils';

const ENDPOINT_ADMIN = '/godAPI/proyectos/';
const ENDPOINT_CAMPUS = '/openAPI/proyectos/';

export const useProyecto = ({ id, query = [], client }: PropsByID) => {
  if (!id) return { proyecto: undefined, isLoading: true, isError: undefined };

  let [queryTxt, errors] = extractQuery(query);
  const { data, error } = useSWR((client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id + queryTxt, (ep) =>
    get(ep).then((data) => data.data)
  );

  return {
    proyecto: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useProyectos = ({ query = [], client = 'campus' }: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR((client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt, (ep) =>
    get(ep).then((data) => data.data.data)
  );

  return {
    proyectos: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const addProyecto = ({ proyecto }: { proyecto: IProyecto }) => {
  return post(ENDPOINT_CAMPUS, proyecto)
    .then((response: POST_HttpResponse) => ({
      message: `Proyecto creado correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: POST_HttpResponse) => {
      throw {
        title: 'Error inesperado',
        message: error.message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const updateProyecto = ({ id, proyecto }: PropsByID & { proyecto: any }) => {
  return put(ENDPOINT_CAMPUS + id, proyecto)
    .then((response: PUT_HttpResponse) => ({
      message: `Proyecto actualizado correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: PUT_HttpResponse) => {
      throw {
        title: 'Error inesperado',
        message: error.message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const removeProyecto = ({ id }: PropsByID) => {
  return remove(ENDPOINT_CAMPUS + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Proyecto eliminado correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: REMOVE_HttpResponse) => {
      throw {
        title: 'Error inesperado',
        message: error.message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};
