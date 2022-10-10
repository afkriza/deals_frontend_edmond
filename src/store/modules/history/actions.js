import * as mutationTypes from 'store/mutation-types';
import {
  fetchInventoriesHistory,
  fetchRatesHistory
} from 'api/services/ActivityLogs.service';

export async function fetchHistory({ commit, getters }) {
  const filter = getters['filters/filtersQuery'];

  // Checking if first request
  const filters = !getters.uniqueRequestGuids
    ? { filter }
    : { filter, created_after: getters.lastCreatedAt };

  const method = getters.isRatesTab
    ? fetchRatesHistory
    : fetchInventoriesHistory;

  try {
    commit(mutationTypes.HISTORY_REQUEST, !getters.uniqueRequestGuids);

    const { data, links } = await method(filters);

    commit(mutationTypes.HISTORY_SUCCESS, { data, links });
  } catch (e) {
    commit(mutationTypes.HISTORY_FAILURE);
    throw e;
  }
}
