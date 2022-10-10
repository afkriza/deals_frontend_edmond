import Vue from 'vue';

import * as mutationTypes from 'store/mutation-types';

import units from 'store/modules/checkout/mutations/units';

export default {
  ...units,

  [mutationTypes.CHECKOUT_ACTIVE_TAB_UPDATE](state, newTabID) {
    state.activeTabID = newTabID;
  },

  [mutationTypes.LOCAL_DATABASE_LOADED](state) {
    state.localDatabaseLoaded = true;
  },

  [mutationTypes.UNIT_TYPES_REQUEST](state) {
    state.unitTypes.isLoading = true;
  },

  [mutationTypes.UNIT_TYPES_SUCCESS](state, { data, propertyID }) {
    const unitTypeNames = data.map(({ name }) => name).sort();

    state.unitTypes.isLoaded = true;
    state.unitTypes.isLoading = false;

    Vue.set(state.unitTypes.data, propertyID, unitTypeNames);
  },

  [mutationTypes.UNIT_TYPES_FAILURE](state) {
    state.unitTypes.isLoading = false;
  }
};
