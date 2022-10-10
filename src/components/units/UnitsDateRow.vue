<template>
  <div :class="$style.container">
    <div :class="$style.dateWrapper">
      <div :class="$style.dateCheckboxWrapper">
        <div :class="$style.date">{{ dateFormat }}</div>
        <CheckboxField
          v-if="isEditable"
          :class="$style.checkbox"
          :checked="isChecked"
          @checked:update="onCheck"
        />
      </div>
      <div :class="$style.weekDay">{{ weekDay }}</div>
    </div>
    <div :class="$style.wrapper">
      <UnitsChannelRow
        v-for="channel in channels"
        :key="channel.id"
        :class="$style.unitsChannel"
        :units="unitsByChannel[channel.id]"
        :channel="channel"
        :unit-types="unitTypes"
        @unit:update="updateUnit"
      >
        <template slot="master" scope="masterProps">
          <slot
            name="master"
            :units="masterProps.units"
            :channel="masterProps.channel"
          />
        </template>
        <template slot="unit" scope="unitProps">
          <slot name="unit" :unit="unitProps.unit" />
        </template>
      </UnitsChannelRow>
    </div>
  </div>
</template>

<script>
  import { parseISO } from 'date-fns';

  import UnitsChannelRow from 'components/units/UnitsChannelRow';
  import CheckboxField from 'components/core/Checkbox';

  import { groupBy, uniqueDeep } from 'utils/collection';
  import { nameComparator } from 'utils/sort';
  import { formatDate } from 'utils/format';

  export default {
    components: {
      UnitsChannelRow,
      CheckboxField
    },
    props: {
      units: {
        type: Array,
        required: true
      },

      date: {
        type: String,
        required: true
      },

      isChecked: {
        type: Boolean,
        required: false
      },

      isEditable: {
        type: Boolean,
        default: true
      },

      unitTypes: {
        type: Array,
        required: true
      }
    },
    computed: {
      channels() {
        const allChannels = this.units.map(unit => unit.channel);
        return uniqueDeep(allChannels).sort(nameComparator);
      },

      unitsByChannel() {
        return groupBy(this.units, unit => unit.channel.id);
      },

      dateFormat() {
        return formatDate(parseISO(this.date), 'dd.MM.yyyy');
      },

      weekDay() {
        return formatDate(parseISO(this.date), 'EEEE');
      }
    },
    methods: {
      updateUnit(value) {
        this.$emit('unit:update', value);
      },

      onCheck(checked, value, event) {
        this.$emit('units:update', checked, event, this.date);
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    @include row;
  }

  .date-checkbox-wrapper {
    @include row;

    align-items: center;
    margin-bottom: 10px;
  }

  .wrapper {
    @include column;
  }

  .units-channel {
    @include row;
  }

  .checkbox {
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
  }

  .date-wrapper {
    @include column;

    margin-top: 20px;
    min-width: 120px;
    max-width: 200px;
  }

  .date-text-wrapper {
    display: inline-block;
  }

  .date {
    font-weight: bold;
  }

  .week-day {
    opacity: 0.5; // TODO: change with new color
  }
</style>
