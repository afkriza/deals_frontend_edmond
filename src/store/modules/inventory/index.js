import state from 'store/modules/inventory/state';
import getters from 'store/modules/inventory/getters';
import mutations from 'store/modules/inventory/mutations';
import actionsGenerator from 'store/modules/inventory/actions';
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
    filters: createFiltersModule('inventories')
  }
};
