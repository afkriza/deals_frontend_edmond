<template>
  <div :class="$style.wrapper">
    <div :class="[$style.card, unitClasses]">
      <div :class="$style.stateWrapper">
        <img
          :class="$style.rateSuggestion"
          :src="images.normal[rateStopSignalSuggestionImage]"
          :srcset="
            `${images.normal[rateStopSignalSuggestionImage]} 1x,
            ${images.retina[rateStopSignalSuggestionImage]} 2x`
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
      <div :class="$style.priceLevelWrapper">
        <img
          :class="$style.rateSuggestion"
          :src="images.normal[ratePriceSuggestionImage]"
          :srcset="
            `${images.normal[ratePriceSuggestionImage]} 1x,
            ${images.retina[ratePriceSuggestionImage]} 2x`
          "
        />
        <div v-html="parsedPriceLevel" :class="$style.priceLevel"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import rateDefault from 'rate-default.png';
  import rateDefaultRetina from 'rate-default@2x.png';
  import rateFixed from 'fixed.png';
  import rateFixedRetina from 'fixed@2x.png';
  import rateAutopilot from 'autopilot.png';
  import rateAutopilotRetina from 'autopilot@2x.png';

  import unitModes from 'enums/unit-modes';

  export default {
    props: {
      unit: {
        type: Object,
        required: true
      }
    },

    computed: {
      pricesByPriceLevel() {
        return this.unit.pricesByPriceLevel;
      },

      stateText() {
        return !this.unit.currentStopSignal ? 'Open' : 'Stop';
      },

      parsedPriceLevel() {
        return this.priceLevelAmount(this.unit.currentPriceLevel);
      },

      ratePriceSuggestionImage() {
        if (this.unit.newPriceLevelMode === unitModes.FIXED) {
          return 'rateFixed';
        } else if (this.unit.newPriceLevelMode === unitModes.AUTO) {
          return 'rateAutopilot';
        }

        return 'rateDefault';
      },

      rateStopSignalSuggestionImage() {
        if (this.unit.newStopSignalMode === unitModes.FIXED) {
          return 'rateFixed';
        } else if (this.unit.newStopSignalMode === unitModes.AUTO) {
          return 'rateAutopilot';
        }

        return 'rateDefault';
      },

      unitClasses() {
        return {
          [this.$style.isActive]: this.unit.isActive,
          [this.$style.isStopped]: this.unit.isStopped,
          [this.$style.hasFixedState]: this.unit.hasFixedState
        };
      }
    },

    methods: {
      priceLevelAmount(priceLevel) {
        return `${priceLevel} / ${this.pricesByPriceLevel[priceLevel]} €`;
      }
    },

    data() {
      return {
        images: {
          normal: {
            rateAutopilot,
            rateDefault,
            rateFixed
          },
          retina: {
            rateAutopilot: rateAutopilotRetina,
            rateDefault: rateDefaultRetina,
            rateFixed: rateFixedRetina
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
    margin-bottom: 5px;
  }

  .state-text {
    letter-spacing: 0.2px;
    padding-left: 5px;
    text-transform: uppercase;

    &.state-text-inactive {
      color: $color-text-main-lighter;
    }
  }

  .price-level-wrapper {
    display: flex;
    align-items: center;
  }

  .price-level {
    padding: 5px;
  }

  .rate-suggestion {
    display: inline-block;
    width: 16px;
    height: 16px;
  }
</style>
