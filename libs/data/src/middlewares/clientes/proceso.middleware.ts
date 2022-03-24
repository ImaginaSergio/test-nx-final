import useSWR from 'swr';

import { getRutaByID } from '..';
import { IProceso } from '../../models';
import { get, post, put, remove } from '../../services';
import {
  POST_HttpResponse,
  GET_HttpResponse,
  PropsByID,
  PropsByQuery,
  PUT_HttpResponse,
  REMOVE_HttpResponse,
  GETID_HttpResponse,
} from '../_middleware';
import { extractQuery } from '../_utils';

const ENDPOINT_ADMIN = '/godAPI/procesos/';
const ENDPOINT_CAMPUS = '/openAPI/procesos/';

export const getProcesos = async ({ query = [] }: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  let dataProcesos: GET_HttpResponse = await get(ENDPOINT_ADMIN + queryTxt);

  if (!dataProcesos || dataProcesos instanceof Error) return undefined;
  else return dataProcesos.data;
};

export const getProceso = async ({ id }: PropsByID) => {
  let dataProceso: GETID_HttpResponse = await get(ENDPOINT_ADMIN + id);

  if (!dataProceso || dataProceso instanceof Error) return undefined;
  else return dataProceso.data;
};

export const useProceso = ({ id = 0 }: PropsByID) => {
  if (!id) return { proceso: undefined, isLoading: true, isError: undefined };

  const { data, error } = useSWR(ENDPOINT_CAMPUS + id, (e) => get(e).then((data) => treatDataProceso({ dataProceso: data })));

  return {
    proceso: data?.error === undefined ? data : undefined,
    isLoading: !error && !data,
    isError: error,
  };
};

const treatDataProceso = async ({ dataProceso }: { dataProceso: any }) => {
  if (!dataProceso?.data) return undefined;

  const dataRuta = await getRutaByID(dataProceso.data.rutaId);

  dataProceso.data.ruta = dataRuta;

  return dataProceso.data;
};

export const useProcesos = ({ query = [] }: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const { data, error } = useSWR(ENDPOINT_CAMPUS + queryTxt, get);

  return {
    procesos: data?.data?.data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useCheckProceso = ({ id = 0 }: PropsByID) => {
  if (!id) return { isAbleToApply: undefined, isLoading: true, isError: undefined };

  const { data, error } = useSWR('/openAPI/checkProceso/' + id, get);

  return {
    isAbleToApply: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const applyToProceso = async ({ id }: PropsByID) => {
  return post(`/openAPI/applyToProceso/${id}`, {})
    .then((response: POST_HttpResponse) => ({
      message: `Suscripción a vacante procesada correctamente.`,
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

export const removeFromProceso = async ({ id }: PropsByID) => {
  return remove(`/openAPI/removeFromProceso/${id}`)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Se ha eliminado la suscripción a la vacante.`,
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

export const addProceso = ({ proceso }: { proceso: IProceso }) => {
  return post(ENDPOINT_ADMIN, proceso)
    .then((response: POST_HttpResponse) => ({
      message: `Proceso ${proceso.titulo} creado correctamente.`,
      value: response.data.data,
      fullResponse: response,
    }))
    .catch((error: POST_HttpResponse) => {
      let message;

      if (error.errors && error.errors.length > 0) message = error.errors.reduce((acc, err) => (acc += `\n${err.message}`), '');
      else message = error.message;

      throw {
        title: 'Error inesperado',
        message: message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const updateProceso = ({ id, client = 'campus', proceso }: PropsByID & { proceso: any }) => {
  return put(ENDPOINT_ADMIN + id, proceso)
    .then((response: PUT_HttpResponse) => ({
      message: `Proceso actualizado correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: PUT_HttpResponse) => {
      let message;

      if (error.errors && error.errors.length > 0) message = error.errors.reduce((acc, err) => (acc += `\n${err.message}`), '');
      else message = error.message;

      throw {
        title: 'Error inesperado',
        message: message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const removeProceso = ({ id, client }: PropsByID) => {
  return remove(ENDPOINT_ADMIN + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Proceso eliminado correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: REMOVE_HttpResponse) => {
      let message;

      if (error.errors && error.errors.length > 0) message = error.errors.reduce((acc, err) => (acc += `\n${err.message}`), '');
      else message = error.message;

      throw {
        title: 'Error inesperado',
        message: message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};
