import unitGetters from 'utils/unit/getters';

export default {
  units(state) {
    return state.inventory.data;
  },

  unitTypeByRanking(state) {
    return state.unitTypeByRanking;
  },

  isInventoryDataLoaded(state) {
    return state.inventory.isLoaded;
  },

  isInventoryDataLoading(state) {
    return state.inventory.isLoading;
  },

  unitsInCheckout(state, getters, rootState, rootGetters) {
    return rootGetters['checkout/inventory'];
  },

  storageHasData(state) {
    return state.storage.hasData;
  },

  ...unitGetters
};
