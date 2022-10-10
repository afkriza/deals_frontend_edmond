import httpClient from '@/api/http-client';
import serialize from '@/api/json-api/serializer';

import { snakeCase, keys } from 'lodash';
import { joinUrlSegments } from '@/api/utils';

const FILTER_SETS_ENDPOINT = 'filter-sets';

type FilterSet = {
  id?: string;
  name: string;
  public: boolean;
  domain: 'analytics' | 'rate_shopper';
  configuration: any;
};

export const fetchFilterSets = (domain: string) =>
  httpClient.get(FILTER_SETS_ENDPOINT, {
    params: {
      filter: {
        domain: snakeCase(domain)
      }
    }
  });

export const createFilterSet = (filterSet: FilterSet) => {
  const payload = serialize(filterSet, {
    attributes: keys(filterSet)
  });

  return httpClient.post(FILTER_SETS_ENDPOINT, payload);
};

export const editFilterSet = (filterSet: FilterSet) => {
  const payload = serialize(filterSet, {
    attributes: keys(filterSet)
  });

  return httpClient.put(
    joinUrlSegments(FILTER_SETS_ENDPOINT, filterSet.id),
    payload
  );
};

export const deleteFilterSet = (filterSetId: string) =>
  httpClient.delete(joinUrlSegments(FILTER_SETS_ENDPOINT, filterSetId));
