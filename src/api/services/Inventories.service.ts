import httpClient from '@/api/http-client';

const INVENTORIES_ENDPOINT = 'inventories';

type InventoriesFilter = {
  startDate: string;
  endDate: string;
  property: string;
  inventories?: 'all';
};

export const fetchInventories = (filters: InventoriesFilter) =>
  httpClient.get(INVENTORIES_ENDPOINT, {
    params: { filter: filters }
  });
