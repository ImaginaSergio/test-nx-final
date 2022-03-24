import {
  PropsByQuery,
  GET_HttpResponse,
  GETID_HttpResponse,
  POST_HttpResponse,
  PropsByID,
  PUT_HttpResponse,
  REMOVE_HttpResponse,
} from '..';
import { IPlantilla } from '../../models';
import { get, post, put, remove } from '../../services';

const ENDPOINT = '/godAPI/plantillas/';

export const getPlantillas = async ({ query }: PropsByQuery) => {
  let dataPlantillas: GET_HttpResponse = await get(ENDPOINT + (query || ''));

  if (!dataPlantillas || dataPlantillas instanceof Error) return undefined;
  else return dataPlantillas.data;
};

export const getPlantilla = async ({ id }: PropsByID) => {
  let dataPlantilla: GETID_HttpResponse = await get(ENDPOINT + id);

  if (!dataPlantilla || dataPlantilla instanceof Error) return undefined;
  else return dataPlantilla.data;
};

export const addPlantilla = ({ plantilla }: { plantilla: IPlantilla }) => {
  return post(ENDPOINT, plantilla)
    .then((response: POST_HttpResponse) => ({
      message: `Plantilla ${plantilla.titulo} creado correctamente.`,
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

export const updatePlantilla = ({ id, plantilla }: PropsByID & { plantilla: any }) => {
  return put(ENDPOINT + id, plantilla)
    .then((response: PUT_HttpResponse) => ({
      message: `Plantilla actualizada correctamente.`,
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

export const removePlantilla = ({ id }: PropsByID) => {
  return remove(ENDPOINT + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Plantilla eliminada correctamente.`,
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
