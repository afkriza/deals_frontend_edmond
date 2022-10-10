import httpClient from '@/api/http-client';
import { joinUrlSegments } from '@/api/utils';

const OVERVIEW_ENDPOINT = 'overview';

type OverviewFilter = any;

export const fetchOverviewData = (filter: OverviewFilter) =>
  httpClient.get(OVERVIEW_ENDPOINT, { params: { filter } });

export const fetchOverviewItemDetails = (filter: OverviewFilter) =>
  httpClient.get(joinUrlSegments(OVERVIEW_ENDPOINT, 'details'), {
    params: { filter }
  });
