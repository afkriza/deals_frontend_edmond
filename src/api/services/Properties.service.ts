import httpClient from '@/api/http-client';

const PROPERTIES_ENDPOINT = 'properties';

export const fetchAllProperties = () => httpClient.get(PROPERTIES_ENDPOINT);
