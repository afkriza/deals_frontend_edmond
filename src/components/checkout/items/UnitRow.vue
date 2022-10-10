<template>
  <div>
    <div :class="$style.container">
      <div :class="$style.cell">
        <ul :class="$style.dateList">
          <DateItem
            v-for="(date, dateIndex) in groupedDates"
            :key="dateIndex"
            :dates="date"
            :current-date="currentDate"
          />
        </ul>
      </div>
      <div :class="$style.channels">
        <div
          v-for="(channelGroup, index) in dateGroup.group[0]
            .groupedChannelByUnitType"
          :key="index"
          :class="$style.channelGroup"
        >
          <slot
            :channelGroup="channelGroup.channels"
            :units="dateGroup.groupedChannelGroups[index]"
            :hasDatesInPast="hasDatesInPast"
            name="unit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { differenceInDays, isBefore, parseISO, format } from 'date-fns';

  import DateItem from 'components/checkout/items/Date';

  export default {
    components: {
      DateItem
    },

    props: {
      dateGroup: {
        type: Object,
        required: true
      },

      currentDate: {
        type: Date,
        required: true
      }
    },

    computed: {
      dates() {
        return this.dateGroup.dates.sort().map(parseISO);
      },

      hasDatesInPast() {
        return this.dates.some(date => format(date, 'yyyy-MM-dd') < format(this.currentDate, 'yyyy-MM-dd'));
      },

      groupedDates() {
        return this.dates.reduce((acc, currVal) => {
          const lastArr = acc[acc.length - 1];

          if (
            acc.length &&
            differenceInDays(currVal, lastArr[lastArr.length - 1]) === 1
          ) {
            lastArr.push(currVal);
          } else {
            acc.push([currVal]);
          }

          return acc;
        }, []);
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    display: flex;

    padding: 0 40px;
  }

  .cell {
    display: flex;
    align-items: flex-start;
    flex: 1;
    font-weight: bold;
    line-height: 20px;
    padding: 12px 0;
    color: $color-text-main;
  }

  .channels {
    flex: 9;
  }

  .channel-group:not(:last-child) {
    border-bottom: 1px solid $color-border-main;
  }

  .date-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
</style>
