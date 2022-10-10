import { forEach, keyBy, map, mapKeys, merge, size, snakeCase } from 'lodash';

import createFilterSetsModule from './filter-sets.module';
import filterFactory from '@/components/filters/models/filter.factory';
import {
  fetchFilters,
  fetchOptions,
  setFilterPin
} from 'api/services/Filters.service';

export default (namespace, useFilterSets = false) => ({
  namespaced: true,

  ...(useFilterSets && {
    modules: { filterSets: createFilterSetsModule(namespace) }
  }),

  state: () => ({
    filtersById: {},
    filterIds: []
  }),

  mutations: {
    ADD_FILTER(state, filter) {
      state.filterIds.push(filter.id);
      state.filtersById = { ...state.filtersById, [filter.id]: filter };
    },

    SET_FILTERS(state, filters) {
      state.filterIds = map(filters, 'id');
      state.filtersById = keyBy(filters, 'id');
    },

    MERGE_FILTER(state, { filterId, newFilter }) {
      state.filtersById[filterId].merge(newFilter);
    },

    UPDATE_FILTER(state, filter) {
      state.filtersById = { ...state.filtersById, [filter.id]: filter };
    },

    TOGGLE_PINNED(state, filterId) {
      state.filtersById[filterId].togglePin();
    }
  },

  getters: {
    filter(state) {
      return filterId => state.filtersById[filterId];
    },

    filters(state) {
      return map(state.filterIds, filterId => state.filtersById[filterId]);
    },

    filtersQuery(state, getters) {
      return mapKeys(
        merge({}, ...map(getters.filters, filter => filter.query)),
        (v, k) => snakeCase(k)
      );
    }
  },

  actions: {
    initializeFilters({ commit, getters, dispatch }) {
      if (size(getters.filters)) {
        // Because of a shared global loader flag, there is a subtle bug when navigating fast from one module that
        // doesn't have filters loaded to another that has filters loaded.
        // The latter will still be loading until the former finishes loading filters.
        commit('ARE_FILTERS_LOADING', false, { root: true });

        return;
      }
      // otherwise filter sets mixin will take care of loading filters
      if (useFilterSets) {
        return dispatch('filterSets/initializeFilterSets');
      }

      return dispatch('loadFilters');
    },

    async loadFilters({ commit, dispatch }) {
      try {
        commit('ARE_FILTERS_LOADING', true, { root: true });

        const filters = await dispatch('fetchFilters');

        commit('SET_FILTERS', filters);

        return filters;
      } finally {
        commit('ARE_FILTERS_LOADING', false, { root: true });
      }
    },

    async reloadFilters({ commit }, filters) {
      forEach(filters, newFilter =>
        commit('MERGE_FILTER', { filterId: newFilter.id, newFilter })
      );

      return filters;
    },

    async fetchFilters(context, filtersQuery) {
      const { data } = await fetchFilters(namespace, { filter: filtersQuery });

      return map(data, filterFactory);
    },

    async fetchOptions({ getters }, { endpoint, pattern }) {
      const { data } = await fetchOptions(endpoint, {
        ...getters.query,
        pattern
      });
      return data;
    },

    async togglePin({ commit, getters, dispatch }, filter) {
      const { id, pinned } = filter;

      const data = {
        filter: id,
        pinned: !pinned
      };

      if (useFilterSets && getters['filterSets/activeFilterSet']) {
        commit('TOGGLE_PINNED', id);

        await dispatch('filterSets/editFilterSet', {
          ...getters['filterSets/activeFilterSet']
        });
      } else {
        await setFilterPin(namespace, data);

        commit('TOGGLE_PINNED', id);
      }
    }
  }
});
