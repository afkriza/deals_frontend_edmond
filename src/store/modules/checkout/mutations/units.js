import { findIndex } from 'lodash';

import { checkoutTabsEnum } from 'enums/checkout-tabs';
import * as mutationTypes from 'store/mutation-types';

function getUnits(state) {
  const isRatesTab =
    (state.activeTabID || checkoutTabsEnum.RATES.id) ===
    checkoutTabsEnum.RATES.id;
  return isRatesTab ? state.rates : state.inventory;
}

export default {
  [mutationTypes.CHECKOUT_UNIT_REMOVE](state, unitID) {
    const units = getUnits(state);
    const index = findIndex(units, ({ id }) => id === unitID);
    if (index > -1) {
      units.splice(index, 1);
    }
  },

  [mutationTypes.CHECKOUT_UNIT_UPDATE](state, { unitID, value }) {
    const units = getUnits(state);
    const unit = units.find(({ id }) => id === unitID);
    if (typeof value.confirmed === 'boolean') {
      unit.confirmed = value.confirmed;
    }
  },

  [mutationTypes.CHECKOUT_UNIT_LOAD](state, { rates = [], inventory = [] }) {
    if (rates.length) {
      state.rates.splice(0, state.rates.length);

      rates.forEach(unit => {
        unit.confirmed = false;
      });

      state.rates = state.rates.concat(rates);
    }

    if (inventory.length) {
      state.inventory.splice(0, state.inventory.length);

      inventory.forEach(unit => {
        unit.confirmed = false;
      });

      state.inventory = state.inventory.concat(inventory);
    }
  },

  [mutationTypes.CHECKOUT_UNITS_SAVED](state) {
    state.isDataSaved = true;
    state.isDataSaving = false;
  },

  [mutationTypes.CHECKOUT_UNITS_SAVING](state) {
    state.isDataSaving = true;
    state.isDataSaved = false;
  },

  [mutationTypes.CHECKOUT_UNITS_RESET](state) {
    state.isDataSaving = false;
    state.isDataSaved = false;
  },

  [mutationTypes.CHECKOUT_UNITS_ERROR](state, error) {
    state.isDataSaving = false;
    state.isDataSaved = false;
    state.error = error.message;
  },

  [mutationTypes.CHECKOUT_CLEAR_UNITS_ERROR](state) {
    state.error = '';
  },

  [mutationTypes.CHECKOUT_ACTIVITY](state, { activeTab, activities }) {
    if (!activities) {
      return;
    }

    activities.forEach(activity => {
      const matchingUnit = state[activeTab].find(unit =>
        unit.isMatchingActivity(activity)
      );

      if (matchingUnit) {
        matchingUnit.lastActivity = activity;
      }
    });
  }
};
