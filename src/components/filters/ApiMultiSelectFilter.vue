<template>
  <BaseFilter
    :filter="filter"
    :show-header="showHeader"
    :toggle-pin="togglePin"
  >
    <div :class="$style.searchWrapper">
      <SearchField
        :value="search"
        theme="secondary"
        @input="onSearch"
        @reset="search = ''"
      />
    </div>
    <div v-show="filter.value.length" :class="$style.selected">
      <div :class="$style.sectionHeader">
        <span :class="$style.sectionTitle">Selected</span>
        <FilterButton @click="clearFilter">Clear</FilterButton>
      </div>
      <FilterListItemMultiSelect
        v-for="option in filter.value"
        :key="option.id"
        :title="option.name"
        :indeterminate="false"
        :active="true"
        @update:active="toggle(option)"
      />
    </div>

    <template v-if="search">
      <div>
        <div :class="$style.sectionHeader">
          <span :class="$style.sectionTitle">Results</span>
          <FilterButton v-show="apiOptions.length" @click="selectAll">
            Select all
          </FilterButton>
        </div>
        <template v-if="isLoading">
          <div :class="$style.spinnerWrapper">
            <Spinner :class="$style.spinner" />
            <div :class="$style.spinnerText">Loading...</div>
          </div>
        </template>
        <template v-else>
          <template v-if="apiOptions.length">
            <FilterListItemMultiSelect
              v-for="option in apiOptions"
              :key="option.id"
              :title="option.name"
              :indeterminate="false"
              :active="Boolean(selectedOptionIds[option.id])"
              :disabled="!option.available"
              @update:active="toggle(option)"
            />
          </template>
          <template v-else>
            <span :class="$style.noResults">No results found</span>
          </template>
        </template>
      </div>
    </template>
    <div v-if="!search">
      <div :class="$style.sectionHeader">
        <span :class="$style.sectionTitle">Top {{ filterNamePluralized }}</span>
      </div>
      <FilterListItemMultiSelect
        v-for="option in allOptions"
        :key="option.id"
        :title="option.name"
        :indeterminate="false"
        :active="Boolean(selectedOptionIds[option.id])"
        :disabled="!option.available"
        @update:active="toggle(option)"
      />
    </div>
  </BaseFilter>
</template>

<script lang="ts">
  import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
  import pluralize from 'pluralize';
  import SearchField from '@/components/app/SearchField.vue';
  import FilterListItemMultiSelect from '@/components/filters/FilterListItemMultiSelect.vue';
  import { debounce, keyBy, forEach } from 'lodash';
  import ButtonOutline from '@/components/buttons/ButtonOutline.vue';
  import { mapActions } from 'vuex';
  import Spinner from '@/components/core/Spinner.vue';
  import BaseFilter from '@/components/filters/BaseFilter.vue';
  import FilterButton from '@/components/filters/FilterButton.vue';

  @Component({
    components: {
      FilterButton,
      BaseFilter,
      Spinner,
      ButtonOutline,
      FilterListItemMultiSelect,
      SearchField
    },
    methods: {
      pluralize
    }
  })
  export default class ApiMultiSelectFilter extends Vue {
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
      type: Object,
      default: null
    })
    readonly filtersQuery;

    @Prop({
      type: Function,
      required: true
    })
    readonly fetchOptions: ({ endpoint, pattern }) => object[];

    @Prop({
      type: Function,
      default: () => Promise.resolve()
    })
    readonly togglePin;

    search = '';

    apiOptions = [];

    isLoading = false;

    get filterNamePluralized() {
      return pluralize(this.filter.name);
    }

    get selectedOptionIds() {
      return keyBy(this.filter.value, 'id');
    }

    get allOptions() {
      return this.filter.options;
    }

    onSearch(value: string) {
      this.search = value;

      this.fetchApiOptionsDebounced();
    }

    async fetchApiOptions() {
      if (!this.search) {
        return;
      }

      this.isLoading = true;

      try {
        this.apiOptions = await this.fetchOptions({
          endpoint: this.filter.searchApiUrl,
          pattern: this.search
        });
      } finally {
        this.isLoading = false;
      }
    }

    fetchApiOptionsDebounced = debounce(this.fetchApiOptions, 200);

    toggle(option) {
      this.selectedOptionIds[option.id]
        ? this.filter.deselect(option)
        : this.filter.select(option);

      this.onFilterUpdate();
    }

    clearFilter() {
      this.filter.clear();

      this.onFilterUpdate();
    }

    selectAll() {
      forEach(this.apiOptions, option => {
        if (!this.selectedOptionIds[option.id]) {
          this.filter.select(option);
        }
      });

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

  .filter {
    @include column;
    min-height: 0;
    background-color: $color-bg-primary-darker;

    padding-bottom: 8px;
    border-radius: 6px;
  }

  .content {
    overflow-y: auto;
  }

  .search-wrapper {
    padding: 16px 16px 8px;
  }

  hr.solid {
    border: none;
    border-top: 1px solid $color-border-primary-mid;
    margin: 8px 0;
  }

  .section-header {
    @include row;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
  }

  .section-title {
    text-transform: uppercase;
    color: $color-text-main-lighter;
    font-size: 12px;
  }

  .spinner-wrapper {
    margin-top: 60px;
    margin-bottom: 60px;

    text-align: center;
    color: $color-text-light;
  }

  .spinner {
    margin: 0 auto 15px;
  }

  .spinner-text {
    color: $color-text-main-lighter;
  }

  .no-results {
    display: block;
    padding: 6px 16px;
    color: $color-text-light;
  }
</style>
