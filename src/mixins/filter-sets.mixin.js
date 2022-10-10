import { mapActions, mapGetters, mapMutations } from 'vuex';
import { resolveLatest } from '@/utils/function';
import { cloneDeep } from 'lodash';

export default namespace => ({
  computed: {
    ...mapGetters(`${namespace}/filters/filterSets`, [
      'filterSets',
      'activeFilterSet',
      'defaultFilterSet'
    ])
  },

  methods: {
    ...mapActions(`${namespace}/filters/filterSets`, [
      'initializeFilterSets',
      'loadFilterSets',
      'createFilterSet',
      'editFilterSet',
      'deleteFilterSet',
      'updateFiltersFromActiveFilterSet'
    ]),
    ...mapActions(`${namespace}/filters`, ['loadFilters']),
    ...mapMutations(`${namespace}/filters/filterSets`, ['FILTER_SET_ACTIVE']),

    onFilterSetCreate({ name, isPublic, isDefault }) {
      return this.createFilterSet({
        name,
        isPublic,
        isDefault,
        domain: namespace.replace('-', '_')
      });
    },

    onFilterSetEdit({ id, name, configuration, isPublic, isDefault }) {
      return this.editFilterSet({
        id,
        name,
        configuration,
        isPublic,
        isDefault,
        domain: namespace.replace('-', '_')
      });
    },

    async onFilterSetDelete({ id }) {
      return this.deleteFilterSet(id);
    },

    onFilterSetSelect(filterSet) {
      this.FILTER_SET_ACTIVE(filterSet.id);

      this.updateFiltersFromActiveFilterSet();
    }
  }
});
