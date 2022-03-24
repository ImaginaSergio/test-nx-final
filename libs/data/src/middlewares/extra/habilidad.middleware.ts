import useSWR from 'swr';

import { IHabilidad } from '../../models';
import { PropsByQuery } from '../_middleware';
import { get, post, put, remove } from '../../services';
import { GET_HttpResponse, GETID_HttpResponse, PUT_HttpResponse, REMOVE_HttpResponse, PropsByID } from '../_middleware';
import { extractQuery } from '../_utils';

const ENDPOINT_ADMIN = '/godAPI/habilidades/';
const ENDPOINT_CAMPUS = '/openAPI/habilidades/';

export const useHabilidad = ({ id = 0 }: PropsByID) => {
  if (!id) return { data: undefined, isLoading: true, isError: undefined };

  const { data, error } = useSWR(ENDPOINT_CAMPUS + id, get);

  return {
    data: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useHabilidades = ({ query = [] }: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const { data, error } = useSWR(ENDPOINT_CAMPUS + queryTxt, get);

  return {
    data: data?.data?.data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const getHabilidades = async ({ query = [], client = 'campus' }: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const dataHabilidades: GET_HttpResponse = await get((client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt);

  if (!dataHabilidades || dataHabilidades instanceof Error) return undefined;
  else return dataHabilidades.data;
};

export const getHabilidadByID = async ({ id, client }: PropsByID) => {
  const dataHabilidad: GETID_HttpResponse = await get((client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id);

  if (!dataHabilidad || dataHabilidad instanceof Error) return undefined;
  else return dataHabilidad.data;
};

export const addHabilidad = async ({ habilidad }: { habilidad: IHabilidad }) => {
  return post(ENDPOINT_ADMIN, habilidad)
    .then((response: PUT_HttpResponse) => ({
      message: `Habilidad creada correctamente.`,
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

export const updateHabilidad = ({ id, habilidad }: PropsByID & { habilidad: any }) => {
  return put(ENDPOINT_ADMIN + id, habilidad)
    .then((response: PUT_HttpResponse) => ({
      message: `Habilidad actualizada correctamente.`,
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

export const removeHabilidad = ({ id }: PropsByID) => {
  return remove(ENDPOINT_ADMIN + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Habilidad eliminada correctamente.`,
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
