<template>
  <div :class="$style.filters">
    <div v-if="$slots.filterSets" :class="$style.filterSets">
      <slot name="filterSets" />
    </div>

    <template v-for="filter in pinnedFiltersShortened">
      <slot name="filter" :filter="filter">
        <PinnedFilter
          :key="filter.id"
          :class="$style.filter"
          :filter="filter"
          :fetch-options="fetchOptions"
          @filter:update="updateFilter"
        />
      </slot>
    </template>
    <PinnedBaseFilter
      v-if="pinnedFilters.length > pinnedFiltersShortened.length"
      :class="$style.filter"
      :label="`+ ${numberOfShortenedFilters}`"
      no-arrow
      disabled
      @click.native="onExpandedFiltersOpen"
    />

    <slot name="append" />
    <template v-if="!hideExpandedFilters">
      <IconCircleDropdown
        :class="[$style.iconExpand, { [$style.expanded]: expanded }]"
        @click="toggleExpanded"
      />
      <ExpandedFilters
        :class="[$style.expandedFilters, { [$style.expanded]: expanded }]"
        :filters="filters"
        :fetch-options="fetchOptions"
        :toggle-filter-pin="toggleFilterPin"
        @filter:update="updateFilter"
        @close="onExpandedFiltersClose"
      >
        <template #filterSets>
          <slot name="filterSets" />
        </template>
      </ExpandedFilters>
    </template>
  </div>
</template>

<script lang="ts">
  import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
  import { filter, take, size } from 'lodash';
  import PinnedBaseFilter from '@/components/filters/PinnedBaseFilter.vue';

  import PinnedFilter from '@/components/filters/PinnedFilter.vue';

  import IconCircleDropdown from '@/assets/images/icons/circle-dropdown.svg';
  import ExpandedFilters from '@/components/filters/ExpandedFilters.vue';
  import FilterSet from '@/components/filters/FilterSet.vue';

  const DEFAULT_NUMBER_OF_PINNED_FILTERS = 4;

  @Component({
    components: {
      FilterSet,
      ExpandedFilters,
      PinnedFilter,
      PinnedBaseFilter,
      IconCircleDropdown
    }
  })
  export default class Filters extends Vue {
    @Prop({
      type: Array,
      default: () => []
    })
    readonly filters;

    @Prop({
      type: Function,
      default: () => Promise.resolve([])
    })
    readonly fetchOptions;

    @Prop({
      type: Function,
      default: () => Promise.resolve()
    })
    readonly toggleFilterPin;

    @Prop({
      type: Boolean
    })
    readonly hideExpandedFilters;

    @Prop({
      type: Number,
      default: DEFAULT_NUMBER_OF_PINNED_FILTERS
    })
    readonly maxNumberOfPinnedFilters: number;

    expanded = false;

    get pinnedFilters() {
      if (this.hideExpandedFilters) {
        return this.filters;
      }

      return filter(this.filters, 'pinned');
    }

    get pinnedFiltersShortened() {
      return take(
        this.pinnedFilters,
        this.maxNumberOfPinnedFilters ?? size(this.pinnedFilters)
      );
    }

    get numberOfShortenedFilters() {
      return size(this.pinnedFilters) - size(this.pinnedFiltersShortened);
    }

    get areFiltersShortened() {
      return Boolean(this.numberOfShortenedFilters);
    }

    updateFilter(newFilter) {
      this.$emit('filter:update', newFilter);
    }

    toggleExpanded() {
      this.expanded
        ? this.onExpandedFiltersClose()
        : this.onExpandedFiltersOpen();
    }

    @Emit('expanded-filters:open')
    onExpandedFiltersOpen() {
      this.expanded = true;
    }

    @Emit('expanded-filters:close')
    onExpandedFiltersClose() {
      this.expanded = false;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .filters {
    @include row;
    align-items: center;

    position: relative;

    padding: 14px 16px 14px 24px;

    height: $min-filter-height;

    background-color: $color-bg-primary-dark;

    > .filter + .filter {
      margin-left: 12px;
    }
  }

  .filter-sets {
    width: 220px;
    margin-right: 12px;
  }

  .expanded-filters {
    position: fixed;
    z-index: $z-expanded;
    top: 0;
    right: 0;
    bottom: 0;
    left: $navigation-width;

    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s;
    will-change: opacity;

    width: calc(100% - #{$navigation-width});

    background-color: $color-bg-primary-dark;

    &.expanded {
      visibility: visible;
      opacity: 1;
    }
  }

  .icon-expand {
    cursor: pointer;
    position: absolute;
    z-index: calc(#{$z-expanded} + 1);

    right: 16px;

    border-radius: 50%;

    transition-duration: 0.1s;
    transition-property: transform;

    &.expanded {
      transform: rotate(180deg);
    }
  }
</style>
