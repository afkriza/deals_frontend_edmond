import createFiltersModule from '@/store/modules/dynamic/filters.module';

export default {
  namespaced: true,
  modules: {
    dealsFilters: createFiltersModule('groups/deals'),
    partnersFilters: createFiltersModule('groups/partners')
  }
};
