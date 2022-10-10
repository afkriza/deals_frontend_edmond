<template>
  <div :class="$style.container">
    <div :class="$style.content">
      <header :class="$style.header">
        <h5 :class="$style.date">Date</h5>
        <h5 :class="$style.channel">Channel</h5>
        <h5
          v-for="unitType in unitTypes"
          :key="unitType.id"
          :class="$style.headerCell"
        >
          {{ unitType.name }}
          <checkbox-field
            v-if="isEditable"
            :class="$style.checkbox"
            :checked="checkedUnitTypes.includes(unitType.id)"
            @checked:update="updateUnitType($event, unitType.id)"
          />
        </h5>
      </header>
      <div :class="$style.scrollContainer">
        <units-date-row
          v-for="date in filteredDates"
          :key="date"
          :class="$style.unitsRow"
          :units="unitsByDate[date]"
          :date="date"
          :isChecked="checkedDates.includes(date)"
          :isEditable="isEditable"
          :unitTypes="unitTypes"
          @unit:update="updateUnit"
          @units:update="updateDateUnits"
        >
          <template scope="masterProps" slot="master">
            <slot
              name="master"
              :units="masterProps.units"
              :channel="masterProps.channel"
            />
          </template>
          <template scope="unitProps" slot="unit">
            <slot name="unit" :unit="unitProps.unit" />
          </template>
        </units-date-row>
      </div>
    </div>
  </div>
</template>

<script>
  import UnitsDateRow from 'components/units/UnitsDateRow';
  import CheckboxField from 'components/core/Checkbox';
  import unitScopes from 'enums/unit-scopes';

  export default {
    components: {
      UnitsDateRow,
      CheckboxField
    },
    props: {
      units: {
        type: Array,
        required: true
      },

      dates: {
        type: Array,
        required: true
      },

      isEditable: {
        type: Boolean,
        default: true
      },

      unitsByDate: {
        type: Object,
        required: true
      },

      initialUnitsWithSuggestionByDate: {
        type: Object,
        required: true
      },

      unitTypes: {
        type: Array,
        required: true
      },

      unitScope: {
        type: String,
        required: true
      },

      checkedUnitTypes: {
        type: Array,
        required: false
      },
      checkedDates: {
        type: Array,
        required: true
      }
    },
    computed: {
      isAllUnitScope() {
        return this.unitScope === unitScopes.ALL;
      },

      filteredDates() {
        return this.isAllUnitScope
          ? this.dates
          : Object.keys(this.initialUnitsWithSuggestionByDate);
      }
    },
    methods: {
      updateUnit(value) {
        this.$emit('unit:update', value);
      },

      updateUnitType(value, unitTypeId) {
        this.$emit('units:unitTypeUpdate', value, unitTypeId);
      },

      updateDateUnits(value, event, date) {
        this.$emit('units:dateUpdate', value, event, date);
      }
    },
    data() {
      return {};
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  .content {
    flex: 1;
  }

  .header {
    @include row;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: $z-floating-content;
    background-color: $color-bg-light;

    height: 40px;
    min-width: max-content;

    padding: 12px 0;
    border-top: 1px solid $color-border-main-light;
    border-bottom: 1px solid $color-border-main-light;

    line-height: 16px;
    letter-spacing: 0.2px;
    text-transform: uppercase;
    color: $color-text-main-lighter;

    &-cell {
      display: flex;
      align-items: center;
      width: 160px;
      padding-left: 6px;
    }
  }

  .date {
    margin-left: 40px;
    min-width: 120px;
    max-width: 200px;
    flex: 1;
  }

  .channel {
    padding-left: 12px;
    width: 160px;
  }

  .units-row {
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 40px;

    &:first-child {
      padding-top: 16px;
    }

    &:nth-of-type(even) {
      background-color: $color-bg-main-dimmed;
    }
  }

  .checkbox {
    margin-right: 10px;
    margin-left: 10px;
  }
</style>
