import { checkoutTabsEnum } from 'enums/checkout-tabs';

import { groupBy, uniq } from 'utils/collection';
import { parseISO, format, min, max } from 'date-fns';

export default {
  rates(state) {
    return state.rates;
  },

  inventory(state) {
    return state.inventory;
  },

  error(state) {
    return state.error;
  },

  units(state, getters) {
    return getters.activeTabID === checkoutTabsEnum.RATES.id
      ? getters.rates
      : getters.inventory;
  },

  tabs(state, getters) {
    return [
      {
        id: checkoutTabsEnum.RATES.id,
        name: checkoutTabsEnum.RATES.name,
        quantity: getters.rates.length
      },
      {
        id: checkoutTabsEnum.INVENTORIES.id,
        name: checkoutTabsEnum.INVENTORIES.name,
        quantity: getters.inventory.length
      }
    ];
  },

  activeTabID(state) {
    return state.activeTabID || checkoutTabsEnum.RATES.id;
  },

  isRatesTab(state, getters) {
    return getters.activeTabID === checkoutTabsEnum.RATES.id;
  },

  isInventoryTab(state, getters) {
    return getters.activeTabID === checkoutTabsEnum.INVENTORIES.id;
  },

  confirmedRateUnits(state) {
    return state.rates.filter(unit => unit.confirmed);
  },

  confirmedInventoryUnits(state) {
    return state.inventory.filter(unit => unit.confirmed);
  },

  unitTypesByProperty(state) {
    return state.unitTypes.data;
  },

  activityFilters(state, getters) {
    const units = getters.isRatesTab ? getters.rates : getters.inventory;
    const propertyGroupedUnits = groupBy(units, unit => unit.property.id);

    return Object.keys(propertyGroupedUnits).map(property => {
      const currentPropertyUnits = propertyGroupedUnits[property];

      const unitType = uniq(currentPropertyUnits.map(unit => unit.unitType.id));
      const channel = uniq(currentPropertyUnits.map(unit => unit.channel.id));
      const dates = uniq(
        currentPropertyUnits.map(unit => unit.bookingDate)
      ).map(parseISO);

      return {
        property,
        channel,
        unit_type: unitType,
        start_date: format(min(dates), 'yyyy-MM-dd'),
        end_date: format(max(dates), 'yyyy-MM-dd')
      };
    });
  }
};
