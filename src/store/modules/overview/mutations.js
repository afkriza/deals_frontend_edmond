import { map } from 'lodash';

import * as mutationTypes from 'store/mutation-types';

export default {
  [mutationTypes.OVERVIEW_FILTERS_REQUEST](state) {
    state.filters.isLoading = true;
  },

  [mutationTypes.OVERVIEW_FILTERS_SUCCESS](state, { data }) {
    state.filters.isLoading = false;
    state.filters.isLoaded = true;

    state.filters.data = data;
  },

  [mutationTypes.OVERVIEW_FILTERS_FAILURE](state) {
    state.filters.isLoading = false;
  },

  [mutationTypes.OVERVIEW_FILTERS_UPDATE](state, filters) {
    state.filters.data = filters;
  },

  [mutationTypes.OVERVIEW_FILTER_UPDATE](state, filter) {
    state.filters.data = map(state.filters.data, f => {
      if (f.id === filter.id) {
        return filter;
      }
      return f;
    });
  },

  [mutationTypes.OVERVIEW_DATA_REQUEST](state) {
    state.itemsData.isLoading = true;
  },

  [mutationTypes.OVERVIEW_DATA_SUCCESS](state, { data }) {
    state.itemsData.data = data;

    state.itemsData.isLoading = false;
    state.itemsData.isLoaded = true;
  },

  [mutationTypes.OVERVIEW_DATA_FAILURE](state) {
    state.itemsData.isLoading = false;
  },

  [mutationTypes.OVERVIEW_ITEM_DETAILS_REQUEST](state) {
    state.itemDetails.isLoading = true;
  },

  [mutationTypes.OVERVIEW_ITEM_DETAILS_SUCCESS](state, { data }) {
    state.itemDetails.data = data;

    state.itemDetails.isLoading = false;
    state.itemDetails.isLoaded = true;
  },

  [mutationTypes.OVERVIEW_ITEM_DETAILS_FAILURE](state) {
    state.itemDetails.isLoading = false;
  },

  [mutationTypes.OVERVIEW_NOTIFICATIONS_SEEN](state, calculation) {
    state.itemsData.data.calculations = map(
      state.itemsData.data.calculations,
      c => {
        if (c.bookingPeriod === calculation.bookingPeriod) {
          c.notifications.seen = true;
        }

        return c;
      }
    );
  }
};
