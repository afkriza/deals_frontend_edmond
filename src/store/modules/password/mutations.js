import * as mutationTypes from 'store/mutation-types';

export default {
  [mutationTypes.PASSWORD_CREATE](state) {
    state.password.isSaving = true;
    state.password.isSaved = false;
  },

  [mutationTypes.PASSWORD_CREATE_SUCCESS](state) {
    state.password.isSaving = false;
    state.password.isSaved = true;
  },

  [mutationTypes.PASSWORD_CREATE_FAILURE](state) {
    state.password.isSaving = false;
    state.password.isSaved = false;
  }
};
