<template>
  <div :class="[$style.wrapper, unitClasses, checkedClass]">
    <div v-if="!unit.checked" :class="$style.unitStatus"></div>
    <div
      :class="[
        $style.card,
        checkedClass,
        unitClasses,
        suggestionClasses,
        chosenPriceClass,
        updatedSignalClass
      ]"
      @mouseover="onMouseOver"
      @mouseleave="onMouseLeave"
    >
      <div v-show="hasOverlay" :class="$style.overlay">
        <div v-if="isSaved" :class="$style.overlayLogo">
          <!-- @svg("checkmark-gray") -->
        </div>
        <div v-if="unit.accepted && !isSaved" :class="$style.overlayLogo">
          <!-- @svg("pencil-white") -->
        </div>
      </div>
      <checkbox-field
        v-if="shouldShowCheckbox"
        v-show="isCheckboxVisible"
        :theme="['primary', 'white']"
        :class="$style.checkbox"
        :checked="unit.checked"
        @checked:update="onCheck"
      />
      <div v-if="shouldShowAvailabilityControls" :class="$style.stateWrapper">
        <img
          :class="$style.rateSuggestion"
          :src="images.normal[rateStopSignalSuggestionImageType]"
          :srcset="
            `${images.normal[rateStopSignalSuggestionImageType]} 1x,
            ${images.retina[rateStopSignalSuggestionImageType]} 2x`
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
        <div v-if="!unit.isAvailabilityAuto" :class="$style.stateSwitchWrapper">
          <app-switch
            :isActive="isSwitchActive"
            @switch:activate="onOpen"
            @switch:deactivate="onStop"
          />
        </div>
      </div>
      <div v-else :class="$style.stateWrapper">
        <img
          :class="$style.rateSuggestion"
          :src="images.normal[rateStopSignalSuggestionImageType]"
          :srcset="
            `${images.normal[rateStopSignalSuggestionImageType]} 1x,
            ${images.retina[rateStopSignalSuggestionImageType]} 2x`
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
          :src="ratePriceSuggestionImage"
          :srcset="
            `${ratePriceSuggestionImage} 1x, ${ratePriceRetinaSuggestionImage} 2x`
          "
        />

        <basic-dropdown
          v-if="!this.unit.isPriceLevelAuto && priceLevelControls"
          :class="[
            $style.dropdown,
            { [$style.isSelected]: isDropdownOpen, [$style.disabled]: disabled }
          ]"
          :isOpen="isDropdownOpen"
          :offset="calculatedOffset"
          :disabled="disabled"
          @dropdown:open="openDropdown"
          @dropdown:close="closeDropdown"
          ref="dropdown"
        >
          <template #trigger>
            <div :class="[$style.trigger, { [$style.disabled]: disabled }]">
              <span>{{ dropdownPriceLevel }}</span>
              <ArrowDown
                v-if="!disabled"
                :class="$style.arrow"
                :rotated="isDropdownOpen"
              />
            </div>
          </template>
          <div :class="$style.content">
            <div :class="$style.dropdownOptions">
              <div
                v-for="(priceLevel, index) in allowedPriceLevels"
                :key="index"
                :class="[
                  $style.dropdownOption,
                  {
                    [$style.isProposed]: isProposedPriceLevel(priceLevel)
                  }
                ]"
                @click="onDropdownClick(priceLevel)"
              >
                <div
                  :class="[
                    {
                      [$style.isProposed]: isProposedPriceLevel(priceLevel),
                      [$style.raisedPrice]:
                        newPriceLevel === priceLevel && isRaisedToSuggestion,
                      [$style.loweredPrice]:
                        newPriceLevel === priceLevel && isLoweredToSuggestion
                    },
                    $style.dropdownOptionLabel
                  ]"
                  @input="onDropdownClick(priceLevel)"
                >
                  {{ priceLevelAmount(priceLevel) }}
                </div>
              </div>
            </div>
            <div :class="$style.footer">
              <div :class="$style.priceContainer">
                Base price: <label :class="$style.price">{{ basePrice }}</label>
              </div>
              <div :class="$style.priceContainer">
                Current price:
                <label :class="$style.price">{{ currentPrice }}</label>
              </div>
            </div>
          </div>
        </basic-dropdown>
        <div
          v-else
          v-html="dropdownPriceLevel"
          :class="$style.priceLevel"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
  import rateFixed from 'fixed.png';
  import rateFixedRetina from 'fixed@2x.png';
  import rateFixedTransparent from 'fixed-transparent.png';
  import rateFixedTransparentRetina from 'fixed-transparent@2x.png';
  import rateAutopilot from 'autopilot.png';
  import rateAutopilotRetina from 'autopilot@2x.png';
  import rateAutopilotColored from 'autopilot-colored.png';
  import rateAutopilotColoredRetina from 'autopilot-colored@2x.png';
  import rateDefault from 'rate-default.png';
  import rateDefaultRetina from 'rate-default@2x.png';
  import rateUp from 'rate-up.png';
  import rateUpRetina from 'rate-up@2x.png';
  import rateDown from 'rate-down.png';
  import rateDownRetina from 'rate-down@2x.png';
  import rateOpen from 'rate-open.png';
  import rateOpenRetina from 'rate-open@2x.png';
  import rateStop from 'rate-stop.png';
  import rateStopRetina from 'rate-stop@2x.png';

  import CheckboxField from 'components/core/Checkbox';
  import BasicDropdown from 'components/core/BasicDropdown';
  import AppSwitch from 'components/core/AppSwitch';

  import { channels } from 'enums/channels';
  import unitModes from 'enums/unit-modes';

  import { formatPriceNumber } from 'utils/format';
  import ArrowDown from '@/components/icons/ArrowDown';

  export default {
    props: {
      unit: {
        type: Object,
        required: true
      },
      savedUnits: {
        type: Array,
        required: true
      },
      priceLevelControls: {
        type: Boolean,
        default: true
      },
      altAvailabilityControls: {
        type: Boolean,
        default: true
      }
    },
    components: {
      ArrowDown,
      CheckboxField,
      BasicDropdown,
      AppSwitch
    },
    computed: {
      allowedPriceLevels() {
        return this.unit.priceLevels;
      },

      pricesByPriceLevel() {
        return this.unit.pricesByPriceLevel;
      },

      newPriceLevel: {
        get() {
          return this.unit.newPriceLevel;
        },

        set(value) {
          this.$emit('unit:update', {
            unitID: this.unit.id,
            value: {
              newStopSignal: false,
              newPriceLevel: value,
              accepted: false
            }
          });
        }
      },

      dropdownPriceLevel() {
        return this.priceLevelAmount(this.newPriceLevel);
      },

      ratePriceSuggestionImageType() {
        if (this.unit.newPriceLevelMode === unitModes.FIXED) {
          return this.unit.priceLevelMode === unitModes.FIXED
            ? 'rateFixed'
            : 'rateFixedTransparent';
        } else if (this.unit.newPriceLevelMode === unitModes.AUTO) {
          return this.unit.priceLevelMode === unitModes.AUTO
            ? 'rateAutopilot'
            : 'rateAutopilotColored';
        } else if (this.unit.newPriceLevel !== this.unit.priceLevel) {
          return this.shouldRaiseNewPrice ? 'rateUp' : 'rateDown';
        }

        return 'rateDefault';
      },

      rateStopSignalSuggestionImageType() {
        if (this.unit.newStopSignalMode === unitModes.FIXED) {
          return this.unit.stopSignalMode === unitModes.FIXED
            ? 'rateFixed'
            : 'rateFixedTransparent';
        } else if (this.unit.newStopSignalMode === unitModes.AUTO) {
          return this.unit.stopSignalMode === unitModes.AUTO
            ? 'rateAutopilot'
            : 'rateAutopilotColored';
        } else if (this.unit.currentStopSignal !== this.unit.stopSignal) {
          return this.unit.stopSignal ? 'rateStop' : 'rateOpen';
        }

        return 'rateDefault';
      },

      chosenPriceClass() {
        if (this.isRaisedToSuggestion) {
          return this.$style.raised;
        } else if (this.isLoweredToSuggestion) {
          return this.$style.lowered;
        }
        return '';
      },

      isSignalUpdated() {
        return this.unit.newStopSignal !== this.unit.currentStopSignal;
      },

      isSaved() {
        return this.savedUnits.some(unit => unit.id === this.unit.id);
      },

      shouldShowAvailabilityControls() {
        return (
          this.unit.channel.id !== channels.ALT.id ||
          this.altAvailabilityControls
        );
      },

      shouldShowCheckbox() {
        return this.shouldShowAvailabilityControls || this.priceLevelControls;
      },

      stateText() {
        if (this.isSignalUpdated) {
          return this.isSwitchActive ? 'Opened' : 'Stopped';
        }

        return this.isSwitchActive ? 'Open' : 'Stop';
      },

      suggestionClasses() {
        if (!this.unit.currentPriceLevel || this.shouldRaiseNewPrice) {
          return this.$style.hasSuggestionHigher;
        } else if (this.shouldLowerNewPrice) {
          return this.$style.hasSuggestionLower;
        }
        return '';
      },

      unitClasses() {
        return {
          [this.$style.hasSuggestion]: this.unit.hasSuggestion,
          [this.$style.isActive]: this.unit.isActive,
          [this.$style.isStopped]: this.unit.isStopped,
          [this.$style.isCurrentActive]: !this.unit.currentStopSignal,
          [this.$style.isCurrentStopped]: this.unit.currentStopSignal,
          [this.$style.isAccepted]: this.unit.isAccepted,
          [this.$style.isUpdated]: this.unit.isPriceLevelDirty,
          [this.$style.hasFixedState]: this.unit.hasFixedState
        };
      },

      checkedClass() {
        return this.unit.checked ? this.$style.isChecked : '';
      },

      shouldRaiseNewPrice() {
        return (
          this.pricesByPriceLevel[this.unit.priceLevel] >
          this.pricesByPriceLevel[this.unit.newPriceLevel]
        );
      },

      shouldLowerNewPrice() {
        return (
          this.pricesByPriceLevel[this.unit.priceLevel] <
          this.pricesByPriceLevel[this.unit.newPriceLevel]
        );
      },

      isRaised() {
        return (
          this.pricesByPriceLevel[this.unit.newPriceLevel] >
          this.pricesByPriceLevel[this.unit.currentPriceLevel]
        );
      },

      isLowered() {
        return (
          this.pricesByPriceLevel[this.unit.newPriceLevel] <
          this.pricesByPriceLevel[this.unit.currentPriceLevel]
        );
      },

      isRaisedToSuggestion() {
        return (
          this.unit.newPriceLevel === this.unit.priceLevel && this.isRaised
        );
      },

      isLoweredToSuggestion() {
        return (
          this.unit.newPriceLevel === this.unit.priceLevel && this.isLowered
        );
      },

      hasOverlay() {
        return (this.isSaved || this.unit.accepted) && !this.isMouseOver;
      },

      updatedSignalClass() {
        if (this.isSignalUpdated) {
          if (this.unit.newStopSignal) {
            return this.$style.isSignalStopped;
          }
          return this.$style.isSignalOpened;
        }

        return '';
      },

      isSwitchActive() {
        return !this.unit.newStopSignal;
      },

      isCheckboxVisible() {
        return this.isMouseOver || this.unit.checked;
      },

      ratePriceSuggestionImage() {
        return this.priceLevelControls
          ? this.images.normal[this.ratePriceSuggestionImageType]
          : this.images.normal.rateDefault;
      },

      ratePriceRetinaSuggestionImage() {
        return this.priceLevelControls
          ? this.images.retina[this.ratePriceSuggestionImageType]
          : this.images.retina.rateDefault;
      },

      basePrice() {
        const basePriceLevel = this.allowedPriceLevels[
          this.unit.basePriceIndex
        ];
        return this.priceLevelAmount(basePriceLevel);
      },

      currentPrice() {
        return this.priceLevelAmount(this.unit.currentPriceLevel);
      },

      calculatedOffset() {
        const verticalOffset = this.showBelow ? 0 : -(this.dropdownHeight + 25);
        const horizontalOffset = this.showLeft
          ? 0
          : -(this.dropdownWidth - 108);

        return {
          horizontal: horizontalOffset,
          vertical: verticalOffset
        };
      },

      numberOfRows() {
        const numberOfPrices = this.allowedPriceLevels.length;
        if (numberOfPrices >= 8) {
          return 8;
        }
        return numberOfPrices;
      },

      numberOfColumns() {
        const numberOfPrices = this.allowedPriceLevels.length;
        return Math.floor(numberOfPrices / 8) + 1;
      },

      dropdownHeight() {
        return this.numberOfRows * 32 + 48;
      },

      dropdownWidth() {
        return this.numberOfColumns * 110 + (this.numberOfColumns - 1) * 8 + 16;
      },

      disabled() {
        return (
          this.allowedPriceLevels.length === 0 &&
          !this.allowedPriceLevels[this.unit.basePriceIndex] &&
          !this.unit.currentPriceLevel
        );
      }
    },

    methods: {
      priceLevelAmount(priceLevel) {
        return priceLevel
          ? `${priceLevel} / € ${formatPriceNumber(
              this.pricesByPriceLevel[priceLevel]
            )}`
          : 'Undefined';
      },

      isProposedPriceLevel(priceLevel) {
        return priceLevel === this.unit.priceLevel;
      },

      onOpen() {
        this.$emit('unit:update', {
          unit: this.unit,
          value: {
            newStopSignal: false
          }
        });
      },

      onStop() {
        this.$emit('unit:update', {
          unit: this.unit,
          value: {
            newStopSignal: true
          }
        });
      },

      onCheck() {
        this.$emit('unit:update', {
          unit: this.unit,
          value: {
            checked: !this.unit.checked
          }
        });
      },

      onDropdownClick(value) {
        this.$emit('unit:update', {
          unit: this.unit,
          value: {
            newPriceLevel: value
          }
        });

        this.isDropdownOpen = false;
      },

      openDropdown() {
        this.showBelow =
          this.dropdownDistanceBottomWindow() - 124 >= this.dropdownHeight ||
          this.$refs.dropdown.$el.getBoundingClientRect().top - 100 <=
            this.dropdownHeight;

        this.showLeft =
          this.dropdownDistanceLeftWindow() >= this.dropdownWidth ||
          this.$refs.dropdown.$el.getBoundingClientRect().left - 64 <
            this.dropdownWidth;
        const rowsNum = this.numberOfRows;
        document.documentElement.style.setProperty('--numberOfRows', rowsNum);
        this.isDropdownOpen = true;
      },

      closeDropdown() {
        this.isDropdownOpen = false;
      },

      onMouseOver() {
        this.isMouseOver = true;
      },

      onMouseLeave() {
        this.isMouseOver = false;
      },

      dropdownDistanceBottomWindow() {
        return (
          window.innerHeight -
          this.$refs.dropdown.$el.getBoundingClientRect().top +
          this.$refs.dropdown.$el.getBoundingClientRect().height
        );
      },
      dropdownDistanceLeftWindow() {
        return (
          window.innerWidth -
          this.$refs.dropdown.$el.getBoundingClientRect().left
        );
      }
    },
    data() {
      return {
        isMouseOver: false,
        isDropdownOpen: false,
        images: {
          normal: {
            rateFixed,
            rateFixedTransparent,
            rateAutopilot,
            rateAutopilotColored,
            rateDefault,
            rateUp,
            rateDown,
            rateOpen,
            rateStop
          },
          retina: {
            rateFixed: rateFixedRetina,
            rateFixedTransparent: rateFixedTransparentRetina,
            rateAutopilot: rateAutopilotRetina,
            rateAutopilotColored: rateAutopilotColoredRetina,
            rateDefault: rateDefaultRetina,
            rateUp: rateUpRetina,
            rateDown: rateDownRetina,
            rateOpen: rateOpenRetina,
            rateStop: rateStopRetina
          }
        },
        showBelow: true,
        showLeft: true
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  $border-top-radius: 2px;
  $border-bottom-radius: 4px;

  .wrapper {
    width: 160px;
    margin: 12px 0;
    padding-left: 6px;
    padding-right: 6px;

    .unit-status {
      height: 4px;
      background-color: $color-border-main-light;
    }

    &.is-active {
      .unit-status {
        background-color: $color-border-success;
      }
    }

    &.is-stopped {
      .unit-status {
        background-color: $color-border-warning;
      }
    }

    &.is-checked {
      .unit-status {
        background-color: transparent;
      }
    }
  }

  .content {
    border: 1px solid $color-border-main-light;
    border-radius: 4px;
  }

  /* stylelint-disable selector-max-specificity, max-nesting-depth */
  .card {
    font-size: 12px;
    position: relative;
    border-bottom-right-radius: $border-bottom-radius;
    border-bottom-left-radius: $border-bottom-radius;
    border: 1px solid $color-border-main-light;
    border-top: none;
    background-color: $color-bg-light;
    flex: 1 0 auto;
    display: flex;
    padding: 10px;

    flex-direction: column;
    box-sizing: content-box;
    transition: box-shadow 0.2s;
    will-change: box-shadow;

    &:hover {
      box-shadow: $card-shadow;
    }

    &.is-checked {
      border-top: 3px solid $color-border-primary;
      border-top-right-radius: $border-top-radius;
      border-top-left-radius: $border-top-radius;
      border: {
        width: 3px;
        color: $color-border-primary;
      }

      padding: 11px 8px 8px; // Compensating for border width changes
    }

    &.has-suggestion-higher {
      .dropdown-option-label.is-proposed {
        color: $color-text-primary-highlight;
        font-weight: 700;
        border-radius: 4px;
        background-color: $color-bg-primary-dimmed;
      }
      .dropdown-option.is-proposed:hover {
        .dropdown-option-label.is-proposed {
          background-color: $color-bg-primary-light;
        }
      }
    }

    &.has-suggestion-lower {
      .dropdown-option-label.is-proposed {
        color: $color-text-secondary;
        font-weight: 700;
        border-radius: 4px;
        background-color: $base-serenade;
      }
    }

    &.has-fixed-state {
      background-color: $color-bg-primary-dimmed;

      .dropdown {
        border: 1px solid $color-bg-primary-dimmed;

        &:hover {
          background-color: $color-bg-main-dimmed;
          border: 1px solid $color-border-main-light;
          border-radius: 4px;
        }
      }

      .trigger {
        border-bottom-color: $color-text-main-lighter;
      }
    }
  }

  .checkbox {
    position: absolute;
    z-index: 2; // To always show in front of overlay
    top: -14px;
    right: -8px;
  }

  .trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;

    &.disabled {
      cursor: default;
    }
  }

  .dropdown {
    flex: 1;
    color: $color-text-main;
    border: 1px solid $color-border-light;

    &.is-selected,
    &:not(.disabled):hover {
      background-color: $color-bg-main-dimmed;
      border: 1px solid $color-border-main-light;
      border-radius: 4px;
    }
  }

  .dropdown-options {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(var(--numberOfRows), 32px);
    column-gap: 8px;
    font-size: 14px;
    padding: 8px;

    border-radius: 4px 4px 0 0;
  }

  .dropdown-option {
    cursor: pointer;
    vertical-align: middle;
    border-radius: 4px;
    padding: 2px 21px 2px 6px;

    &:hover {
      background-color: $color-bg-primary-dimmed;
    }
  }

  .rate-suggestion {
    display: inline-block;
    width: 16px;
    height: 16px;
  }

  .dropdown-option-label {
    cursor: pointer;
    width: max-content;
    transition: background-color 0.2s;
    height: 28px;
    line-height: 28px;
    padding: 0 6px;
    border-radius: 4px;

    &.raised-price {
      color: $color-text-primary-highlight;
      font-weight: 700;
      border-radius: 4px;
      background-color: $color-bg-primary-dimmed;
    }

    &.lowered-price {
      color: $color-text-secondary;
      font-weight: 700;
      border-radius: 4px;
      background-color: $base-serenade;
    }
  }

  .price-level-wrapper {
    display: flex;
    align-items: center;
  }

  .raised {
    .dropdown .trigger {
      font-weight: bold;
      color: $color-text-primary;
    }
  }

  .lowered {
    .dropdown .trigger {
      font-weight: bold;
      color: $color-text-secondary;
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
    color: $color-text-main;

    &.state-text-inactive {
      color: $color-text-main-lighter;
    }
  }

  .state-switch-wrapper {
    margin-left: auto;
    padding-right: 5px;
  }

  .is-signal-opened {
    .state-text {
      font-weight: bold;
      color: $color-text-success;
    }
  }

  .is-signal-stopped {
    .state-text {
      font-weight: bold;
      color: $color-text-warning;
    }
  }

  .overlay {
    @include stretch(absolute, -1px);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba($color-bg-overlay, 0.6);
  }

  .overlay-logo {
    @include circle(36px);
    @include flex-center;

    background-color: $color-bg-light;
  }

  .price-level {
    padding: 5px;
    color: $color-text-main-lighter;
  }

  .footer {
    display: flex;
    align-items: center;
    height: 32px;
    background-color: $color-bg-main-dimmed;
    font-size: 12px;
    color: $color-text-main-light;
    padding: 0 20px;
    border-radius: 0 0 4px 4px;

    .price-container {
      cursor: default;
      min-width: max-content;
    }

    .price {
      display: inline-block;
      font-weight: 700;
      margin-left: 3px;

      &:first-child {
        margin-right: 32px;
      }
    }
  }

  .arrow {
    position: relative;
    top: 1px;
  }

  /* stylelint-enable selector-max-specificity, max-nesting-depth */
</style>
