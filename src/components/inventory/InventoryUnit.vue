<template>
  <div :class="$style.wrapper">
    <div
      :class="[
        $style.card,
        unitClasses,
        suggestionClasses,
        chosenPsClass,
        checkedClass,
        updatedSignalClass
      ]"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
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
        :theme="['small', 'white']"
        :class="$style.checkbox"
        :checked="unit.checked"
        @checked:update="onCheck"
      />
      <div v-if="shouldShowAvailabilityControls" :class="$style.stateWrapper">
        <img
          :class="$style.inventorySuggestion"
          :src="images.normal[inventoryStopSignalSuggestionImageType]"
          :srcset="
            `${images.normal[inventoryStopSignalSuggestionImageType]} 1x,
            ${images.retina[inventoryStopSignalSuggestionImageType]} 2x`
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
          :class="$style.inventorySuggestion"
          :src="images.normal[inventoryStopSignalSuggestionImageType]"
          :srcset="
            `${images.normal[inventoryStopSignalSuggestionImageType]} 1x,
            ${images.retina[inventoryStopSignalSuggestionImageType]} 2x`
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
        <span :class="$style.unitInfo"
          >OVB: {{ unit.noOfOverbookedUnits }}, SS:
          {{ unit.noOfFreeUnits }}</span
        >
      </div>
      <div :class="$style.psWrapper">
        <img
          :class="$style.inventorySuggestion"
          :src="psSuggestionImage"
          :srcset="`${psSuggestionImage} 1x, ${psRetinaSuggestionImage} 2x`"
        />
        <span :class="$style.psLabel">PS</span>
        <basic-dropdown
          v-if="!this.unit.isPlacedUnitsAuto && placedUnitsControls"
          :class="$style.dropdown"
          :isOpen="isDropdownOpen"
          @dropdown:open="openDropdown"
          @dropdown:close="closeDropdown"
        >
          <template #trigger>
            <div :class="$style.trigger">
              <span
                :class="{ [$style.placeholder]: dropdownPsLevel === null }"
                >{{
                  dropdownPsLevel === null ? 'Set unit' : dropdownPsLevel
                }}</span
              >
              <div :class="$style.arrow">
                <ArrowDown :rotated="isDropdownOpen" />
              </div>
            </div>
          </template>
          <div :class="$style.dropdownOptions">
            <div
              v-for="psLevel in allowedPlacedUnits"
              :key="psLevel"
              :class="$style.dropdownOption"
              @click="onDropdownClick(psLevel)"
            >
              <div
                :class="[
                  { [$style.isProposed]: isProposedPsLevel(psLevel) },
                  $style.dropdownOptionLabel
                ]"
              >
                {{ psLevel }}
              </div>
            </div>
          </div>
        </basic-dropdown>
        <div v-else v-html="dropdownPsLevel" :class="$style.psLevel"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import CheckboxField from 'components/core/Checkbox';
  import inventoryAutopilot from 'autopilot.png';
  import inventoryAutopilotRetina from 'autopilot@2x.png';
  import inventoryAutopilotColored from 'autopilot-colored.png';
  import inventoryAutopilotColoredRetina from 'autopilot-colored@2x.png';
  import inventoryFixed from 'fixed.png';
  import inventoryFixedRetina from 'fixed@2x.png';
  import inventoryFixedTransparent from 'fixed-transparent.png';
  import inventoryFixedTransparentRetina from 'fixed-transparent@2x.png';
  import inventoryDefault from 'rate-default.png';
  import inventoryDefaultRetina from 'rate-default@2x.png';
  import psUp from 'rate-up.png';
  import psUpRetina from 'rate-up@2x.png';
  import psDown from 'rate-down.png';
  import psDownRetina from 'rate-down@2x.png';
  import inventoryOpen from 'rate-open.png';
  import inventoryOpenRetina from 'rate-open@2x.png';
  import inventoryStop from 'rate-stop.png';
  import inventoryStopRetina from 'rate-stop@2x.png';

  import BasicDropdown from 'components/core/BasicDropdown';
  import AppSwitch from 'components/core/AppSwitch';

  import { channels } from 'enums/channels';
  import unitModes from 'enums/unit-modes';
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

      allowedPlacedUnits: {
        type: Array,
        required: true
      },

      placedUnitsControls: {
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
      newNoOfPlacedUnits: {
        get() {
          return this.unit.newNoOfPlacedUnits;
        },

        set(value) {
          this.$emit('unit:update', {
            unitID: this.unit.id,
            value: {
              newNoOfPlacedUnits: value,
              accepted: false
            }
          });
        }
      },

      dropdownPsLevel() {
        if (this.unit.isNoOfPlacedUnitsDirty) {
          return this.newNoOfPlacedUnits;
        }

        return this.unit.currentNoOfPlacedUnits;
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
        if (!this.unit.currentNoOfPlacedUnits || this.shouldRaiseNewPs) {
          return this.$style.hasSuggestionHigher;
        } else if (this.shouldLowerNewPs) {
          return this.$style.hasSuggestionLower;
        }
        return '';
      },

      unitClasses() {
        return {
          [this.$style.hasSuggestion]: this.unit.hasSuggestion,
          [this.$style.isActive]: this.unit.isActive,
          [this.$style.isStopped]: this.unit.isStopped,
          [this.$style.isAccepted]: this.unit.isAccepted,
          [this.$style.isCurrentActive]: !this.unit.currentStopSignal,
          [this.$style.isCurrentStopped]: this.unit.currentStopSignal,
          [this.$style.hasFixedState]: this.unit.hasFixedState
        };
      },

      checkedClass() {
        return this.unit.checked ? this.$style.isChecked : '';
      },

      chosenPsClass() {
        if (this.isRaised) {
          return this.$style.raised;
        } else if (this.isLowered) {
          return this.$style.lowered;
        }
        return '';
      },

      isSwitchActive() {
        return !this.unit.newStopSignal;
      },

      isSignalUpdated() {
        return this.unit.newStopSignal !== this.unit.currentStopSignal;
      },

      isSaved() {
        return this.savedUnits.some(unit => unit.id === this.unit.id);
      },

      isRaised() {
        return this.unit.newNoOfPlacedUnits > this.unit.currentNoOfPlacedUnits;
      },

      isLowered() {
        return this.unit.newNoOfPlacedUnits < this.unit.currentNoOfPlacedUnits;
      },

      isRaisedToSuggestion() {
        return (
          this.shouldRaiseNewPs &&
          this.unit.newNoOfPlacedUnits === this.unit.noOfPlacedUnits
        );
      },

      shouldRaiseNewPs() {
        return this.unit.noOfPlacedUnits > this.unit.newNoOfPlacedUnits;
      },

      shouldLowerNewPs() {
        return this.unit.noOfPlacedUnits < this.unit.newNoOfPlacedUnits;
      },

      hasOverlay() {
        return (this.isSaved || this.unit.accepted) && !this.isMouseOver;
      },

      isCheckboxVisible() {
        return this.isMouseOver || this.unit.checked;
      },

      psSuggestionImageType() {
        if (this.unit.newPlacedUnitsMode === unitModes.FIXED) {
          return this.unit.placedUnitsMode === unitModes.FIXED
            ? 'inventoryFixed'
            : 'inventoryFixedTransparent';
        } else if (this.unit.newPlacedUnitsMode === unitModes.AUTO) {
          return this.unit.placedUnitsMode === unitModes.AUTO
            ? 'inventoryAutopilot'
            : 'inventoryAutopilotColored';
        } else if (this.unit.newNoOfPlacedUnits !== this.unit.noOfPlacedUnits) {
          return this.shouldRaiseNewPs || isNaN(this.unit.newNoOfPlacedUnits)
            ? 'psUp'
            : 'psDown';
        }

        return 'inventoryDefault';
      },

      inventoryStopSignalSuggestionImageType() {
        if (this.unit.newStopSignalMode === unitModes.FIXED) {
          return this.unit.stopSignalMode === unitModes.FIXED
            ? 'inventoryFixed'
            : 'inventoryFixedTransparent';
        } else if (this.unit.newStopSignalMode === unitModes.AUTO) {
          return this.unit.stopSignalMode === unitModes.AUTO
            ? 'inventoryAutopilot'
            : 'inventoryAutopilotColored';
        } else if (this.unit.currentStopSignal !== this.unit.stopSignal) {
          return this.unit.stopSignal ? 'inventoryStop' : 'inventoryOpen';
        }

        return 'inventoryDefault';
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

      psSuggestionImage() {
        return this.placedUnitsControls
          ? this.images.normal[this.psSuggestionImageType]
          : this.images.normal.inventoryDefault;
      },

      psRetinaSuggestionImage() {
        return this.placedUnitsControls
          ? this.images.retina[this.psSuggestionImageType]
          : this.images.retina.inventoryDefault;
      }
    },
    methods: {
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

      onMouseOver() {
        this.isMouseOver = true;
      },

      onMouseOut() {
        this.isMouseOver = false;
      },

      onDropdownClick(value) {
        this.$emit('unit:update', {
          unit: this.unit,
          value: {
            newNoOfPlacedUnits: value
          }
        });

        this.isDropdownOpen = false;
      },

      openDropdown() {
        this.isDropdownOpen = true;
      },

      closeDropdown() {
        this.isDropdownOpen = false;
      },

      isProposedPsLevel(psLevel) {
        return psLevel === this.unit.noOfPlacedUnits;
      }
    },
    data() {
      return {
        isMouseOver: false,
        isDropdownOpen: false,
        images: {
          normal: {
            inventoryAutopilot,
            inventoryAutopilotColored,
            inventoryFixed,
            inventoryFixedTransparent,
            inventoryDefault,
            psUp,
            psDown,
            inventoryOpen,
            inventoryStop
          },
          retina: {
            inventoryAutopilotRetina,
            inventoryAutopilotColored: inventoryAutopilotColoredRetina,
            inventoryFixed: inventoryFixedRetina,
            inventoryFixedTransparent: inventoryFixedTransparentRetina,
            inventoryDefault: inventoryDefaultRetina,
            psUp: psUpRetina,
            psDown: psDownRetina,
            inventoryOpen: inventoryOpenRetina,
            inventoryStop: inventoryStopRetina
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

  /* stylelint-disable selector-max-specificity, max-nesting-depth */
  .card {
    font-size: 12px;
    position: relative;
    border-radius: $base-border-radius;
    border: 1px solid $color-border-main-light;
    border-top-width: 2px;
    margin: 0 6px;
    background-color: $color-bg-light;
    flex: 1 0 auto;
    display: flex;
    padding: 10px;
    flex-direction: column;
    transition: box-shadow 0.2s;
    will-change: box-shadow;

    &:hover {
      box-shadow: $card-shadow;
    }

    &.is-active {
      border-top-color: $color-border-success;
    }

    &.is-stopped {
      border-top-color: $color-border-warning;
    }

    &.is-checked {
      border: {
        width: 3px;
        color: $color-border-primary;
      }

      padding: 9px 8px 8px; // Compensating for border width changes
    }

    &.has-suggestion-higher {
      .dropdown-option-label.is-proposed {
        color: $color-text-primary;
      }
    }

    &.has-suggestion-lower {
      .dropdown-option-label.is-proposed {
        color: $color-text-warning;
      }
    }

    &.has-fixed-state {
      background-color: $color-bg-primary-dimmed;

      .trigger {
        border-bottom-color: $color-text-main-lighter;
      }
    }
  }

  .checkbox {
    position: absolute;
    z-index: 2; // To always show in front of overlay
    top: -6px;
    right: -6px;
  }

  .trigger {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .arrow {
    padding: 4px;
  }

  .dropdown {
    flex: 1;
    color: $color-text-main;
  }

  .dropdown-options {
    font-size: 14px;
    overflow: auto;
    max-height: 136px;
  }

  .inventory-suggestion {
    display: inline-block;
    width: 16px;
    height: 16px;
  }

  .dropdown-option-label {
    padding: 5px;
    transition: background-color 0.2s;

    &:hover {
      background-color: $color-bg-primary-dimmed;
    }
  }

  .ps-wrapper {
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
  }

  .state-text {
    padding-left: 5px;
    text-transform: uppercase;
    color: $color-text-main;

    &.state-text-inactive {
      color: $color-text-main-lighter;
    }
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

  .ps-label {
    margin-left: 5px;
    margin-right: 10px;
    color: $color-text-main;
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

  .placeholder {
    color: $color-text-main-lighter;
  }

  /* stylelint-enable selector-max-specificity, max-nesting-depth */
</style>
