import { IEmpresa } from '../../models';
import { get, post, put, remove } from '../../services';

import {
  PropsByQuery,
  GET_HttpResponse,
  POST_HttpResponse,
  PropsByID,
  PUT_HttpResponse,
  REMOVE_HttpResponse,
} from '../_middleware';
import { extractQuery } from '../_utils';

const ENDPOINT = '/godAPI/empresas/';

export const getEmpresa = async ({ id }: PropsByID) => {
  const dataEmpresa = await get(ENDPOINT + id);

  return dataEmpresa.data;
};

export const getEmpresas = async ({ query = [] }: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const dataEmpresas: GET_HttpResponse = await get(`${ENDPOINT}${queryTxt}`);

  if (!dataEmpresas || dataEmpresas instanceof Error) return undefined;
  else return dataEmpresas.data;
};

export const addEmpresa = ({ empresa }: { empresa: IEmpresa }) => {
  return post(ENDPOINT, empresa)
    .then((response: POST_HttpResponse) => ({
      message: `Empresa creada correctamente.`,
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

export const updateEmpresa = ({ id, empresa }: PropsByID & { empresa: any }) => {
  return put(ENDPOINT + id, empresa)
    .then((response: PUT_HttpResponse) => ({
      message: `Empresa actualizada correctamente.`,
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

export const removeEmpresa = ({ id }: PropsByID) => {
  return remove(ENDPOINT + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Empresa eliminada correctamente.`,
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
