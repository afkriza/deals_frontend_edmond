<template>
  <div :class="$style.wrapper">
    <div :class="$style.inputs">
      <input ref="picker" type="text" />
    </div>

    <div ref="pickerContainer"></div>
  </div>
</template>

<script>
  import Pikaday from 'pikaday';
  import { endOfYear, subYears, addYears } from 'date-fns';

  export default {
    props: {
      date: {
        type: Date
      },
      resetStyle: {
        type: Boolean,
        default: false
      },
      customClass: {
        type: String,
        default: ''
      }
    },

    data() {
      return {
        picker: null
      };
    },
    computed: {
      dateClasses() {
        return this.resetStyle
          ? this.customClass
          : `date-picker ${this.customClass}`;
      }
    },
    mounted() {
      const minDate = subYears(Date.now(), 2);
      const maxDate = addYears(endOfYear(Date.now()), 2);

      this.picker = new Pikaday({
        field: this.$refs.picker,
        bound: false,
        showDaysInNextAndPreviousMonths: true,
        container: this.$refs.pickerContainer,
        i18n: {
          previousMonth: 'Previous Month',
          nextMonth: 'Next Month',
          months: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
          ],
          weekdays: [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
          ],
          weekdaysShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
        },
        firstDay: 1,
        minDate,
        maxDate,
        theme: this.dateClasses,
        onSelect: () => {
          this.onPickerSelect();
        }
      });

      // Remove keydown listener from document.
      // Pikaday adds listener for navigation in calendar.
      // Navigation in other input fields or any other use of arrow keys causes pikaday to change selected date.
      window.document.removeEventListener('keydown', this.picker._onKeyChange);

      this.picker.show();

      // this.picker.setStartRange(this.startDate);
      // this.picker.setEndRange(this.endDate);
      const date = this.date;
      if (date) {
        this.picker.gotoMonth(date.getMonth());
        this.picker.gotoYear(date.getFullYear());
      }
      this.picker.draw();

      this.$emit('publicApi:register', {
        setMinDate: date => {
          if (this.picker) {
            this.picker.setMinDate(date);
          }
        },
        setMaxDate: date => {
          if (this.picker) {
            this.picker.setMaxDate(date);
          }
        }
      });
    },

    beforeDestroy() {
      this.picker.destroy();
      this.picker = null;
    },
    methods: {
      onPickerSelect() {
        const date = this.picker.getDate();
        this.$emit('date:update', date);
      }
    }
  };
</script>

<style lang="scss" module>
  .inputs {
    display: none;
  }
</style>

<style lang="scss">
  /* stylelint-disable selector-max-type, selector-max-specificity, max-nesting-depth */
  /* This block contains pikaday overrides which causes it to contain linter disabling */
  @import 'utils';

  .date-picker {
    .pika-lendar {
      /* stylelint-disable declaration-no-important */
      width: 288px !important; // pikaday container does not adapt width to its contents

      /* stylelint-enable declaration-no-important */

      margin: 8px 0;
    }

    .pika-title {
      .pika-label {
        font-weight: normal;
        text-transform: uppercase;
      }
    }

    .pika-table {
      abbr {
        text-decoration: none;
      }

      th {
        font-weight: normal;
        text-transform: uppercase;
      }

      td {
        padding: 1px;

        &:hover {
          .pika-button {
            color: $color-text-light;
          }
        }

        &.is-selected {
          .pika-button {
            color: $color-text-light;
            background-color: $color-bg-primary;
          }
        }

        .pika-button {
          color: $color-text-main-lighter;
          background-color: $color-bg-main-dimmed;
          border-radius: 0;
          text-align: center;
          font-size: 14px;
          width: 38px;
          height: 38px;
          transition-property: color, background-color;
          transition-duration: 0.2s;
        }
      }
    }
  }

  /* stylelint-enable selector-max-type, selector-max-specificity, max-nesting-depth */
</style>
