import httpClient from '@/api/http-client';

const ACTIVITY_LOGS_ENDPOINT = 'activity-logs';

type ActivityLogsFilter = {
  filter: {
    startDate?: string;
    endDate?: string;
    createdStartDate: string;
    createdEndDate: string;
    property?: string[];
    user?: string[];
    unitType?: string[];
    channel?: string[];
    priceLevel?: string[];
  };
  createdAfter?: string;
};

export const fetchRatesHistory = (filters: ActivityLogsFilter) =>
  httpClient.get(`${ACTIVITY_LOGS_ENDPOINT}/rates`, {
    params: filters
  });

export const fetchInventoriesHistory = (filters: ActivityLogsFilter) =>
  httpClient.get(`${ACTIVITY_LOGS_ENDPOINT}/inventories`, {
    params: filters
  });
