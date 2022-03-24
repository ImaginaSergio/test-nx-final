import useSWR from 'swr';

import { get } from '../../services';
import { extractQuery } from '../_utils';
import { PropsByQuery, GET_HttpResponse, PropsByID, GETID_HttpResponse } from '..';

const ENDPOINT = '/godAPI/stats/';

export const getUsersStats = async ({ query = [] }: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  let dataUsers: GET_HttpResponse = await get(ENDPOINT + queryTxt);

  if (!dataUsers || dataUsers instanceof Error) return undefined;
  else return dataUsers.data;
};

export const getUserStats = async ({ id }: PropsByID) => {
  let dataUsers: GETID_HttpResponse = await get(ENDPOINT + id);

  if (!dataUsers || dataUsers instanceof Error) return undefined;
  else return dataUsers.data;
};

export const useUserStats = ({ id }: { id: number }) => {
  const { data, error } = useSWR(ENDPOINT + id, (e) => get(e).then((data) => treatData(data?.data)));

  const treatData = (stats: any[] | any) => {
    if (stats?.error || !stats) return stats;

    return stats;
  };

  return {
    data: data?.error === undefined ? data : undefined,
    isLoading: !error && !data,
    isError: error,
  };
};

/** Query puede ser una query para el index global, o el índice de las stats por curso */
export const getStatsByCurso = async ({ query = [] }: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  let dataStats: GET_HttpResponse = await get('/godAPI/statsByCurso/' + queryTxt);

  if (!dataStats || dataStats instanceof Error) return undefined;
  else return dataStats.data;
};

/** Query puede ser una query para el index global, o el índice de las stats por habilidadId */
export const getStatsByHabilidad = async ({ query = [] }: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  let dataStats: GET_HttpResponse = await get('/godAPI/statsByHabilidad/' + queryTxt);

  if (!dataStats || dataStats instanceof Error) return undefined;
  else return dataStats.data;
};
