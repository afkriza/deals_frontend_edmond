<template>
  <div :class="$style.wrapper">
    <div :class="$style.container">
      <div :class="[$style.cell, $style.bold]">
        <span>{{ changed }}</span>
        <span :class="$style.time">{{ changedTime }}</span>
      </div>
      <div :class="$style.property">
        <HistorySubRow
          v-for="(group, index) in groupedPropertyUnits"
          :key="index"
          :property-group="group"
          :is-rates-tab="isRatesTab"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import {
    isThisYear,
    format,
    isToday,
    formatDistanceToNowStrict,
    parseISO
  } from 'date-fns';
  import { groupBy } from 'lodash';

  import HistorySubRow from 'components/history/SubRow';

  export default {
    components: {
      HistorySubRow
    },

    props: {
      isRatesTab: {
        type: Boolean,
        required: true
      },

      unitGroup: {
        type: Array,
        required: true
      }
    },

    computed: {
      firstUnit() {
        return this.unitGroup[0];
      },

      firstUnitCreatedAtDate() {
        return parseISO(this.firstUnit.createdAt);
      },

      changed() {
        if (!isThisYear(this.firstUnitCreatedAtDate)) {
          return format(this.firstUnitCreatedAtDate, 'dd.MM.yyyy');
        } else if (!isToday(this.firstUnitCreatedAtDate)) {
          return format(this.firstUnitCreatedAtDate, 'dd.MM');
        }

        return `${formatDistanceToNowStrict(this.firstUnitCreatedAtDate)} ago`;
      },

      changedTime() {
        return format(this.firstUnitCreatedAtDate, 'HH:mm');
      },

      unitsByPropertyGroup() {
        return groupBy(this.unitGroup, ({ property }) => property.id);
      },

      groupedPropertyUnits() {
        return Object.keys(this.unitsByPropertyGroup).map(
          unit => this.unitsByPropertyGroup[unit]
        );
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .wrapper {
    background-color: $color-bg-light;

    &:nth-child(even) {
      background-color: $color-bg-main-dimmed;
    }
  }

  .container {
    display: flex;
    margin-left: 20px;

    @include media(large) {
      margin-left: 100px;
    }
  }

  .cell {
    display: flex;
    align-items: flex-start;
    flex-basis: 10.5%;
    font-size: 14px;
    font-weight: bold;
    line-height: 20px;
    padding: 12px 0;
    color: $color-text-main;
  }

  .property {
    flex: 1;
  }

  .time {
    font-weight: normal;
    margin-left: 5px;
    color: $color-text-main-lighter;
  }
</style>
