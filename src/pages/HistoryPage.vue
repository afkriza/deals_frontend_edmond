<template>
  <article :class="$style.page">
    <div
      v-show="filters.length"
      :class="[
        $style.filtersWrapper,
        {
          [$style.isLoaded]: isFiltersLoaded
        }
      ]"
    >
      <Filters
        :class="$style.filters"
        :filters="filters"
        :toggle-filter-pin="togglePin"
        @filter:update="onFilterUpdate"
        @expanded-filters:open="onExpandedFiltersOpen"
        @expanded-filters:close="onExpandedFiltersClose"
      />

      <filter-tabs
        :class="$style.tabs"
        :tabs="tabs"
        :activeTabID="activeTabID"
        @tab:change="activeTabChange"
      />
    </div>

    <div v-if="!hasData" :class="$style.emptyState">
      <div :class="$style.emptyStateImage">
        <!-- @svg("emptystate-history") -->
      </div>
      No changes were made during this period.
    </div>

    <template v-else>
      <units-table
        v-if="units.length"
        :units="units"
        :headerItems="activeHeaderItems"
      >
        <!-- TODO: avoid prop drilling for isRatesTab, try to slot nested components -->
        <history-row
          v-for="(unitGroup, index) in groupedChangedUnits"
          :key="index"
          :isRatesTab="isRatesTab"
          :unitGroup="unitGroup"
        />
        <intersection-emitter
          :class="$style.intersection"
          :key="units.length"
          @intersect="fetchNextPage"
        />
      </units-table>
    </template>
  </article>
</template>

<script>
  import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
  import { groupBy, size, cloneDeep, isEqual } from 'lodash';

  import FilterTabs from 'components/app/FilterTabs';
  import HistoryRow from 'components/history/Row';
  import UnitsTable from 'components/history/UnitsTable';

  import { createHeaderItems } from 'utils/history';

  import * as mutationTypes from 'store/mutation-types';
  import IntersectionEmitter from 'components/core/IntersectionEmitter';
  import Filters from '@/components/filters/Filters';

  import createFiltersMixin from '@/mixins/filters.mixin';

  export default {
    components: {
      Filters,
      IntersectionEmitter,
      FilterTabs,
      UnitsTable,
      HistoryRow
    },

    mixins: [createFiltersMixin('history')],

    computed: {
      isFiltersLoaded() {
        return Boolean(size(this.filters));
      },

      activeHeaderItems() {
        return this.isRatesTab
          ? this.headerItems.rates
          : this.headerItems.inventory;
      },

      hasData() {
        return Boolean(this.units.length);
      },

      unitsByChangedTime() {
        return groupBy(this.units, ({ requestGuid }) => requestGuid);
      },

      groupedChangedUnits() {
        return Object.keys(this.unitsByChangedTime)
          .map(unit => this.unitsByChangedTime[unit])
          .sort((unitA, unitB) => {
            return new Date(unitB[0].createdAt) - new Date(unitA[0].createdAt);
          });
      },

      ...mapGetters('history', [
        'activeTabID',
        'tabs',
        'isRatesTab',
        'isInventoryTab',
        'isHistoryDataLoading',
        'isHistoryFullyLoaded',
        'units'
      ])
    },

    watch: {
      filters() {
        if (this.areExpandedFiltersOpen) {
          return;
        }

        this.applyFilters();
      }
    },

    methods: {
      onFilterUpdate(filter) {
        this.UPDATE_FILTER(filter);

        this.refreshFilters();
      },

      onExpandedFiltersOpen() {
        this.areExpandedFiltersOpen = true;
        this.filtersSnapshot = cloneDeep(this.filters);
      },

      onExpandedFiltersClose() {
        this.areExpandedFiltersOpen = false;

        if (!isEqual(this.filters, this.filtersSnapshot)) {
          this.applyFilters();
        }
      },

      applyFilters() {
        this[mutationTypes.HISTORY_RESET]();
        this.fetchHistory();
      },

      fetchNextPage() {
        if (!this.isHistoryFullyLoaded && !this.isHistoryDataLoading) {
          this.fetchHistory();
        }
      },

      activeTabChange(newTabID) {
        this[mutationTypes.HISTORY_RESET]();
        this[mutationTypes.HISTORY_ACTIVE_TAB_UPDATE](newTabID);
        this.fetchHistory();
      },

      ...mapActions('history', ['fetchHistory']),

      ...mapMutations('history', [
        mutationTypes.HISTORY_RESET,
        mutationTypes.HISTORY_ACTIVE_TAB_UPDATE
      ])
    },

    data() {
      const rateLabels = [
        'Changed',
        'Property',
        'Valid for',
        'Channel',
        'Room type',
        'Availability',
        'Rate',
        'User'
      ];
      const inventoryLabels = [
        'Changed',
        'Property',
        'Valid for',
        'Channel',
        'Room type',
        'Availability',
        'Placed units',
        'User'
      ];

      return {
        headerItems: {
          rates: createHeaderItems(rateLabels),
          inventory: createHeaderItems(inventoryLabels)
        },
        isWarningShown: false,
        unitsToRemove: [],
        activityFetchInterval: null,
        checkoutDataSaved: false,
        areExpandedFiltersOpen: false,
        filtersSnapshot: null
      };
    },

    created() {
      this.initializeFilters();
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .page {
    @include column;
    min-height: 0;

    height: 100vh;
  }

  .filters {
    z-index: $z-filters;
  }

  .filters-wrapper {
    @include filters;

    background-color: $color-bg-main-dimmed;

    &:not(.is-loaded) {
      border-bottom: 1px solid $color-border-main;
    }
  }

  .empty-state {
    color: $color-text-main-lighter;
    width: 240px;
    margin: 240px auto 0;
    text-align: center;
  }

  .empty-state-image {
    width: 240px;
    height: 240px;
  }

  .intersection {
    margin-bottom: $action-footer-height;
  }
</style>
