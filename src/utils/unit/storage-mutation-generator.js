import * as mutationTypes from 'store/mutation-types';

export default function (prefix, collectionName, UnitClass) {
  return {
    [mutationTypes[`${prefix}_STORAGE_SAVE_START`]](state) {
      state.storage.isLoading = true;
    },

    [mutationTypes[`${prefix}_STORAGE_SAVE_END`]](state) {
      state.storage.isLoading = false;
      state.storage.hasData = true;

      state[collectionName].data.splice(0, state[collectionName].data.length);
      state[collectionName].isLoaded = false;
    },

    [mutationTypes[`${prefix}_STORAGE_LOAD_START`]](state) {
      state[collectionName].isLoading = true;
    },

    [mutationTypes[`${prefix}_STORAGE_LOAD_END`]](state, { units }) {
      state[collectionName].isLoading = false;
      if (units.length) {
        state[collectionName].data = units.map(({ doc }) => {
          return new UnitClass(doc);
        });
        state[collectionName].isLoaded = true;
      }
    },

    [mutationTypes[`${prefix}_STORAGE_CLEAR`]](state) {
      state.storage.hasData = false;
    }
  };
}
