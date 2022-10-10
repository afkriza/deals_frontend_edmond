import * as localStorage from '@/api/local-storage';

import state from 'store/modules/checkout/state';
import getters from 'store/modules/checkout/getters';
import mutations from 'store/modules/checkout/mutations';
import actionsGenerator from 'store/modules/checkout/actions';
import databases from 'databases';

const actions = actionsGenerator({ localStorage, databases });

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
