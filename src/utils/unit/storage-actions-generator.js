import { warn } from '@/api/logger';

import * as mutationTypes from 'store/mutation-types';

export default function ({ databases }, prefix, dataName, UnitClass) {
  return {
    saveToStorage({ commit, state }) {
      commit(mutationTypes[`${prefix}_STORAGE_SAVE_START`]);
      const data = state[dataName].data.map(unit => unit.clone());

      return databases[dataName].addAll(data).then(() => {
        commit(mutationTypes[`${prefix}_STORAGE_SAVE_END`]);
      });
    },

    async saveSingleToStorage({ commit, state }, unit) {
      commit(mutationTypes[`${prefix}_STORAGE_SAVE_START`]);
      let doc;

      try {
        doc = await databases[dataName].get(unit._id);
      } catch (e) {
        if (e.error) {
          warn(
            `Error with fetching ${prefix} unit (${unit._id}/${unit.localID}) from IndexDB`,
            e
          );
        } else {
          throw e;
        }
      }

      const unitToUpdate = new UnitClass(doc);
      unitToUpdate.updateUnit();

      return databases[dataName].put(unitToUpdate).then(() => {
        commit(mutationTypes[`${prefix}_STORAGE_SAVE_END`]);
      });
    },

    loadFromStorage({ commit, state }) {
      if (state.storage.hasData) {
        commit(mutationTypes[`${prefix}_STORAGE_LOAD_START`]);
        return databases[dataName].getAll().then(units => {
          commit(mutationTypes[`${prefix}_STORAGE_LOAD_END`], { units });
        });
      }
      return Promise.resolve();
    },

    clearDatabase({ commit }) {
      commit(mutationTypes[`${prefix}_STORAGE_CLEAR`]);

      return databases[dataName].truncate();
    }
  };
}
