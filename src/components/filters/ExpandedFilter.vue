<template>
  <component
    :is="localFilter.component"
    :filter="localFilter"
    :fetch-options="fetchOptions"
    :toggle-pin="togglePin"
    show-header
    @filter:update="onFilterUpdate"
  />
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
  export default class ExpandedFilter extends Vue {
    @Prop({
      type: Object,
      required: true
    })
    readonly filter;

    @Prop({
      type: Function,
      required: true
    })
    readonly fetchOptions;

    @Prop({
      type: Function,
      default: () => Promise.resolve()
    })
    readonly togglePin;

    @Watch('filter', { immediate: true, deep: true })
    onFilterChange(newFilter) {
      this.localFilter = newFilter.copy();
    }

    onFilterUpdate() {
      if (this.filter.equals(this.localFilter)) {
        return;
      }

      this.$emit('filter:update', this.localFilter);
    }

    localFilter = null;
  }
</script>

<style lang="scss" module></style>
