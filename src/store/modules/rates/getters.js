import unitGetters from 'utils/unit/getters';

export default {
  units(state) {
    return state.rates.data;
  },

  unitTypeByRanking(state) {
    return state.unitTypeByRanking;
  },

  isRatesDataLoaded(state) {
    return state.rates.isLoaded;
  },

  isRatesDataLoading(state) {
    return state.rates.isLoading;
  },

  unitsInCheckout(state, getters, rootState, rootGetters) {
    return rootGetters['checkout/rates'];
  },

  storageHasData(state) {
    return state.storage.hasData;
  },

  ...unitGetters
};
