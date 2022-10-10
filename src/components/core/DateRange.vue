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
  import {
    addYears,
    endOfYear,
    isBefore,
    subYears,
    addMonths,
    subMonths,
    isAfter
  } from 'date-fns';

  export default {
    props: {
      startDate: {
        type: Date,
        default: null
      },
      endDate: {
        type: Date,
        default: null
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
        resetDateChoice: true,
        picker: null,
        isFirstStep: true
      };
    },

    computed: {
      areDatesSet() {
        return Boolean(this.startDate && this.endDate);
      },
      twoMonthDifference() {
        if (!this.areDatesSet) {
          return false;
        }
        const differenceDate = addMonths(this.startDate, 1);
        return isAfter(this.endDate, differenceDate);
      },
      dateRender() {
        return this.twoMonthDifference
          ? subMonths(this.endDate, 1)
          : this.startDate;
      },
      dateClasses() {
        return this.resetStyle
          ? this.customClass
          : `date-range ${this.customClass}`;
      }
    },

    watch: {
      startDate() {
        this.picker.setStartRange(this.startDate);

        this.picker.draw();
      },

      endDate() {
        this.picker.setEndRange(this.endDate);

        if (this.dateRender) {
          this.picker.gotoMonth(this.dateRender.getMonth());
          this.picker.gotoYear(this.dateRender.getFullYear());
        }

        this.picker.draw();
      }
    },
    mounted() {
      const minDate = subYears(Date.now(), 2);
      const maxDate = addYears(endOfYear(Date.now()), 2);

      this.picker = new Pikaday({
        field: this.$refs.picker,
        bound: false,
        container: this.$refs.pickerContainer,
        firstDay: 1,
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
        minDate,
        maxDate,
        theme: this.dateClasses,
        numberOfMonths: 2,
        onSelect: () => {
          this.onPickerSelect();
        }
      });

      // Remove keydown listener from document.
      // Pikaday adds listener for navigation in calendar.
      // Navigation in other input fields or any other use of arrow keys causes pikaday to change selected date.
      window.document.removeEventListener('keydown', this.picker._onKeyChange);

      this.picker.show();

      this.picker.setStartRange(this.startDate);
      this.picker.setEndRange(this.endDate);

      if (this.dateRender) {
        this.picker.gotoMonth(this.dateRender.getMonth());
        this.picker.gotoYear(this.dateRender.getFullYear());
      }
      this.picker.draw();
    },

    beforeDestroy() {
      this.picker.destroy();
    },

    methods: {
      onPickerSelect() {
        const date = this.picker.getDate();

        if (this.isFirstStep) {
          this.isFirstStep = false;
          this.$emit('start-date:update', date);
          this.$emit('end-date:update', date);
        } else {
          if (isBefore(date, this.startDate)) {
            this.$emit('start-date:update', date);
            this.$emit('end-date:update', date);
            return;
          }
          this.isFirstStep = true;
          this.$emit('end-date:update', date);
          this.$emit('close');
        }
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

  $month-container-border-radius: 14px;

  .date-range {
    background-color: transparent;

    .pika-lendar {
      /* stylelint-disable declaration-no-important */
      width: 224px !important; // pikaday container does not adapt width to its contents

      /* stylelint-enable declaration-no-important */

      margin: 8px 0;

      &:not(:last-child) {
        margin-right: 15px;
      }
    }

    .pika-prev,
    .pika-next {
      @include hide-text;
      width: 32px;
      height: 32px;
      background-size: 24px 24px;
      opacity: 1;
      border-radius: 50%;
      border: 1px solid transparent;
    }

    .pika-prev {
      background-image: url('~ic-arrow-left.png');

      @include media(retina) {
        background-image: url('~ic-arrow-left@2x.png');
      }
    }

    .pika-next {
      background-image: url('~ic-arrow-right.png');

      @include media(retina) {
        background-image: url('~ic-arrow-right@2x.png');
      }
    }

    .pika-title {
      .pika-label {
        font-weight: bold;
        line-height: 20px;
        color: $color-text-light;
        background-color: transparent;
        border-radius: 4px;
        border: 1px solid transparent;
        padding: 3px;

        &:first-child {
        }

        &:nth-child(2) {
        }
      }

      select {
        top: auto;
      }
    }

    .pika-table {
      margin-top: 12px;

      abbr {
        text-decoration: none;
      }

      th {
        font-weight: normal;
        text-transform: uppercase;
        color: $color-text-main-light;
      }

      tr:not(:last-child) {
        margin-bottom: 8px;
      }

      // a hacky way to add margin between thead and tbody
      tbody:before {
        content: '@';
        display: block;
        line-height: 16px;
        text-indent: -99999px;
      }

      td {
        padding: 1px 0;

        &:first-child {
          .pika-button {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
          }
        }

        &:last-child {
          .pika-button {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
          }
        }

        &.is-startrange {
          .pika-button {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
          }
        }

        &.is-endrange {
          .pika-button {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
          }
        }

        &.is-startrange,
        &.is-endrange {
          .pika-button {
            font-weight: bold;
            color: $color-text-primary;
            background-color: $color-bg-light;
          }
        }

        &.is-inrange {
          .pika-button {
            font-weight: bold;
            color: $color-text-primary;
            background-color: $color-bg-primary-light;
          }
        }

        &.is-outside-current-month {
          .pika-button {
            color: $color-text-main-lighter;
            opacity: 1;
          }

          &.is-inrange,
          &.is-startrange,
          &.is-endrange {
            .pika-button {
              color: $color-text-light;
            }
          }
        }

        &.is-selected .pika-button {
          box-shadow: none;
        }

        &.is-today:not(.is-inrange):not(.is-selected) .pika-button {
          font-weight: normal;
        }

        &.is-inrange.is-today,
        &.is-selected.is-today {
          .pika-button::after {
            background-color: $color-bg-primary;
          }
        }

        &.is-today {
          .pika-button::after {
            opacity: 1;
          }
        }

        .pika-button {
          position: relative;
          background-color: transparent;
          color: $color-text-light;
          border-radius: 0;
          text-align: center;
          font-size: 12px;
          width: 32px;
          height: 32px;
          margin-bottom: 10px;
          transition-property: color, background-color, border-radius,
            font-weight;
          transition-duration: 0.2s;

          &::after {
            content: '';
            opacity: 0;
            position: absolute;
            display: block;
            height: 2px;
            width: 15px;
            margin-top: 1px;
            left: 50%;
            transform: translateX(-50%);
            background-color: currentColor;
            transition: opacity 0.2s ease;
          }

          &:hover::after {
            opacity: 1;
          }
        }
      }
    }
  }

  /* stylelint-enable selector-max-type, selector-max-specificity, max-nesting-depth */
</style>
