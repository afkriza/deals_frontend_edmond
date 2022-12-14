import * as localStorage from '@/api/local-storage';
import * as mutationTypes from 'store/mutation-types';

export default {
  [mutationTypes.SESSION_REQUEST](state) {
    state.session.isLoading = true;
  },

  [mutationTypes.SESSION_SUCCESS](state, { user, token }) {
    state.session.isLoading = false;
    state.session.isLoaded = true;
    state.session.user = user;
    state.session.token = token;

    localStorage.setItem('api-token', token);
  },

  [mutationTypes.SESSION_FAILURE](state) {
    state.session.isLoading = false;
    state.session.isLoaded = true;
  },

  [mutationTypes.SESSION_DESTROY](state) {
    state.session.user = null;
    state.session.token = '';
  },

  [mutationTypes.UNAUTHENTICATED_REQUEST](state, pathName) {
    state.session.nextPathName = pathName;
  }
};
