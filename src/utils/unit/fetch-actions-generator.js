import { map, find } from 'lodash';

import * as mutationTypes from 'store/mutation-types';

export default function (
  { databases },
  prefix,
  { databaseName, UnitModel, checkoutRootGetter, fetchAction }
) {
  return {
    async fetchUnits({ commit, getters, dispatch }, filtersQuery) {
      commit(mutationTypes[`${prefix}_REQUEST`]);
      await databases[databaseName].truncate();
      fetchAction(filtersQuery)
        .then(({ data, meta }) => {
          dispatch('saveUnits', { data, meta });
          if (getters.filterTabs.length) {
            commit(
              mutationTypes[`${prefix}_FILTER_TAB_CHANGE`],
              getters.filterTabs[0].id
            );
          }
        })
        .catch(error => {
          commit(mutationTypes[`${prefix}_FAILURE`]);
          throw error;
        });
    },

    saveUnits({ commit, rootGetters }, { data: units, meta }) {
      const checkoutUnits = rootGetters[checkoutRootGetter];
      const unitsObjects = units
        .map(unit => {
          let additionalRatesUnitInfo;

          if (meta && meta.priceLists) {
            const bookingDate = unit.bookingDate.replaceAll('-', '');
            const roomTypeId = unit.unitType.id;

            const priceLevelsAndAmounts =
              meta.priceLists[bookingDate][roomTypeId] || [];

            const priceLevels = map(priceLevelsAndAmounts, 'priceLevel');
            const priceAmounts = map(priceLevelsAndAmounts, 'priceAmount');

            const defaultValues = find(priceLevelsAndAmounts, ['default', 1]);
            const defaultPriceLevel = defaultValues
              ? defaultValues.priceLevel
              : null;
            const defaultPriceAmount = defaultValues
              ? defaultValues.priceAmount
              : null;

            additionalRatesUnitInfo = {
              priceLevels,
              priceAmounts,
              defaultPriceLevel,
              defaultPriceAmount
            };
          }

          return new UnitModel({
            ...unit,
            ...additionalRatesUnitInfo
          });
        })
        .map(unit => {
          const checkoutUnit = checkoutUnits.find(({ id }) => id === unit.id);
          if (checkoutUnit) {
            unit.setValue(checkoutUnit);
          }

          return unit;
        });

      commit(mutationTypes[`${prefix}_SUCCESS`], {
        units: unitsObjects,
        unitTypeByRanking: meta.unitTypeByRanking
      });
    }
  };
}
