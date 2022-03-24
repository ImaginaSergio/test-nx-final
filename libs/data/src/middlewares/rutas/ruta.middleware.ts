import {
  PropsByID,
  PropsByQuery,
  GET_HttpResponse,
  GETID_HttpResponse,
  POST_HttpResponse,
  PUT_HttpResponse,
  REMOVE_HttpResponse,
} from '../_middleware';
import { IRuta } from '../../models';
import { stringToNumArray } from '@clevery-lms/utils';
import { get, post, put, remove } from '../../services';
import { extractQuery } from '../_utils';

const ENDPOINT_ADMIN = '/godAPI/rutas/';
const ENDPOINT_CAMPUS = '/openAPI/rutas/';

export const getRutas = async ({
  query = [],
  client = 'campus',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const dataRutas: GET_HttpResponse = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt
  );

  if (!dataRutas || dataRutas instanceof Error) return undefined;
  else {
    for (const ruta of dataRutas.data.data) {
      ruta.meta = { itinerario: stringToNumArray(ruta.itinerario || '') };
    }

    return dataRutas.data;
  }
};

export const getRutaByID = async ({ id, client }: PropsByID) => {
  const dataRuta: GETID_HttpResponse = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id
  );

  if (!dataRuta || dataRuta instanceof Error) return undefined;
  else {
    dataRuta.data.meta = {
      itinerario: stringToNumArray(dataRuta.data.itinerario || ''),
    };

    return dataRuta.data;
  }
};

export const addRuta = ({ ruta }: { ruta: IRuta }) => {
  return post(ENDPOINT_ADMIN, ruta)
    .then((response: POST_HttpResponse) => ({
      message: `EntreRutagable creado correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: POST_HttpResponse) => {
      throw {
        title: 'Error inesperado',
        message:
          error.message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const updateRuta = ({
  id,
  client = 'campus',
  ruta,
}: PropsByID & { ruta: any }) => {
  return put(ENDPOINT_ADMIN + id, ruta)
    .then((response: PUT_HttpResponse) => ({
      message: `Ruta actualizada correctamente.`,
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

export const removeRuta = ({ id }: PropsByID) => {
  return remove(ENDPOINT_ADMIN + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Ruta eliminada correctamente.`,
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
