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
        :src="images.normal[inventoryModeImage]"
        :srcset="`${images.normal[inventoryModeImage]} 1x, ${images.retina[inventoryModeImage]} 2x`"
      />
      <span v-if="unit.isAvailabilityModeDirty" :class="$style.iconWrapper">
        <!-- @svg("arrow-right") -->
        <img
          :class="$style.modeIcon"
          :src="images.normal[newInventoryModeImage]"
          :srcset="`${images.normal[newInventoryModeImage]} 1x, ${images.retina[newInventoryModeImage]} 2x`"
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
      {{ updatedStatus }}
    </CellItem>
    <CellItem upper>
      <img
        :class="$style.modeIcon"
        :src="images.normal[psModeImage]"
        :srcset="`${images.normal[psModeImage]} 1x, ${images.retina[psModeImage]} 2x`"
      />
      <span v-if="unit.isPlacedUnitsModeDirty" :class="$style.iconWrapper">
        <!-- @svg("arrow-right") -->
        <img
          :class="$style.modeIcon"
          :src="images.normal[newPsModeImage]"
          :srcset="`${images.normal[newPsModeImage]} 1x, ${images.retina[newPsModeImage]} 2x`"
        />
      </span>
    </CellItem>
    <CellItem bold active>{{ unit.currentNoOfPlacedUnits }}</CellItem>
    <CellItem bold>
      <div
        v-if="diff"
        :class="[
          {
            [$style.psDiffUp]: diff > 0,
            [$style.psDiffDown]: diff < 0
          },
          $style.psDiff
        ]"
      >
        <img
          :class="$style.arrow"
          :src="images.normal[arrowIcon]"
          :srcset="`${images.normal[arrowIcon]} 1x, ${images.retina[arrowIcon]} 2x`"
        />
        <span>{{ diff | formatChange }}</span>
      </div>
    </CellItem>
    <CellItem bold active>{{ unit.newNoOfPlacedUnits }}</CellItem>
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

  import inventoryFixed from 'fixed-big.png';
  import inventoryFixedRetina from 'fixed-big@2x.png';
  import inventoryFixedTransparent from 'fixed-transparent-big.png';
  import inventoryFixedTransparentRetina from 'fixed-transparent-big@2x.png';
  import inventoryAutopilot from 'autopilot-big.png';
  import inventoryAutopilotRetina from 'autopilot-big@2x.png';
  import inventoryAutopilotColored from 'autopilot-colored-big.png';
  import inventoryAutopilotColoredRetina from 'autopilot-colored-big@2x.png';
  import inventoryManual from 'manual-big.png';
  import inventoryManualRetina from 'manual-big@2x.png';
  import inventoryManualColored from 'manual-colored-big.png';
  import inventoryManualColoredRetina from 'manual-colored-big@2x.png';

  import psUp from 'rate-up-big.png';
  import psUpRetina from 'rate-up-big@2x.png';
  import psDown from 'rate-down-big.png';
  import psDownRetina from 'rate-down-big@2x.png';

  import CoreCheckbox from 'components/core/Checkbox';
  import ButtonFlat from 'components/buttons/ButtonFlat';
  import CellItem from './Cell';

  import channels from 'enums/channels';
  import { formatChange } from 'utils/format';

  export default {
    components: {
      CoreCheckbox,
      ButtonFlat,
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
        checkboxTheme,
        isDeleteShown: false,
        images: {
          normal: {
            psUp,
            psDown,
            fixed: inventoryFixed,
            fixedNew: inventoryFixedTransparent,
            auto: inventoryAutopilot,
            autoNew: inventoryAutopilotColored,
            manual: inventoryManual,
            manualNew: inventoryManualColored
          },
          retina: {
            psUp: psUpRetina,
            psDown: psDownRetina,
            fixed: inventoryFixedRetina,
            fixedNew: inventoryFixedTransparentRetina,
            auto: inventoryAutopilotRetina,
            autoNew: inventoryAutopilotColoredRetina,
            manual: inventoryManualRetina,
            manualNew: inventoryManualColoredRetina
          }
        }
      };
    },

    computed: {
      unit() {
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

      isUserUpdater() {
        return this.unit.newNoOfPlacedUnits !== this.unit.noOfPlacedUnits;
      },

      user() {
        return this.isUserUpdater ? this.currentUser.name : 'Edmond';
      },

      diff() {
        return this.unit.newNoOfPlacedUnits - this.unit.currentNoOfPlacedUnits;
      },

      arrowIcon() {
        return this.diff > 0 ? 'psUp' : 'psDown';
      },

      inventoryModeImage() {
        return this.unit.stopSignalMode;
      },

      newInventoryModeImage() {
        return `${this.unit.newStopSignalMode}New`;
      },

      psModeImage() {
        return this.unit.placedUnitsMode;
      },

      newPsModeImage() {
        return `${this.unit.newPlacedUnitsMode}New`;
      },

      updatedStatus() {
        return this.unit.updatedStatus ? this.unit.updatedStatus : '—';
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

  .ps-diff {
    display: flex;
  }

  .ps-diff-up {
    color: $color-text-primary;
  }

  .ps-diff-down {
    color: $color-secondary;
  }

  .icon-wrapper {
    display: inline-block;
    max-height: 24px;
  }
</style>
