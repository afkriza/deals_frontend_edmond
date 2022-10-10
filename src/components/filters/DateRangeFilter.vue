<template>
  <BaseFilter
    :filter="filter"
    :show-header="showHeader"
    :toggle-pin="togglePin"
  >
    <div :class="$style.inputs">
      <InputDateRange
        :class="$style.dateRangeInput"
        :date-from.sync="startDate"
        :date-to.sync="endDate"
        :clearable="filter.clearable"
        dark
      />
      <FilterButton
        v-if="filter.clearable"
        :class="$style.buttonClear"
        @click="clearFilter"
        >Clear</FilterButton
      >
    </div>
    <div :class="$style.calendar">
      <DateRange
        :start-date="startDate"
        :end-date="endDate"
        custom-class="date-theme-dark"
        @start-date:update="updateCalendarStartDate"
        @end-date:update="updateCalendarEndDate"
      />
    </div>

    <div v-if="hasPresets" :class="$style.predefinedParameters">
      <h5 :class="$style.parametersHeading">Presets</h5>
      <div :class="$style.presets">
        <DateRangeFilterPresetChip
          v-for="preset in filter.options"
          :key="preset.id"
          :class="$style.preset"
          :text="preset.name"
          :active="isPresetActive(preset)"
          @click="setPreset(preset)"
        />
      </div>
    </div>
  </BaseFilter>
</template>

<script lang="ts">
  import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
  import { isSameDay } from 'date-fns';
  import { size } from 'lodash';
  import DateRangeFilterPresetChip from '@/components/filters/DateRangeFilterPresetChip.vue';
  import DateRange from '@/components/core/DateRange.vue';

  import InputDateRange from '@/components/inputs/new/InputDateRange.vue';
  import BaseFilter from '@/components/filters/BaseFilter.vue';
  import FilterButton from '@/components/filters/FilterButton.vue';

  @Component({
    components: {
      FilterButton,
      BaseFilter,
      InputDateRange,
      DateRangeFilterPresetChip,
      DateRange
    }
  })
  export default class DateRangeFilter extends Vue {
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

    get startDate() {
      return this.filter.value.startDate;
    }

    set startDate(date) {
      if (date) {
        this.filter.value.startDate = date;
      } else {
        this.filter.value.startDate = this.endDate;
      }

      this.filter.select(null);

      this.onFilterUpdate();
    }

    get endDate() {
      return this.filter.value.endDate;
    }

    set endDate(date) {
      if (date) {
        this.filter.value.endDate = date;
      } else {
        this.filter.value.endDate = this.startDate;
      }

      this.filter.select(null);

      this.onFilterUpdate();
    }

    get hasPresets() {
      return Boolean(size(this.filter.options));
    }

    updateCalendarStartDate(value) {
      this.filter.select(null);

      this.filter.value.startDate = value;
      this.filter.value.endDate = value;

      this.onFilterUpdate();
    }

    updateCalendarEndDate(value) {
      this.filter.select(null);

      if (!this.filter.value.startDate) {
        this.startDate = value;
        return;
      }

      this.endDate = value;
    }

    isPresetActive(preset) {
      const { startDate, endDate } = preset.dateRange;

      if (!preset.isRelative) {
        return (
          isSameDay(this.filter.value.startDate, startDate) &&
          isSameDay(this.filter.value.endDate, endDate)
        );
      }

      return Boolean(
        this.filter.activePreset && this.filter.activePreset.id === preset.id
      );
    }

    setPreset(preset) {
      this.filter.select(preset);

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

  .date-range-input {
    width: 215px;
  }

  .calendar {
    border-top: 1px solid $color-border-primary-mid;
    padding: 16px;
  }

  .inputs {
    @include row;
    align-items: center;

    padding: 12px 0 26px 16px;
  }

  .button-clear {
    align-self: flex-end;

    margin-left: 16px;
    margin-bottom: 3px;
  }

  .predefined-parameters {
    padding: 16px;
    border-top: 1px solid $color-border-primary-mid;
  }

  .parameters-heading {
    margin-top: 0;
    margin-bottom: 12px;

    color: $color-text-main-lighter;
    text-transform: uppercase;
  }

  .presets {
    display: flex;
    flex-wrap: wrap;
    grid-column-gap: 6px;
    grid-row-gap: 8px;
  }

  .preset {
    white-space: nowrap;
  }
</style>
