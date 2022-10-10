import { mapActions, mapGetters, mapMutations } from 'vuex';
import { resolveLatest } from '@/utils/function';
import createFilterSetMixin from '@/mixins/filter-sets.mixin';

export default (namespace, useFilterSets = false) => ({
  ...(useFilterSets && {
    mixins: [createFilterSetMixin(namespace)]
  }),

  computed: {
    ...mapGetters(`${namespace}/filters`, ['filter', 'filters', 'filtersQuery'])
  },

  methods: {
    ...mapActions(`${namespace}/filters`, [
      'initializeFilters',
      'loadFilters',
      'fetchFilters',
      'reloadFilters',
      'fetchOptions',
      'togglePin'
    ]),
    ...mapMutations(`${namespace}/filters`, [
      'ADD_FILTER',
      'SET_FILTERS',
      'UPDATE_FILTER'
    ]),

    async refreshFilters() {
      try {
        const filters = await this.resolveLatestFetchFilters(this.filtersQuery);

        this.reloadFilters(filters);
      } catch (stale) {}
    },

    updateFilter(filter) {
      this.UPDATE_FILTER(filter);

      if (filter.reload) {
        this.refreshFilters();
      }
    }
  },

  data() {
    return {
      resolveLatestFetchFilters: null
    };
  },

  created() {
    this.resolveLatestFetchFilters = resolveLatest(this.fetchFilters);
  }
});
