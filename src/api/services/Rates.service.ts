import httpClient from '@/api/http-client';

const RATES_ENDPOINT = 'rates';

type RatesFilter = {
  startDate: string;
  endDate: string;
  property: string;
  rates?: 'all';
};

export const fetchRates = (filters: RatesFilter) =>
  httpClient.get(RATES_ENDPOINT, {
    params: { filter: filters }
  });
