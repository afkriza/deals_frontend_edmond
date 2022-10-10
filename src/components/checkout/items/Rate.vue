<template>
  <div
    :class="$style.wrapper"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
  >
    <CellItem upper>{{ channelName }}</CellItem>
    <CellItem>{{ formattedUnitTypes }}</CellItem>
    <CellItem upper>
      <img
        :class="$style.modeIcon"
        :src="images.normal[rateModeImage]"
        :srcset="`${images.normal[rateModeImage]} 1x, ${images.retina[rateModeImage]} 2x`"
      />
      <span v-if="rate.isAvailabilityModeDirty" :class="$style.iconWrapper">
        <!-- @svg("arrow-right") -->
        <img
          :class="$style.modeIcon"
          :src="images.normal[newRateModeImage]"
          :srcset="`${images.normal[newRateModeImage]} 1x, ${images.retina[newRateModeImage]} 2x`"
        />
      </span>
    </CellItem>
    <CellItem
      bold
      upper
      light
      :active="updatedStatus === 'Open'"
      :danger="updatedStatus === 'Stop'"
    >
      {{ updatedStatus || '—' }}
    </CellItem>
    <CellItem>
      <img
        :class="$style.modeIcon"
        :src="images.normal[priceLevelModeImage]"
        :srcset="`${images.normal[priceLevelModeImage]} 1x, ${images.retina[priceLevelModeImage]} 2x`"
      />
      <span v-if="rate.isPriceLevelModeDirty" :class="$style.iconWrapper">
        <!-- @svg("arrow-right") -->
        <img
          :class="$style.modeIcon"
          :src="images.normal[newPriceLevelModeImage]"
          :srcset="`${images.normal[newPriceLevelModeImage]} 1x, ${images.retina[newPriceLevelModeImage]} 2x`"
        />
      </span>
    </CellItem>
    <CellItem>{{ currentRate }}</CellItem>
    <CellItem bold>
      <div
        v-if="diff"
        :class="[
          {
            [$style.rateDiffUp]: diff > 0,
            [$style.rateDiffDown]: diff < 0
          },
          $style.rateDiff
        ]"
      >
        <img
          :class="$style.arrow"
          :src="images.normal[arrowIcon]"
          :srcset="`${images.normal[arrowIcon]} 1x, ${images.retina[arrowIcon]} 2x`"
        />
        <span>€ {{ diff | formatChange }}</span>
      </div>
    </CellItem>
    <CellItem bold active>{{ newRate }}</CellItem>
    <CellItem :small="isDeleteShown">
      <ButtonFlat
        v-show="isDeleteShown"
        :class="[$style.icon, $style.deleteBtn]"
        @click="deleteItem"
      >
        <span :class="$style.deleteIcon">
          <!-- @svg("delete") -->
        </span>
      </ButtonFlat>

      <CoreCheckbox
        :checked="checked"
        :theme="checkboxTheme"
        @checked:update="toggleCheckStatus"
      />
    </CellItem>
  </div>
</template>

<script>
  import { isEqual } from 'lodash';

  import rateFixed from 'fixed-big.png';
  import rateFixedRetina from 'fixed-big@2x.png';
  import rateFixedTransparent from 'fixed-transparent-big.png';
  import rateFixedTransparentRetina from 'fixed-transparent-big@2x.png';
  import rateAutopilot from 'autopilot-big.png';
  import rateAutopilotRetina from 'autopilot-big@2x.png';
  import rateAutopilotColored from 'autopilot-colored-big.png';
  import rateAutopilotColoredRetina from 'autopilot-colored-big@2x.png';
  import rateManual from 'manual-big.png';
  import rateManualRetina from 'manual-big@2x.png';
  import rateManualColored from 'manual-colored-big.png';
  import rateManualColoredRetina from 'manual-colored-big@2x.png';
  import rateUp from 'rate-up-big.png';
  import rateUpRetina from 'rate-up-big@2x.png';
  import rateDown from 'rate-down-big.png';
  import rateDownRetina from 'rate-down-big@2x.png';

  import CoreCheckbox from 'components/core/Checkbox';
  import ButtonFlat from 'components/buttons/ButtonFlat';
  import CellItem from './Cell';

  import channels from 'enums/channels';
  import { formatChange } from 'utils/format';

  export default {
    components: {
      ButtonFlat,
      CoreCheckbox,
      CellItem
    },

    filters: {
      formatChange(value) {
        return formatChange(value);
      }
    },

    props: {
      channelGroup: {
        type: Array,
        required: true
      },
      currentUser: {
        type: Object,
        required: true
      },
      showLoader: {
        type: Boolean,
        required: true
      },
      units: {
        type: Array,
        required: true
      },
      hasDatesInPast: {
        type: Boolean,
        required: true
      },
      allUnitTypes: {
        type: Array,
        default() {
          return [];
        }
      }
    },

    data() {
      const checkboxTheme = this.hasDatesInPast
        ? ['primary', 'small', 'warning']
        : ['primary', 'small'];

      return {
        isDeleteShown: false,
        checkboxTheme,
        images: {
          normal: {
            rateUp,
            rateDown,
            fixed: rateFixed,
            fixedNew: rateFixedTransparent,
            auto: rateAutopilot,
            autoNew: rateAutopilotColored,
            manual: rateManual,
            manualNew: rateManualColored
          },
          retina: {
            rateUp: rateUpRetina,
            rateDown: rateDownRetina,
            fixed: rateFixedRetina,
            fixedNew: rateFixedTransparentRetina,
            auto: rateAutopilotRetina,
            autoNew: rateAutopilotColoredRetina,
            manual: rateManualRetina,
            manualNew: rateManualColoredRetina
          }
        }
      };
    },

    computed: {
      rate() {
        return this.units[0];
      },

      unitTypes() {
        return this.channelGroup[0].unitTypes;
      },

      formattedUnitTypes() {
        return isEqual(this.unitTypes, this.allUnitTypes)
          ? 'All types'
          : this.unitTypes.join(', ');
      },

      checked() {
        return this.units.every(unit => unit.confirmed);
      },

      channelName() {
        return this.channelGroup
          .map(
            ({ channelId }) =>
              channels.find(channel => channel.id === channelId).name
          )
          .join(', ');
      },

      lowestCurrentPriceAmount() {
        let min = Math.min(
          ...this.units.map(unit => unit.currentPriceAmount).filter(Boolean)
        );

        if (min === Infinity) {
          min = '-';
        }

        return min;
      },

      lowestNewPriceAmount() {
        if (this.lowestCurrentPriceAmount === '-') {
          return Math.min(
            ...this.units.map(unit => unit.newPriceAmount).filter(Boolean)
          );
        }

        return this.units.find(
          unit => unit.currentPriceAmount === this.lowestCurrentPriceAmount
        ).newPriceAmount;
      },

      currentPriceLevel() {
        return this.rate.currentPriceLevel;
      },

      currentPriceAmountRounded() {
        return Math.round(this.rate.lowestCurrentPriceAmount);
      },

      newPriceLevel() {
        return this.rate.newPriceLevel;
      },

      newPriceAmountRounded() {
        return Math.round(this.rate.newPriceAmount);
      },

      currentRate() {
        return this.formatPrice(
          this.currentPriceLevel,
          this.currentPriceAmountRounded
        );
      },

      diff() {
        return this.lowestNewPriceAmount - this.lowestCurrentPriceAmount;
      },

      newRate() {
        return this.formatPrice(this.newPriceLevel, this.newPriceAmountRounded);
      },

      rateModeImage() {
        return this.rate.stopSignalMode;
      },

      newRateModeImage() {
        return `${this.rate.newStopSignalMode}New`;
      },

      priceLevelModeImage() {
        return this.rate.priceLevelMode;
      },

      newPriceLevelModeImage() {
        return `${this.rate.newPriceLevelMode}New`;
      },

      arrowIcon() {
        return this.diff > 0 ? 'rateUp' : 'rateDown';
      },

      isUserUpdater() {
        const isPriceLevelSame =
          this.rate.newPriceLevel === this.rate.priceLevel;
        const isPriceAmountSame =
          this.rate.newPriceAmount === this.rate.priceAmount;
        const isStopSignalSame =
          this.rate.newStopSignal === this.rate.stopSignal;
        return !isPriceLevelSame || !isPriceAmountSame || !isStopSignalSame;
      },

      user() {
        return this.isUserUpdater ? this.currentUser.name : 'Edmond';
      },

      updatedStatus() {
        return this.rate.updatedStatus ? this.rate.updatedStatus : '—';
      }
    },

    created() {
      if (this.hasDatesInPast) {
        this.toggleCheckStatus();
      }
    },

    methods: {
      deleteItem() {
        this.units.forEach(unit => {
          this.$emit('item:delete', unit);
        });
      },

      formatPrice(price, amount) {
        const outputPrice = price || '—';
        const outputAmount = amount ? `€ ${amount}` : '—';
        return `${outputPrice} / ${outputAmount}`;
      },

      toggleCheckStatus() {
        this.units.forEach(unit => {
          this.$emit('item:update', {
            unitID: unit.id,
            value: {
              confirmed: !unit.confirmed
            }
          });
        });
      },

      onMouseOver() {
        this.isDeleteShown = true;
      },

      onMouseLeave() {
        this.isDeleteShown = false;
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .wrapper {
    display: flex;
  }

  .icon {
    margin-right: 8px;
    display: flex;
    align-items: center;
  }

  .delete-btn {
    margin-right: auto;
    margin-left: 20%;
    position: absolute;
    left: 0;
  }

  .delete-icon {
    &:hover {
      @include svg-color($color-bg-warning);
    }
  }

  .arrow {
    margin-right: 2px;
  }

  .rate-diff {
    display: flex;
  }

  .rate-diff-up {
    color: $color-text-primary;
  }

  .rate-diff-down {
    color: $color-secondary;
  }

  .icon-wrapper {
    display: inline-block;
    max-height: 24px;
  }
</style>
