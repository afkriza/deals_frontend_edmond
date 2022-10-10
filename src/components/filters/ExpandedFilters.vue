<template>
  <div :class="$style.wrapper">
    <div :class="[$style.container, { [$style.offset]: !$slots.filterSets }]">
      <div v-if="$slots.filterSets" :class="$style.filterSets">
        <h5 :class="$style.filterSetLabel">Saved filters</h5>
        <div :class="$style.filterSet">
          <slot name="filterSets" />
        </div>
      </div>
      <div v-windows-custom-scroll:dark :class="$style.filters">
        <ExpandedFilter
          v-for="filter in filters"
          :id="$style[filter.id]"
          :key="filter.id"
          :class="[$style.filter, $style[filter.type]]"
          :filter="filter"
          :fetch-options="fetchOptions"
          :toggle-pin="toggleFilterPin"
          @filter:update="onFilterUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import ExpandedFilter from '@/components/filters/ExpandedFilter';
  import { isKey } from '@/utils/keyboard-events';
  import { ESCAPE } from '@/constants/keyboard';

  export default {
    name: 'ExpandedFilters',

    components: {
      ExpandedFilter
    },

    props: {
      filters: {
        type: Array,
        required: true
      },

      fetchOptions: {
        type: Function,
        required: true
      },

      toggleFilterPin: {
        type: Function,
        default: () => Promise.resolve()
      }
    },
    mounted() {
      document.addEventListener('keyup', this.closeOnEsc);
    },

    beforeDestroy() {
      document.removeEventListener('keyup', this.closeOnEsc);
    },

    methods: {
      onFilterUpdate(filter) {
        this.$emit('filter:update', filter);
      },

      closeOnEsc(e) {
        if (isKey(ESCAPE, e)) {
          this.$emit('close');
        }
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .wrapper {
    @include column;
    min-height: 0;
  }

  .container {
    @include column;
    flex: 1;
    min-height: 0;

    &.offset {
      padding-top: 60px;
    }
  }

  .filter-sets {
    @include column;

    margin: 24px 32px;
  }

  .filters {
    @include row;
    flex: 1;

    overflow: auto;
    padding: 0 196px 52px 32px;
    border-radius: 6px;
  }

  .filter {
    flex-shrink: 0;
  }

  #booking_date_range,
  #snapshot_date_range {
    max-width: 496px;
    align-self: flex-start;
  }

  .filter:not(.date-range) {
    width: 240px;
  }

  .filter + .filter {
    margin-left: 16px;
  }

  .menu {
    display: flex;
    flex-direction: column;
    padding-left: 32px;
    padding-top: 15px;

    margin-bottom: 24px;
  }

  .filter-set-label {
    color: $color-text-main-lighter;
    text-transform: uppercase;
    margin: 9px 0 8px 2px;
  }

  .filter-set {
    width: 220px;
  }

  .scroll-container {
    overflow: auto;
    padding-bottom: 14px;
  }

  .scroll-content {
    display: inline-block;
    margin-right: 34px;
    margin-left: 34px;
    width: max-content;
  }

  .expanded-filters-wrapper {
    display: flex;

    .expanded-filter {
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }

  .fixed-width-filter {
    width: 240px;
  }

  .no-scroll {
    overflow-y: hidden;
  }
</style>
