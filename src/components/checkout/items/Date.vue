<template>
  <li :class="{ [$style.warning]: isDateInPast }">
    {{ formattedDate }}
  </li>
</template>

<script>
  import { isBefore, format } from 'date-fns';

  export default {
    props: {
      dates: {
        type: Array,
        required: true
      },

      currentDate: {
        type: Date,
        required: true
      }
    },

    computed: {
      isDateInPast() {
        return this.dates.some(date => format(date, 'yyyy-MM-dd') < format(this.currentDate, 'yyyy-MM-dd'));
      },

      formattedDate() {
        if (this.dates.length > 1) {
          return `${format(this.dates[0], 'dd.MM.yyyy')} — ${format(
            this.dates[this.dates.length - 1],
            'dd.MM.yyyy'
          )}`;
        }

        return format(this.dates[0], 'dd.MM.yyyy');
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .warning {
    color: $color-text-warning;
  }
</style>
