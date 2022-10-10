import * as mutationTypes from 'store/mutation-types';

export default {
  [mutationTypes.START_FULLSCREEN](state) {
    state.fullscreen = true;
  },

  [mutationTypes.END_FULLSCREEN](state) {
    state.fullscreen = false;
  },
  [mutationTypes.START_NO_PADDING](state) {
    state.noPadding = true;
  },

  [mutationTypes.END_NO_PADDING](state) {
    state.noPadding = false;
  }
};
