import * as mutationTypes from 'store/mutation-types';

export default function (prefix, collectionName) {
  return {
    [mutationTypes[`${prefix}_REQUEST`]](state) {
      state[collectionName].isLoading = true;
      state[collectionName].isLoaded = false;
    },

    [mutationTypes[`${prefix}_SUCCESS`]](state, { units, unitTypeByRanking }) {
      state[collectionName].data = units;
      state[collectionName].isLoading = false;
      state[collectionName].isLoaded = true;
      state.unitTypeByRanking = unitTypeByRanking;
    },

    [mutationTypes[`${prefix}_FAILURE`]](state) {
      state[collectionName].isLoading = false;
      state[collectionName].isLoaded = false;
    },

    [mutationTypes[`${prefix}_UPDATE`]](state, { unitID, value }) {
      const unitToUpdate = state[collectionName].data.find(
        ({ id }) => id === unitID
      );
      if (unitToUpdate) {
        unitToUpdate.setValue(value);
      }
    },

    [mutationTypes[`${prefix}_BULK_UPDATE`]](state, { unitIDs, value }) {
      const unitsToUpdate = state[collectionName].data.filter(({ id }) =>
        unitIDs.includes(id)
      );
      if (unitsToUpdate) {
        unitsToUpdate.forEach(unit => unit.setValue(value));
      }
    },

    [mutationTypes[`${prefix}_CLEAR`]](state) {
      state[collectionName].data = [];
      state[collectionName].isLoading = false;
      state[collectionName].isLoaded = false;
    }
  };
}
