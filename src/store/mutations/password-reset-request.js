import * as mutationTypes from 'store/mutation-types';

export default {
  [mutationTypes.PASSWORD_RESET_REQUEST](state) {
    state.forms.passwordResetRequest.isLoading = true;
  },

  [mutationTypes.PASSWORD_RESET_SUCCESS](state) {
    state.forms.passwordResetRequest.isLoading = false;
  },

  [mutationTypes.PASSWORD_RESET_FAILURE](state) {
    state.forms.passwordResetRequest.isLoading = false;
  },

  [mutationTypes.PASSWORD_PAGE_RESET_REQUEST](state) {
    state.forms.passwordPageResetRequest.isLoading = true;
  },

  [mutationTypes.PASSWORD_PAGE_RESET_SUCCESS](state) {
    state.forms.passwordPageResetRequest.isLoading = false;
  },

  [mutationTypes.PASSWORD_PAGE_RESET_FAILURE](state) {
    state.forms.passwordPageResetRequest.isLoading = false;
  }
};
