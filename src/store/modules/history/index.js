import state from 'store/modules/history/state';
import getters from 'store/modules/history/getters';
import mutations from 'store/modules/history/mutations';
import * as actions from 'store/modules/history/actions';
import createFiltersModule from '@/store/modules/dynamic/filters.module';

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {
    filters: createFiltersModule('activity-logs')
  }
};
