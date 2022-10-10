import { forEach, map, set, unset, without, size, pick } from 'lodash';
import { FilterSet } from '@/components/filters/models/FilterSet.model';

import {
  createFilterSet,
  deleteFilterSet,
  editFilterSet,
  fetchFilterSets
} from 'api/services/FilterSets.service';

const userAttributeByNamespace = {
  analytics: 'defaultAnalyticsFilterSet',
  'rate-shopper': 'defaultRateShopperFilterSet'
};

export default namespace => ({
  namespaced: true,

  state: () => ({
    filterSetsById: {},
    filterSetIds: [],
    activeFilterSetId: null,
    defaultFilterSetId: null
  }),

  mutations: {
    FILTER_SET_DELETE(state, filterSetId) {
      state.filterSetIds = without(state.filterSetIds, filterSetId);
      unset(state.filterSetsById, filterSetId);

      if (state.activeFilterSetId === filterSetId) {
        state.activeFilterSetId = null;
      }

      if (state.defaultFilterSetId === filterSetId) {
        state.defaultFilterSetId = null;
      }
    },

    FILTER_SET_ADD(state, filterSet) {
      state.filterSetIds.push(filterSet.id);
      set(state.filterSetsById, filterSet.id, filterSet);
    },

    FILTER_SET_ACTIVE(state, filterSetId) {
      state.activeFilterSetId = filterSetId;
    },

    FILTER_SET_UPDATE(state, filterSet) {
      state.filterSetsById = {
        ...state.filterSetsById,
        [filterSet.id]: filterSet
      };
    },

    FILTER_SET_DEFAULT(state, filterSetId) {
      state.defaultFilterSetId = filterSetId;
    }
  },

  getters: {
    filterSet(state) {
      return id => state.filterSetsById[id];
    },

    filterSets(state) {
      return map(
        state.filterSetIds,
        filterSetId => state.filterSetsById[filterSetId]
      );
    },

    activeFilterSet(state, getters) {
      return getters.filterSet(state.activeFilterSetId);
    },

    defaultFilterSet(state, getters) {
      return getters.filterSet(state.defaultFilterSetId);
    }
  },

  actions: {
    async initializeFilterSets({ getters, dispatch }) {
      if (size(getters.filterSets)) {
        return;
      }

      await dispatch('loadFilterSets');

      return getters.activeFilterSet
        ? dispatch('updateFiltersFromActiveFilterSet')
        : dispatch(`${namespace}/filters/loadFilters`, null, { root: true });
    },

    updateFiltersFromActiveFilterSet({ commit, getters }) {
      commit(
        `${namespace}/filters/SET_FILTERS`,
        map(getters.activeFilterSet.configuration.filters, filter =>
          filter.copy()
        ),
        { root: true }
      );
    },

    async createFilterSet({ commit, rootGetters, dispatch }, filterSetDto) {
      const filters = rootGetters[`${namespace}/filters/filters`];

      if (!filters) {
        throw new Error(
          `Expected filters getter to be defined inside ${namespace}/filters module`
        );
      }

      const configuration = { filters };

      let { data: filterSet } = await createFilterSet({
        ...pick(filterSetDto, ['name', 'domain']),
        public: filterSetDto.isPublic,
        configuration
      });

      filterSet = FilterSet.deserialize({ ...filterSet, owner: true });

      if (filterSetDto.isDefault) {
        await dispatch(
          'updateCurrentUser',
          {
            [userAttributeByNamespace[namespace]]: {
              id: Number(filterSet.id),
              type: 'filter_set'
            }
          },
          { root: true }
        );

        commit('FILTER_SET_DEFAULT', filterSet.id);
      }

      commit('FILTER_SET_ADD', filterSet);

      commit('FILTER_SET_ACTIVE', filterSet.id);

      return filterSet;
    },

    async editFilterSet(
      { state, commit, rootGetters, dispatch },
      filterSetDto
    ) {
      if (
        (state.defaultFilterSetId === filterSetDto.id &&
          !filterSetDto.isDefault) ||
        (state.defaultFilterSetId !== filterSetDto.id && filterSetDto.isDefault)
      ) {
        commit(
          'FILTER_SET_DEFAULT',
          filterSetDto.isDefault ? filterSetDto.id : null
        );

        dispatch(
          'updateCurrentUser',
          {
            [userAttributeByNamespace[namespace]]: {
              id: filterSetDto.isDefault ? Number(filterSetDto.id) : '',
              type: 'filter_set'
            }
          },
          { root: true }
        );
      }

      if (state.activeFilterSetId === filterSetDto.id) {
        const filters = rootGetters[`${namespace}/filters/filters`];

        if (!filters) {
          throw new Error(
            `Expected filters getter to be defined inside ${namespace}/filters module`
          );
        }
        filterSetDto.configuration = { filters };
      }

      let { data: filterSet } = await editFilterSet({
        ...pick(filterSetDto, ['id', 'name', 'configuration', 'domain']),
        public: filterSetDto.isPublic
      });
      filterSet = FilterSet.deserialize({ ...filterSet, owner: true });

      commit('FILTER_SET_UPDATE', filterSet);

      return filterSet;
    },

    async deleteFilterSet({ commit }, filterSetId) {
      await deleteFilterSet(filterSetId);

      commit('FILTER_SET_DELETE', filterSetId);
    },

    async loadFilterSets({ dispatch, commit }) {
      const filterSets = await dispatch('fetchFilterSets');

      forEach(filterSets, filterSet => {
        commit('FILTER_SET_ADD', filterSet);

        if (filterSet.default) {
          commit('FILTER_SET_ACTIVE', filterSet.id);
          commit('FILTER_SET_DEFAULT', filterSet.id);
        }
      });

      return filterSets;
    },

    async fetchFilterSets(context) {
      const { data } = await fetchFilterSets(namespace);

      return map(data, filterSetDto =>
        FilterSet.deserialize({
          ...filterSetDto,
          owner: context.rootState.session.user.id === filterSetDto.user.id
        })
      );
    }
  }
});
