import * as mutationTypes from 'store/mutation-types';

export default {
  [mutationTypes.USER_UPDATE_REQUEST](state) {
    state.forms.user.isLoading = true;
  },

  [mutationTypes.USER_UPDATE_SUCCESS](state, { user }) {
    state.forms.user.isLoading = false;
    if (state.session.user.id === user.data.id) {
      state.session.user = user.data;
    }
  },

  [mutationTypes.USER_UPDATE_FAILURE](state) {
    state.forms.user.isLoading = false;
  }
};
