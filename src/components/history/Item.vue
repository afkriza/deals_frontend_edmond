<template>
  <div class="g-item-wrapper">
    <div :class="$style.container">
      <div :class="$style.cell">
        <ul :class="$style.dateList">
          <li v-for="(date, dateIndex) in formattedDates" :key="dateIndex">
            {{ date }}
          </li>
        </ul>
      </div>
      <div :class="$style.cell">{{ channelNames }}</div>
      <div :class="$style.cell">{{ unitTypes }}</div>
      <div :class="$style.cell">
        <div :class="$style.modeIcon">
          <img
            v-if="unit.newStopSignalMode"
            :src="images.normal[newUnitModeImage]"
            :srcset="`${images.normal[newUnitModeImage]} 1x, ${images.retina[newUnitModeImage]} 2x`"
          />
          <span v-else :class="[$style.modeIcon, $style.placeholder]">—</span>
        </div>
        <span
          v-if="action"
          :class="[
            $style.upper,
            $style.suggestion,
            {
              [$style.close]: unit.stopSignal,
              [$style.open]: !unit.stopSignal
            }
          ]"
        >
          {{ action }}
        </span>
        <span v-else :class="$style.placeholder">—</span>
      </div>
      <div :class="$style.cell">
        <div :class="$style.modeIcon">
          <img
            v-if="isRatesTab && unit.newPriceLevelMode"
            :class="$style.modeIcon"
            :src="images.normal[newPriceLevelModeImage]"
            :srcset="`${images.normal[newPriceLevelModeImage]} 1x, ${images.retina[newPriceLevelModeImage]} 2x`"
          />
          <img
            v-else-if="!isRatesTab && unit.newPlacedUnitsMode"
            :class="$style.modeIcon"
            :src="images.normal[newPlacedUnitsModeImage]"
            :srcset="`${images.normal[newPlacedUnitsModeImage]} 1x, ${images.retina[newPlacedUnitsModeImage]} 2x`"
          />
          <span v-else :class="[$style.modeIcon, $style.placeholder]">—</span>
        </div>
        <span v-if="isRatesTab">
          <span
            v-if="priceLevel"
            :class="[$style.upper, $style.suggestion, $style.open]"
          >
            {{ priceLevel }}
          </span>
          <span v-else :class="$style.placeholder">—</span>
        </span>
        <span v-if="!isRatesTab">
          <span
            v-if="placeUnits"
            :class="[$style.upper, $style.suggestion, $style.open]"
          >
            {{ placeUnits }}
          </span>
          <span v-else :class="$style.placeholder">—</span>
        </span>
      </div>
      <div :class="$style.cell">
        {{ user }}
      </div>
    </div>
  </div>
</template>

<script>
  import unitFixedTransparent from 'fixed-transparent-big.png';
  import unitFixedTransparentRetina from 'fixed-transparent-big@2x.png';
  import unitAutopilotColored from 'autopilot-colored-big.png';
  import unitAutopilotColoredRetina from 'autopilot-colored-big@2x.png';
  import unitManualColored from 'manual-colored-big.png';
  import unitManualColoredRetina from 'manual-colored-big@2x.png';

  import { format, parseISO, differenceInDays } from 'date-fns';

  import { formatChange } from 'utils/format';
  import { separateByCommas } from 'utils/string';

  export default {
    filters: {
      formatChange(value) {
        return formatChange(value);
      }
    },
    props: {
      isRatesTab: {
        type: Boolean,
        required: true
      },
      unit: {
        type: Object,
        required: true
      },
      showLoader: {
        type: Boolean,
        required: true
      }
    },

    data() {
      return {
        isActivityDropdownOpen: false,
        images: {
          normal: {
            fixedNew: unitFixedTransparent,
            autoNew: unitAutopilotColored,
            manualNew: unitManualColored
          },
          retina: {
            fixedNew: unitFixedTransparentRetina,
            autoNew: unitAutopilotColoredRetina,
            manualNew: unitManualColoredRetina
          }
        }
      };
    },

    computed: {
      from() {
        return format(parseISO(this.unit.startDate), 'dd/MM/yyyy');
      },

      to() {
        if (this.unit.startDate !== this.unit.endDate) {
          return format(parseISO(this.unit.endDate), 'dd/MM/yyyy');
        }
      },

      action() {
        if (this.unit.stopSignal !== null) {
          return this.unit.stopSignal ? 'Stopped' : 'Open';
        }
      },

      channelNames() {
        return this.unit.channels;
      },

      unitTypes() {
        return separateByCommas(this.unit.unitTypes);
      },

      priceLevel() {
        return this.unit.priceLevel ? this.unit.priceLevel : '';
      },

      placeUnits() {
        return this.unit.noOfPlacedUnits ? this.unit.noOfPlacedUnits : '';
      },

      user() {
        return this.unit.user && this.unit.user.name ? this.unit.user.name : '';
      },

      newUnitModeImage() {
        return this.unit.newStopSignalMode
          ? `${this.unit.newStopSignalMode}New`
          : null;
      },

      newPriceLevelModeImage() {
        return this.unit.newPriceLevelMode
          ? `${this.unit.newPriceLevelMode}New`
          : null;
      },

      newPlacedUnitsModeImage() {
        return this.unit.newPlacedUnitsMode
          ? `${this.unit.newPlacedUnitsMode}New`
          : null;
      },

      parsedDates() {
        return this.unit.bookingDates.map(parseISO);
      },

      groupedDates() {
        return this.parsedDates
          .reduce((acc, currVal) => {
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
          }, [])
          .map(nestedArr => nestedArr.map(date => format(date, 'dd.MM.yyyy')));
      },

      formattedDates() {
        return this.groupedDates.map(arr => {
          if (arr.length > 1) {
            return `${arr[0]} — ${arr[arr.length - 1]}`;
          }

          return arr[0];
        });
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .item-wrapper {
    border-bottom: 1px solid $color-border-main;
  }

  .container {
    display: flex;

    max-width: 98%;

    @include media(large) {
      max-width: 93%;
    }
  }

  .cell {
    flex: 1 0;
    font-size: 14px;
    line-height: 24px;
    padding: 12px 0;
    color: $color-text-main;
    display: flex;
    align-items: center;
  }

  .bold {
    font-weight: bold;
  }

  .active {
    color: $color-text-primary;
  }

  .upper {
    text-transform: uppercase;
  }

  .light {
    color: $color-text-main-lighter;
  }

  .icon {
    margin-right: 8px;
    display: flex;
    align-items: center;
  }

  .arrow {
    display: flex;

    &.arrow-down {
      transform: rotate(180deg);
    }

    &.arrow-hidden {
      display: none;
    }
  }

  .delete {
    @include button;
    margin-right: 0;

    &:hover {
      @include svg-color($color-bg-warning);
    }
  }

  .dropdown-content {
    padding: 8px;
    width: 160px;
    font-size: 12px;
    color: $color-text-main-lighter;
  }

  .dropdown-caption {
    display: block;
    font-size: 10px;
  }

  .suggestion {
    font-weight: bold;

    &.close {
      color: $color-text-warning;
    }

    &.open {
      color: $color-text-primary;
    }
  }

  .mode-icon {
    width: 24px;
    margin-right: 45px;
  }

  .date-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .placeholder {
    color: $color-text-main-lighter;
  }
</style>

<style lang="scss">
  @import 'utils';

  // TODO: do this with deep instead of global CSS
  .g-item-wrapper {
    border-bottom: 1px solid $color-border-main-light;
  }
</style>
