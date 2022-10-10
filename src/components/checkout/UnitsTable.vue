<template>
  <div :class="$style.wrapper">
    <div :class="$style.stickyContent">
      <h2 :class="$style.title">{{ property.name }}</h2>
      <header :class="$style.header">
        <div
          v-for="headerItem in headerItems"
          :key="headerItem.label"
          :class="$style.cell"
        >
          <span v-if="headerItem.type === unitsTableHeaderTypes.CHECKBOX.id">
            <CoreCheckbox
              :checked="allUnitsChecked"
              :indeterminate="someUnitsChecked && !allUnitsChecked"
              :theme="['primary', 'small']"
              @checked:update="toggleCheckStatus"
            />
          </span>

          <h5 v-else :class="$style.headerLabel">
            {{ headerItem.label }}
          </h5>
        </div>
      </header>
    </div>
    <div :class="$style.dataContainer">
      <div
        v-for="(dateGroup, index) in sortedGroups"
        :key="index"
        :class="$style.dateGroup"
      >
        <slot :dateGroup="dateGroup" />
      </div>
    </div>
  </div>
</template>

<script>
  import { parseISO } from 'date-fns';

  import GroupsRate from 'classes/checkout/GroupsRate';
  import GroupsInventory from 'classes/checkout/GroupsInventory';
  import { unitsTableHeaderTypes } from 'enums/units-table-header-types';

  import CoreCheckbox from 'components/core/Checkbox';

  export default {
    components: {
      CoreCheckbox
    },

    props: {
      units: {
        type: Array,
        required: true
      },
      headerItems: {
        type: Array,
        required: true
      },
      property: {
        type: Object,
        required: true
      },
      isRatesTab: {
        type: Boolean,
        required: true
      }
    },

    data() {
      return {
        unitsTableHeaderTypes
      };
    },

    computed: {
      groupedByCriteria() {
        return this.isRatesTab
          ? new GroupsRate(this.units)
          : new GroupsInventory(this.units);
      },

      allUnitsChecked() {
        return this.units.every(rate => rate.confirmed);
      },

      someUnitsChecked() {
        return this.units.some(rate => rate.confirmed);
      },

      sortedGroups() {
        return this.groupedByCriteria.groupedByAccumulatedCriteria.sort(
          (unitA, unitB) => {
            return parseISO(unitA.dates[0]) - parseISO(unitB.dates[0]);
          }
        );
      }
    },

    methods: {
      toggleCheckStatus() {
        this.$emit('units:toggleConfirm', this.units);
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';
  $tabs-height: 79px;

  .sticky-content {
    position: sticky;
    z-index: $z-floating-content - 1; // To prevent overflowing navigation
    top: $navigation-width;

    background-color: $color-bg-light;
  }

  .header {
    @include row;
    align-items: center;

    padding: 11px 40px;

    border: {
      bottom: 1px solid $color-border-main-light;
      top: 1px solid $color-border-main-light;
    }
  }

  .cell {
    flex: 1 0;
    font-size: 12px;
    line-height: 16px;
    font-weight: bold;
    text-transform: uppercase;
    color: $color-text-main-lighter;
    display: flex;

    &:last-child {
      justify-content: flex-end;
    }
  }

  .header-label {
    margin: 0;
  }

  .data-container {
    padding-bottom: 20px;
  }

  .date-group:nth-child(even) {
    background-color: $color-bg-main-dimmed;
  }

  .title {
    font-size: 24px;
    color: $color-text-primary;

    margin: 48px 0 16px 40px;
  }
</style>
