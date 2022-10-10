import httpClient from '@/api/http-client';

type FiltersQuery = any;

const FILTERS_ENDPOINT = 'filters';

export const fetchFilters = (namespace: string, filtersQuery: FiltersQuery) =>
  httpClient.get(`${namespace}/${FILTERS_ENDPOINT}`, {
    params: filtersQuery
  });

export const fetchOptions = (url: string, filtersQuery: FiltersQuery) =>
  httpClient.get(url, {
    baseURL: '',
    params: { filter: filtersQuery }
  });

export const setFilterPin = (namespace: string, payload) =>
  httpClient.put(`${namespace}/filters`, payload);
