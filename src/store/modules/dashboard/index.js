import state from '@/store/modules/dashboard/state';
import getters from '@/store/modules/dashboard/getters';
import mutations from '@/store/modules/dashboard/mutations';
import actionsGenerator from '@/store/modules/dashboard/actions';
import createFiltersModule from '@/store/modules/dynamic/filters.module';

export default namespace => ({
  namespaced: true,
  state,
  getters,
  mutations,
  actions: actionsGenerator(namespace),
  modules: {
    filters: createFiltersModule(namespace, true)
  }
});
