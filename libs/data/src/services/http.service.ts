import axios from 'axios';
import { getItem } from '.';
import { LOGIN_TOKEN } from '../middlewares';

const _axios = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/pdf',
  },
});

const _axios_File = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

_axios.interceptors.request.use((config: any) => {
  if (config.url !== 'authAPI/login') {
    const token = getItem(LOGIN_TOKEN);
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

_axios_File.interceptors.request.use((config: any) => {
  const token = getItem('loginToken');
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export const get = async (endpoint: string) => {
  return await _axios
    .get(endpoint)
    .then((res: any) => res.data)
    .catch((error: any) => error);
};

export const post = async (endpoint: string, data: any) => {
  return await _axios.post(endpoint, data);
};

export const put = async (endpoint: string, data: any) => {
  return await _axios.put(endpoint, data);
};

export const putFile = async (endpoint: string, data: any) => {
  return await _axios_File.put(endpoint, data);
};

export const remove = async (endpoint: string) => {
  return await _axios.delete(endpoint);
};
