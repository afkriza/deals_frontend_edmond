import { find } from 'lodash';
import { warn } from '@/api/logger';
import * as mutationTypes from 'store/mutation-types';

import Rate from 'models/Rate';
import Inventory from 'models/Inventory';
import {
  sendRatesCheckout,
  sendInventoriesCheckout,
  fetchRatesCheckoutActivity,
  fetchInventoriesCheckoutActivity,
  fetchAllUnitTypesForProperty
} from 'api/services/Checkout.service';

export default function ({ databases }) {
  return {
    async saveRate({ dispatch, getters }, rates) {
      const ratesForCheckout = rates.map(rate => {
        const rateInCheckout =
          getters.rates.find(({ id }) => id === rate.id) || {};
        return {
          ...rate,
          _rev: rateInCheckout._rev
        };
      });

      await databases.checkoutRates.addAll(ratesForCheckout);
      await dispatch('loadRate');
    },

    async loadRate({ commit }) {
      const rates = await databases.checkoutRates.getAll();
      commit(mutationTypes.CHECKOUT_UNIT_LOAD, {
        rates: rates.map(({ doc }) => new Rate(doc))
      });
    },

    async saveInventory({ dispatch, getters }, inventories) {
      const inventoriesForCheckout = inventories.map(inventory => {
        const inventoryInCheckout =
          getters.inventory.find(({ id }) => id === inventory.id) || {};
        return {
          ...inventory,
          _rev: inventoryInCheckout._rev
        };
      });

      await databases.checkoutInventory.addAll(inventoriesForCheckout);
      await dispatch('loadInventory');
    },

    async loadInventory({ commit }) {
      const inventories = await databases.checkoutInventory.getAll();
      commit(mutationTypes.CHECKOUT_UNIT_LOAD, {
        inventory: inventories.map(({ doc }) => new Inventory(doc))
      });
    },

    async removeUnit({ commit, getters }, unitID) {
      let unit;
      const isRatesTab = getters.isRatesTab;
      const databaseName = isRatesTab ? 'rates' : 'inventory';

      try {
        const units = await databases[databaseName].getAll();

        const unitData = find(units, ['doc._id', unitID]);

        if (unitData) {
          const { doc } = unitData;
          unit = isRatesTab ? new Rate(doc) : new Inventory(doc);
        }
      } catch (e) {
        if (e.error) {
          // NOTE: rate does not exist
          warn(`Error with finding checkout unit (${unitID})`, e);
        } else {
          throw e;
        }
      }

      if (unit) {
        unit.resetChanges();
        await databases[databaseName].put(unit);
      }

      const checkoutUnit = getters.units.find(({ id }) => id === unitID);
      try {
        const checkoutDatabaseName = isRatesTab
          ? 'checkoutRates'
          : 'checkoutInventory';
        await databases[checkoutDatabaseName].remove(
          checkoutUnit._id,
          checkoutUnit._rev
        );
      } catch (e) {
        if (e.error) {
          warn(
            `Error with removing checkout unit (${checkoutUnit._id}/${checkoutUnit.localID}) from IndexDB`,
            e
          );
        } else {
          throw e;
        }
      }

      commit(mutationTypes.CHECKOUT_UNIT_REMOVE, unitID);
    },

    async loadData({ commit, dispatch }) {
      const rates = dispatch('loadRate');
      const inventory = dispatch('loadInventory');
      await Promise.all([rates, inventory]);
      commit(mutationTypes.LOCAL_DATABASE_LOADED);
    },

    checkoutUnits({ commit, getters, dispatch }) {
      const isRatesTab = getters.isRatesTab;

      const confirmedUnits =
        getters[isRatesTab ? 'confirmedRateUnits' : 'confirmedInventoryUnits'];
      const checkoutMethod = isRatesTab
        ? sendRatesCheckout
        : sendInventoriesCheckout;
      const module = isRatesTab ? 'rates' : 'inventory';

      commit(mutationTypes.CHECKOUT_UNITS_SAVING);

      return checkoutMethod(confirmedUnits)
        .then(async () => {
          await Promise.all(
            confirmedUnits.map(unit => dispatch('removeUnit', unit.id))
          );

          // if at least one unit is checked out, the grid should be wiped for user reload
          // data for both modules needs to be wiped no matter on which the change was made
          if (confirmedUnits.length > 0) {
            dispatch('rates/clearDatabase', null, { root: true });
            dispatch('inventory/clearDatabase', null, { root: true });
            commit(`rates/${mutationTypes['RATES_CLEAR']}`, null, {
              root: true
            });
            commit(`inventory/${mutationTypes['INVENTORY_CLEAR']}`, null, {
              root: true
            });
          }

          commit(mutationTypes.CHECKOUT_UNITS_SAVED);
          setTimeout(() => {
            commit(mutationTypes.CHECKOUT_UNITS_RESET);
          }, 3000);
        })
        .catch(errors => {
          commit(mutationTypes.CHECKOUT_UNITS_RESET);

          return Promise.reject(errors);
        });
    },

    fetchUnitsActivity({ commit, getters }) {
      const activeTab = getters.isRatesTab ? 'rates' : 'inventory';
      const requestMethod = getters.isRatesTab
        ? fetchRatesCheckoutActivity
        : fetchInventoriesCheckoutActivity;

      const requests = getters.activityFilters.map(filters => {
        return requestMethod(filters).then(({ data }) => {
          data.forEach(response => {
            commit(mutationTypes.CHECKOUT_ACTIVITY, {
              activeTab,
              activities: response.data
            });
          });
        });
      });

      return Promise.all(requests);
    },

    fetchAllUnitTypesForProperty({ commit }, propertyID) {
      commit(mutationTypes.UNIT_TYPES_REQUEST);
      return fetchAllUnitTypesForProperty(propertyID)
        .then(({ data }) => {
          commit(mutationTypes.UNIT_TYPES_SUCCESS, { data, propertyID });
        })
        .catch(error => {
          commit(mutationTypes.UNIT_TYPES_FAILURE);
          throw error;
        });
    }
  };
}
