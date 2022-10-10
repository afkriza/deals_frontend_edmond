import axios from 'axios';
import qs from 'qs';
import deserialize from '@/api/json-api/deserializer';
import { isNull } from 'lodash';

const BASE_URL = '/api/v1';

declare module 'axios' {
  export interface AxiosRequestConfig {
    unpackData?: boolean;
  }
}

const httpClient = axios.create({
  baseURL: BASE_URL,
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' }),
  transformResponse: data => data && deserialize(JSON.parse(data)),
  unpackData: true
});

httpClient.interceptors.response.use(response => {
  if (response.config.unpackData === false) {
    return response;
  }

  return response.data;
});

let authorizationInterceptor: number | null = null;

export const setToken = (token: string) => {
  authorizationInterceptor = httpClient.interceptors.request.use(config => {
    config.headers['Authorization'] = `Bearer ${token}`;

    return config;
  });
};

export const removeToken = () => {
  if (isNull(authorizationInterceptor)) {
    return;
  }

  httpClient.interceptors.request.eject(authorizationInterceptor);
  authorizationInterceptor = null;
};

export default httpClient;
