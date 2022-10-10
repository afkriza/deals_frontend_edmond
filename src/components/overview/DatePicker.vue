<template>
  <div :class="$style.picker">
    <mini-slider
      :actionDisabled="true"
      :class="$style.miniSlider"
      :title="activeYear"
      @navigationBack:click="navigationBack"
      @navigationForward:click="navigationForward"
    />
    <overview-grid
      :hasBorder="false"
      :isStriped="false"
      :numberOfColumns="3"
      :numberOfRows="4"
      cellHeight="auto"
      cellWidth="33%"
    >
      <template v-slot:tile="{ index }">
        <date-picker-item
          :active="itemActive(index)"
          :class="$style.pickerItem"
          :text="itemText(index)"
          @click="submitDate(index)"
        />
      </template>
    </overview-grid>
  </div>
</template>

<script>
  import { chunk } from 'lodash';

  import OverviewGrid from './OverviewGrid.vue';
  import DatePickerItem from './DatePickerItem.vue';
  import MiniSlider from './MiniSlider.vue';
  import { MONTHS, TimeGranulations } from '../../enums/date.js';

  export default {
    name: 'DatePicker',
    components: {
      OverviewGrid,
      DatePickerItem,
      MiniSlider
    },
    props: {
      type: {
        type: String,
        default: 'month',
        validator(value) {
          return ['day', 'week', 'month'].includes(value);
        }
      },
      currentYear: {
        type: Number,
        required: true
      },
      currentMonth: {
        type: Number,
        required: true
      },
      startYear: {
        type: Number,
        default: 1931
      },
      endYear: {
        type: Number,
        default: 2050
      }
    },
    watch: {
      currentYear(newValue) {
        this.activeYear = newValue;
        let pageIndex = Math.floor((newValue - this.startYear) / 12);
        pageIndex = Math.max(pageIndex, 0);
        pageIndex = Math.min(pageIndex, this.yearItems.length - 1);

        this.yearRowIndex = pageIndex;
      }
    },
    data() {
      return {
        yearRowIndex: 7,
        activeYear: this.currentYear
      };
    },
    computed: {
      yearItems() {
        return chunk(this.range, 12);
      },
      range() {
        return Array(this.endYear - this.startYear + 1)
          .fill()
          .map((_, idx) => this.startYear + idx);
      },
      yearInRangeBackwards() {
        return this.activeYear > this.range[0];
      },
      yearInRangeForward() {
        return this.activeYear < this.range[this.range.length - 1];
      },
      isDailyGranulation() {
        return this.type === TimeGranulations.DAY;
      },
      isMonthlyGranulation() {
        return (
          this.type === TimeGranulations.MONTH ||
          this.type === TimeGranulations.WEEK
        );
      }
    },
    methods: {
      yearInRange(year) {
        return year <= this.endYear && year >= this.startYear;
      },
      itemText(index) {
        return this.isDailyGranulation
          ? MONTHS[index]
          : this.yearItems[this.yearRowIndex][index];
      },
      itemActive(index) {
        return this.isDailyGranulation
          ? this.currentMonth === index + 1 &&
              this.currentYear === this.activeYear
          : this.yearItems[this.yearRowIndex][index] === this.activeYear;
      },
      navigationForward() {
        if (this.isDailyGranulation && this.yearInRangeBackwards) {
          this.activeYear++;
        } else if (this.yearRowIndex < this.yearItems.length - 1) {
          this.yearRowIndex++;
        }
      },
      navigationBack() {
        if (this.isDailyGranulation && this.yearInRangeForward) {
          this.activeYear--;
        } else if (this.yearRowIndex > 0) {
          this.yearRowIndex--;
        }
      },
      submitDate(index) {
        const month = this.isDailyGranulation ? index + 1 : this.currentMonth;
        const year = this.isMonthlyGranulation
          ? this.yearItems[this.yearRowIndex][index]
          : this.activeYear;

        this.$emit('date:change', {
          year,
          month
        });
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .picker-item,
  .picker {
    background-color: $color-bg-light;
  }

  .mini-slider {
    margin-bottom: 10px;
  }
</style>
