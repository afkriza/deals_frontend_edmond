import { checkoutTabsEnum } from 'enums/checkout-tabs';

export default {
  lastCreatedAt(state, getters) {
    const units = getters.units;

    return (
      units && units[units.length - 1] && units[units.length - 1].createdAt
    );
  },

  uniqueRequestGuids(state) {
    return state.history.uniqueRequestGuids;
  },

  isHistoryDataLoading(state) {
    return state.history.isLoading;
  },

  units(state) {
    return state.history.data;
  },

  isHistoryFullyLoaded(state) {
    return state.history.isFullyLoaded;
  },

  tabs() {
    return [
      {
        id: checkoutTabsEnum.RATES.id,
        name: checkoutTabsEnum.RATES.name
      },
      {
        id: checkoutTabsEnum.INVENTORIES.id,
        name: checkoutTabsEnum.INVENTORIES.name
      }
    ];
  },

  activeTabID(state) {
    return state.history.activeTabID || checkoutTabsEnum.RATES.id;
  },

  isRatesTab(state, getters) {
    return getters.activeTabID === checkoutTabsEnum.RATES.id;
  },

  isInventoryTab(state, getters) {
    return getters.activeTabID === checkoutTabsEnum.INVENTORIES.id;
  }
};
