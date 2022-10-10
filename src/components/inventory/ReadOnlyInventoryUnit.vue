<template>
  <div :class="$style.wrapper">
    <div :class="[$style.card, unitClasses]">
      <div :class="$style.stateWrapper">
        <img
          :class="$style.inventorySuggestion"
          :src="images.normal[inventoryStopSignalSuggestionImage]"
          :srcset="
            `${images.normal[inventoryStopSignalSuggestionImage]} 1x,
            ${images.retina[inventoryStopSignalSuggestionImage]} 2x`
          "
        />
        <div
          :class="[
            $style.stateText,
            { [$style.stateTextInactive]: unit.isAvailabilityAuto }
          ]"
        >
          {{ stateText }}
        </div>
      </div>
      <div :class="$style.unitInfoWrapper">
        <img
          :class="$style.inventorySuggestion"
          :src="images.normal.inventoryDefault"
          :srcset="
            `${images.normal.inventoryDefault} 1x, ${images.retina.inventoryDefault} 2x`
          "
        />
        <span :class="$style.unitInfo">
          OVB: {{ unit.noOfOverbookedUnits }}, SS: {{ unit.noOfFreeUnits }}
        </span>
      </div>
      <div :class="$style.psWrapper">
        <img
          :class="$style.inventorySuggestion"
          :src="images.normal[psSuggestionImage]"
          :srcset="
            `${images.normal[psSuggestionImage]} 1x, ${images.retina[psSuggestionImage]} 2x`
          "
        />
        <span :class="$style.psLabel">PS</span>
        <div v-html="unit.currentNoOfPlacedUnits" :class="$style.psLevel"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import inventoryAutopilot from 'autopilot.png';
  import inventoryAutopilotRetina from 'autopilot@2x.png';
  import inventoryFixed from 'fixed.png';
  import inventoryFixedRetina from 'fixed@2x.png';
  import inventoryDefault from 'rate-default.png';
  import inventoryDefaultRetina from 'rate-default@2x.png';

  import unitModes from 'enums/unit-modes';

  export default {
    props: {
      unit: {
        type: Object,
        required: true
      }
    },

    computed: {
      stateText() {
        return !this.unit.currentStopSignal ? 'Open' : 'Stop';
      },

      inventoryStopSignalSuggestionImage() {
        if (this.unit.newStopSignalMode === unitModes.FIXED) {
          return 'inventoryFixed';
        } else if (this.unit.newStopSignalMode === unitModes.AUTO) {
          return 'inventoryAutopilot';
        }

        return 'inventoryDefault';
      },

      psSuggestionImage() {
        if (this.unit.newPlacedUnitsMode === unitModes.FIXED) {
          return 'inventoryFixed';
        } else if (this.unit.newPlacedUnitsMode === unitModes.AUTO) {
          return 'inventoryAutopilot';
        }

        return 'inventoryDefault';
      },

      unitClasses() {
        return {
          [this.$style.isStopped]: this.unit.isStopped,
          [this.$style.isAccepted]: this.unit.isAccepted,
          [this.$style.hasFixedState]: this.unit.hasFixedState
        };
      }
    },

    data() {
      return {
        images: {
          normal: {
            inventoryAutopilot,
            inventoryFixed,
            inventoryDefault
          },
          retina: {
            inventoryAutopilotRetina,
            inventoryFixed: inventoryFixedRetina,
            inventoryDefault: inventoryDefaultRetina
          }
        }
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .wrapper {
    width: 160px;
    margin: 12px 0;
  }

  .card {
    font-size: 12px;
    position: relative;
    border-radius: $base-border-radius;
    border: 1px solid $color-border-main-light;
    border-top-width: 2px;
    margin: 0 6px;
    background-color: $color-bg-light;
    color: $color-text-main;
    flex: 1 0 auto;
    display: flex;
    padding: 10px;
    flex-direction: column;

    &.is-active {
      border-top-color: $color-border-success;
    }

    &.is-stopped {
      border-top-color: $color-border-warning;
    }
  }

  .state-wrapper {
    display: flex;
    align-items: center;
  }

  .state-text {
    padding-left: 5px;
    text-transform: uppercase;

    &.state-text-inactive {
      color: $color-text-main-lighter;
    }
  }

  .inventory-suggestion {
    display: inline-block;
    width: 16px;
    height: 16px;
  }

  .unit-info-wrapper {
    display: flex;
    align-items: center;
    margin-top: 8px;
    margin-bottom: 6px;
    color: $color-text-main-lighter;
  }

  .unit-info {
    padding-left: 4px;
  }

  .ps-wrapper {
    display: flex;
    align-items: center;
  }

  .ps-label {
    margin-left: 5px;
    margin-right: 10px;
    color: $color-text-main;
  }
</style>
