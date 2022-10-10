<template>
  <BaseFilter
    :filter="filter"
    :show-header="showHeader"
    :toggle-pin="togglePin"
  >
    <div :class="$style.searchWrapper">
      <SearchField
        :value="search"
        @input="search = $event"
        @reset="search = ''"
        theme="secondary"
      />
    </div>
    <div :class="$style.actions">
      <FilterButton @click="selectAll">Select all</FilterButton>
      <FilterButton @click="clear">Clear</FilterButton>
    </div>
    <template v-if="searchOptions.length">
      <FilterListItemMultiSelect
        v-for="option in searchOptions"
        :key="option.id"
        :title="option.name"
        :indeterminate="isIndeterminate(option)"
        :active="isActive(option)"
        :disabled="!option.available"
        :has-sub-options="hasSubOptions(option)"
        @update:active="onOptionClick(option)"
      >
        <template v-if="hasSubOptions(option)" #subOptions>
          <FilterListItemMultiSelect
            v-for="subOption in getSubOptions(option)"
            :key="subOption.id"
            :title="subOption.name"
            :active="Boolean(selectedSubOptionIds[subOption.id])"
            :disabled="!subOption.available"
            indented
            @update:active="onSubOptionClick(subOption, option)"
          />
        </template>
      </FilterListItemMultiSelect>
    </template>
    <template v-else>
      <span :class="$style.noResults">No results found</span>
    </template>
  </BaseFilter>
</template>

<script lang="ts">
  import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
  import SearchField from '@/components/app/SearchField.vue';
  import FilterListItemMultiSelect from '@/components/filters/FilterListItemMultiSelect.vue';
  import {
    every,
    filter,
    forEach,
    get,
    includes,
    isEqual,
    keyBy,
    lowerCase,
    negate,
    size,
    some
  } from 'lodash';
  import BaseFilter from '@/components/filters/BaseFilter.vue';
  import FilterButton from '@/components/filters/FilterButton.vue';

  @Component({
    components: {
      FilterButton,
      BaseFilter,
      FilterListItemMultiSelect,
      SearchField
    }
  })
  export default class MultiSelectFilter extends Vue {
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

    get subFilter() {
      return this.filter.subFilter;
    }

    get selectedOptionIds() {
      return keyBy(this.filter.value, 'id');
    }

    get selectedSubOptionIds() {
      if (!this.subFilter) {
        return null;
      }

      return keyBy(this.subFilter.value, 'id');
    }

    get subOptionsByOptionId() {
      return this.filter.subOptionsByOptionId;
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

    isOptionSelected(option) {
      return Boolean(this.selectedOptionIds[option.id]);
    }

    isSubOptionSelected(subOption) {
      return Boolean(this.selectedSubOptionIds[subOption.id]);
    }

    isIndeterminate(option) {
      if (this.isActive(option) || !this.hasAvailableSubOptions(option)) {
        return false;
      }

      return some(this.getAvailableSubOptions(option), subOption =>
        this.isSubOptionSelected(subOption)
      );
    }

    isActive(option) {
      if (!this.hasAvailableSubOptions(option)) {
        return this.isOptionSelected(option);
      }

      return every(
        this.getAvailableSubOptions(option),
        this.isSubOptionSelected
      );
    }

    hasSubOptions(option) {
      return Boolean(size(this.getSubOptions(option)));
    }

    hasAvailableSubOptions(option) {
      return Boolean(size(this.getAvailableSubOptions(option)));
    }

    getSubOptions(option) {
      return get(this.subOptionsByOptionId, option.id, []);
    }

    getAvailableSubOptions(option) {
      return filter(this.getSubOptions(option), 'available');
    }

    selectAll() {
      forEach(filter(this.searchOptions, 'available'), option => {
        this.selectOption(option);
      });

      this.onFilterUpdate();
    }

    clear() {
      forEach(filter(this.searchOptions, 'available'), option => {
        this.deselectOption(option);
      });

      this.onFilterUpdate();
    }

    selectOption(option) {
      this.filter.select(option);

      forEach(this.getAvailableSubOptions(option), subOption => {
        this.selectSubOption(subOption, option);
      });
    }

    deselectOption(option) {
      this.filter.deselect(option);

      forEach(this.getAvailableSubOptions(option), subOption => {
        this.deselectSubOption(subOption, option);
      });
    }

    onOptionClick(option) {
      this.isOptionSelected(option)
        ? this.deselectOption(option)
        : this.selectOption(option);

      this.onFilterUpdate();
    }

    selectSubOption(subOption, option) {
      this.subFilter.select(subOption);

      if (!this.isOptionSelected(option)) {
        this.filter.select(option);
      }
    }

    deselectSubOption(subOption, option) {
      this.subFilter.deselect(subOption);

      if (
        every(
          this.getAvailableSubOptions(option),
          negate(this.isSubOptionSelected)
        )
      ) {
        this.filter.deselect(option);
      }
    }

    onSubOptionClick(subOption, option) {
      this.isSubOptionSelected(subOption)
        ? this.deselectSubOption(subOption, option)
        : this.selectSubOption(subOption, option);

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

  .search-wrapper {
    padding: 16px;
  }

  .actions {
    padding-left: 16px;
    margin-bottom: 12px;

    button + button {
      margin-left: 8px;
    }
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
