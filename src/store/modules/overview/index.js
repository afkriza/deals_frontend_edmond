import state from 'store/modules/overview/state';
import getters from 'store/modules/overview/getters';
import mutations from 'store/modules/overview/mutations';
import * as actions from 'store/modules/overview/actions';

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
