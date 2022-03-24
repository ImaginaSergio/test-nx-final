import useSWR from 'swr';

import {
  PropsByQuery,
  PropsByID,
  GET_HttpResponse,
  POST_HttpResponse,
  PUT_HttpResponse,
  REMOVE_HttpResponse,
} from '../_middleware';
import { extractQuery } from '../_utils';
import { get, post, put, remove } from '../../services';
import { IForoPregunta, IForoRespuesta, IForoTema, IForoVoto } from '../../models';

const ENDPOINT = '/openAPI/foro';

export const useForoTemas = ({ query = [] }: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const { data, error } = useSWR(`${ENDPOINT}/temas/${queryTxt}`, get);

  const temas: IForoTema[] = data?.data?.data;

  return {
    data: temas,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useForoTema = ({ id = '', query = [] }: PropsByID) => {
  if (!id) return { data: undefined, isLoading: true, isError: undefined };

  let [queryTxt, errors] = extractQuery(query);
  const { data, error } = useSWR(`${ENDPOINT}/temas/${id}${queryTxt}`, get);

  const tema: IForoTema = data?.data;

  return {
    data: tema,
    isLoading: !error && !data,
    isError: error,
  };
};

export const addForoTema = ({ tema }: { tema: IForoTema }) => {
  return post(ENDPOINT + '/temas', tema)
    .then((response: POST_HttpResponse) => ({
      message: `Tema creado correctamente.`,
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

export const useForoPreguntas = ({ query = [] }: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const { data, error } = useSWR(`${ENDPOINT}/preguntas/${queryTxt}`, get);

  const preguntas: IForoPregunta[] = data?.data?.data;

  return {
    data: preguntas,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useForoPregunta = ({ id = '', query = [] }: PropsByID) => {
  let [queryTxt, errors] = extractQuery(query);
  const { data, error } = useSWR(`${ENDPOINT}/preguntas/${id}${queryTxt}`, get);

  const pregunta: IForoPregunta = data?.data;

  return {
    data: pregunta,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useForoRespuestas = ({ query = [] }: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const { data, error } = useSWR(`${ENDPOINT}/respuestas/${queryTxt}`, get);

  const respuestas: IForoRespuesta[] = data?.data?.data;

  return {
    data: respuestas,
    isLoading: !error && !data,
    isError: error,
  };
};

export const addForoPregunta = ({ pregunta }: { pregunta: IForoPregunta }) => {
  return post(ENDPOINT + '/preguntas', pregunta)
    .then((response: POST_HttpResponse) => ({
      message: `Pregunta creada correctamente.`,
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

export const addForoRespuesta = ({ respuesta }: { respuesta: IForoRespuesta }) => {
  return post(ENDPOINT + '/respuestas', respuesta)
    .then((response: POST_HttpResponse) => ({
      message: `Respuesta creada correctamente.`,
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

export const updateForoRespuesta = ({ id, respuesta }: PropsByID & { respuesta: any }) => {
  return put(`${ENDPOINT}/respuestas/${id}`, respuesta)
    .then((response: PUT_HttpResponse) => ({
      message: `Respuesta actualizado correctamente.`,
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

export const updateForoPregunta = ({ id, pregunta }: PropsByID & { pregunta: any }) => {
  return put(`${ENDPOINT}/preguntas/${id}`, pregunta)
    .then((response: PUT_HttpResponse) => ({
      message: `Pregunta actualizado correctamente.`,
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

export const updateForoTema = ({ id, tema }: PropsByID & { tema: any }) => {
  return put(`${ENDPOINT}/temas/${id}`, tema)
    .then((response: PUT_HttpResponse) => ({
      message: `Tema actualizado correctamente.`,
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

export const getVotos = async ({ query = [] }: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const dataVotos: GET_HttpResponse = await get(ENDPOINT + '/votos' + queryTxt);

  if (!dataVotos || dataVotos instanceof Error) return undefined;
  else return dataVotos.data.data;
};

export const addVoto = ({ voto }: { voto: IForoVoto }) => {
  return post(ENDPOINT + '/votos', voto)
    .then((response: POST_HttpResponse) => ({
      message: `Voto creado correctamente.`,
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

export const updateVoto = ({ id, voto }: PropsByID & { voto: any }) => {
  return put(`${ENDPOINT}/votos/${id}`, voto)
    .then((response: PUT_HttpResponse) => ({
      message: `Voto actualizado correctamente.`,
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

export const removeVoto = ({ id }: PropsByID) => {
  return remove(`${ENDPOINT}/votos/${id}`)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Voto actualizado correctamente.`,
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
