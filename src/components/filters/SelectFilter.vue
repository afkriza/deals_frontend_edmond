<template>
  <BaseFilter
    :filter="filter"
    :show-header="showHeader"
    :toggle-pin="togglePin"
  >
    <div v-if="searchable" :class="$style.searchWrapper">
      <SearchField
        :value="search"
        theme="secondary"
        @input="search = $event"
        @reset="search = ''"
      />
    </div>
    <div :class="$style.filterOptionsContainer">
      <FilterListItemSingleSelect
        v-if="filter.clearable"
        v-close-popover
        title="None"
        :active="!selectedOptionId"
        @update:active="clearFilter"
      />
      <template v-if="searchOptions.length">
        <FilterListItemSingleSelect
          v-for="option in searchOptions"
          :key="option.id"
          v-close-popover
          :title="option.name"
          :active="selectedOptionId === option.id"
          :disabled="!option.available"
          @update:active="onOptionClick(option)"
        />
      </template>
      <template v-else>
        <span :class="$style.noResults">No results found</span>
      </template>
    </div>
  </BaseFilter>
</template>

<script lang="ts">
  import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
  import SearchField from '@/components/app/SearchField.vue';
  import FilterListItemMultiSelect from '@/components/filters/FilterListItemMultiSelect.vue';
  import { filter, lowerCase, includes, get, size } from 'lodash';
  import BaseFilter from '@/components/filters/BaseFilter.vue';
  import FilterListItemSingleSelect from '@/components/filters/FilterListItemSingleSelect.vue';
  import { VClosePopover } from 'v-tooltip';

  const MIN_SEARCHABLE_OPTIONS = 10;

  @Component({
    components: {
      FilterListItemSingleSelect,
      BaseFilter,
      FilterListItemMultiSelect,
      SearchField
    },
    directives: {
      closePopover: VClosePopover
    }
  })
  export default class SelectFilter extends Vue {
    @Prop({
      type: Object,
      required: true
    })
    readonly filter;

    @Prop({
      type: Boolean
    })
    readonly showHeader: boolean;

    @Prop({
      type: Function,
      default: () => Promise.resolve()
    })
    readonly togglePin;

    search = '';

    get selectedOptionId() {
      return get(this.filter.value, 'id', null);
    }

    get allOptions() {
      return this.filter.options;
    }

    get allAvailableOptions() {
      return filter(this.allOptions, 'available');
    }

    get searchOptions() {
      if (!this.search) {
        return this.allOptions;
      }

      return filter(this.allOptions, option =>
        includes(lowerCase(option.name), lowerCase(this.search))
      );
    }

    get searchable() {
      return size(this.allOptions) >= MIN_SEARCHABLE_OPTIONS;
    }

    onOptionClick(option) {
      if (this.selectedOptionId === option.id) {
        return;
      }
      this.filter.select(option);

      this.onFilterUpdate();
    }

    clearFilter() {
      this.filter.clear();

      this.onFilterUpdate();
    }

    @Emit('filter:update')
    onFilterUpdate() {
      return this.filter;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .filter-options-container {
    margin-top: 8px;
  }

  .search-wrapper {
    padding: 12px 16px 4px;
  }

  hr.solid {
    border: none;
    border-top: 1px solid $color-border-primary-mid;
    margin: 8px 0;
  }

  .no-results {
    display: block;
    margin: 16px;
    color: $color-text-light;
  }
</style>
