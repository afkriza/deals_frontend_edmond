<template>
  <PinnedBaseFilter
    :filter-class="$style.pinnedFilter"
    :label="label"
    :value="valueLabel"
    @close="updateFilter"
  >
    <template #icon>
      <slot name="icon">
        <component :is="localFilter.icon" v-if="localFilter.icon" />
      </slot>
    </template>
    <component
      :is="localFilter.component"
      :class="$style.filter"
      :type="filter.type"
      :filter="localFilter"
      :fetch-options="fetchOptions"
    />
  </PinnedBaseFilter>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
  import PinnedBaseFilter from '@/components/filters/PinnedBaseFilter.vue';
  import MultiSelectFilter from '@/components/filters/MultiSelectFilter.vue';
  import DateRangeFilter from '@/components/filters/DateRangeFilter.vue';
  import ApiMultiSelectFilter from '@/components/filters/ApiMultiSelectFilter.vue';
  import SelectFilter from '@/components/filters/SelectFilter.vue';

  @Component({
    components: {
      PinnedBaseFilter,
      ApiMultiSelectFilter,
      DateRangeFilter,
      MultiSelectFilter,
      SelectFilter
    }
  })
  export default class PinnedFilter extends Vue {
    @Prop({
      type: Object,
      required: true
    })
    readonly filter!: any;

    @Prop({
      type: Function,
      default: () => Promise.resolve()
    })
    readonly fetchOptions;

    @Watch('filter', { immediate: true, deep: true })
    onFilterChange(newFilter) {
      this.localFilter = newFilter.copy();
    }

    localFilter = null;

    get label() {
      return this.localFilter.pinnedLabel;
    }

    get valueLabel() {
      return this.localFilter.pinnedValueLabel;
    }

    updateFilter() {
      if (this.filter.equals(this.localFilter)) {
        return;
      }

      this.$emit('filter:update', this.localFilter);
    }
  }
</script>

<style lang="scss" module>
  .pinned-filter {
    max-width: 260px;
  }

  .filter {
    &[type='date-range'] {
      width: 496px;
    }

    &[type*='multi-select'],
    &[type*='select'] {
      max-height: 572px;
    }
  }
</style>
