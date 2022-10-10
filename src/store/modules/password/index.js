import state from 'store/modules/password/state';
import getters from 'store/modules/password/getters';
import mutations from 'store/modules/password/mutations';
import * as actions from 'store/modules/password/actions';

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
