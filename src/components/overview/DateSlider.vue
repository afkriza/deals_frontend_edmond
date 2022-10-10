<template>
  <mini-slider
    :title="title"
    @navigationBack:click="onNavigationBack"
    @navigationForward:click="onNavigationForward"
    @slideAction:click="onTitleClick"
  />
</template>

<script>
  import MiniSlider from './MiniSlider';

  import { CURRENT_YEAR, CURRENT_MONTH, MONTHS } from '../../enums/date.js';

  export default {
    components: {
      MiniSlider
    },
    name: 'DateSlider',
    props: {
      type: {
        type: String,
        default: 'month',
        validator(value) {
          return ['month', 'year'].includes(value);
        }
      },
      month: {
        type: Number,
        default: CURRENT_MONTH
      },

      year: {
        type: Number,
        default: CURRENT_YEAR
      }
    },
    computed: {
      title() {
        return this.type === 'month'
          ? `${MONTHS[this.month - 1]} ${this.year}`
          : this.year;
      }
    },
    methods: {
      onNavigationBack() {
        let previousMonth = this.month;
        let previousYear = this.year;

        if (this.type === 'year') {
          previousYear--;

          return this.$emit('click:right', {
            month: previousMonth,
            year: previousYear
          });
        }

        previousMonth--;

        if (previousMonth < 1) {
          previousYear--;
          previousMonth = 12;
        }

        return this.$emit('click:right', {
          month: previousMonth,
          year: previousYear
        });
      },

      onTitleClick() {
        this.$emit('click:title');
      },

      onNavigationForward() {
        let nextMonth = this.month;
        let nextYear = this.year;

        if (this.type === 'year') {
          nextYear++;

          return this.$emit('click:right', {
            month: nextMonth,
            year: nextYear
          });
        }

        nextMonth++;

        if (nextMonth > 12) {
          nextYear++;
          nextMonth = 1;
        }

        return this.$emit('click:right', {
          month: nextMonth,
          year: nextYear
        });
      }
    }
  };
</script>
