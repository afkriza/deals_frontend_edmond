import state from 'store/modules/rates/state';
import getters from 'store/modules/rates/getters';
import mutations from 'store/modules/rates/mutations';
import actionsGenerator from 'store/modules/rates/actions';
import databases from 'databases';
import createFiltersModule from '@/store/modules/dynamic/filters.module';

const actions = actionsGenerator({ databases });

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {
    filters: createFiltersModule('rates')
  }
};
