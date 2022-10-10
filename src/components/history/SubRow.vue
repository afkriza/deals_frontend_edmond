<template>
  <div class="g-subrow-wrapper">
    <div :class="$style.container">
      <div :class="[$style.cell, $style.bold]">
        <BasicTooltip
          align="center"
          arrow-position="top"
          theme="dark"
          :condensed="true"
          :class="$style.tooltipWrapper"
          :offset="{ vertical: 35 }"
        >
          <span slot="trigger" :class="$style.icon">
            <template v-if="phobsStatus.status === phobsStatuses.SUCCESS">
              <!-- @svg("success") -->
            </template>
            <template v-if="phobsStatus.status === phobsStatuses.SCHEDULED">
              <!-- @svg("scheduled") -->
            </template>
            <template v-if="phobsStatus.status === phobsStatuses.ERROR">
              <!-- @svg("error") -->
            </template>
            <template v-if="phobsStatus.status === phobsStatuses.UNDEFINED">
              <!-- @svg("undefined") -->
            </template>
          </span>
          <div :class="$style.tooltip">
            <div v-for="message in phobsStatus.errorMessages" :key="message">
              {{ message }}
            </div>
            <div v-if="!phobsStatus.errorMessages.length">
              {{ phobsStatus.description }}
            </div>
          </div>
        </BasicTooltip>
        <span>{{ firstUnit.property.name }}</span>
      </div>
      <div :class="$style.propertyGroups">
        <HistoryItem
          v-for="unit in propertyGroup"
          :key="unit.id"
          :is-rates-tab="isRatesTab"
          :unit="unit"
          :show-loader="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { phobsStatuses } from 'enums/phobs-statuses';

  import BasicTooltip from 'components/core/BasicTooltip';
  import HistoryItem from 'components/history/Item';

  export default {
    components: {
      BasicTooltip,
      HistoryItem
    },

    props: {
      isRatesTab: {
        type: Boolean,
        required: true
      },

      propertyGroup: {
        type: Array,
        required: true
      }
    },

    data() {
      return {
        phobsStatuses
      };
    },

    computed: {
      firstUnit() {
        return this.propertyGroup[0];
      },

      phobsStatus() {
        return this.firstUnit.phobsStatus;
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    display: flex;
    margin-left: 20px;
  }

  .cell {
    display: flex;
    align-items: flex-start;
    flex-basis: 14.5%;
    font-weight: bold;
    line-height: 20px;
    padding: 12px 0;
    color: $color-text-main;

    @include media(large) {
      flex-basis: 13.5%;
    }
  }

  .property-groups {
    flex: 1;
  }

  .tooltip-wrapper {
    margin-right: 13px;
  }

  .tooltip {
    font-size: 12px;
    font-weight: normal;
    line-height: 16px;

    white-space: nowrap;
  }
</style>

<style lang="scss">
  @import 'utils';

  // TODO: do this with deep instead of global CSS
  .g-subrow-wrapper {
    &:last-child {
      margin-bottom: -1px; // Compensate for the last item border

      .g-item-wrapper:last-child {
        border-bottom: 0;
      }
    }
  }
</style>
