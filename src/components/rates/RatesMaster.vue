<template>
  <div :class="$style.wrapper">
    <div :class="$style.card">
      <header :class="$style.header">
        <div :class="$style.name">
          {{ channelName }}
        </div>
        <app-switch
          v-if="hasAvailabilityControls"
          :isActive="isSwitchOpen"
          @switch:activate="toggleStopSignal(false)"
          @switch:deactivate="toggleStopSignal(true)"
        />
      </header>
      <basic-dropdown
        v-if="priceLevelControls"
        :class="$style.dropdown"
        :isOpen="isDropdownOpen"
        @dropdown:open="openDropdown"
        @dropdown:close="closeDropdown"
      >
        <template #trigger>
          <div :class="$style.trigger">
            <span>{{
              dropdownPriceLevel !== null ? dropdownPriceLevel : 'Current'
            }}</span>
            <ArrowDown :rotated="isDropdownOpen" />
          </div>
        </template>
        <div :class="$style.dropdownOptions">
          <div
            v-for="priceLevel in allowedPriceLevelsWithCurrent"
            :key="priceLevel"
            :class="$style.dropdownOption"
            @click="onDropdownClick(priceLevel)"
          >
            <div :class="$style.dropdownOptionLabel">
              {{ priceLevel }}
            </div>
          </div>
        </div>
      </basic-dropdown>
    </div>
  </div>
</template>

<script>
  import AppSwitch from 'components/core/AppSwitch';
  import BasicDropdown from 'components/core/BasicDropdown';

  import unitChannels, { channels } from 'enums/channels';
  import ArrowDown from '@/components/icons/ArrowDown';

  export default {
    components: {
      ArrowDown,
      AppSwitch,
      BasicDropdown
    },
    props: {
      channel: {
        type: Object,
        required: true
      },

      allAccepted: {
        type: Boolean,
        required: true
      },

      units: {
        type: Array,
        required: true
      },

      allowedPriceLevels: {
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
    computed: {
      channelName() {
        const channel = unitChannels.find(({ id }) => id === this.channel.id);
        return channel ? channel.name : '';
      },

      dropdownPriceLevel() {
        return this.priceLevel;
      },

      hasAvailabilityControls() {
        return (
          this.altAvailabilityControls || this.channel.id !== channels.ALT.id
        );
      },

      allowedPriceLevelsWithCurrent() {
        return ['Current', ...this.allowedPriceLevels];
      }
    },
    watch: {
      priceLevel() {
        this.isAccepted = false;
      },

      allAccepted(newValue) {
        if (!newValue) {
          this.isAccepted = false;
        }
      }
    },
    methods: {
      openDropdown() {
        this.isDropdownOpen = true;
      },

      closeDropdown() {
        this.isDropdownOpen = false;
      },

      onDropdownClick(value) {
        this.priceLevel = value;
        this.isDropdownOpen = false;
        this.$emit('master:update', {
          newPriceLevel: value
        });
      },

      toggleStopSignal(value) {
        this.isSwitchOpen = !value;
        this.$emit('master:update', {
          newStopSignal: value
        });
      }
    },
    data() {
      return {
        priceLevel: null,
        isAccepted: false,
        isDropdownOpen: false,
        isSwitchOpen: true
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .card {
    font-size: 12px;
    border-radius: $base-border-radius;
    margin: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: $color-bg-primary-dimmed;
    flex: 1 0 auto;
    border: 1px solid $color-border-primary;
    padding: 13px 8px 10px 16px;
  }

  .wrapper {
    display: flex;
    width: 160px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  .name {
    color: $color-text-primary;
    font-weight: bold;
    text-transform: uppercase;
  }

  .dropdown {
    color: $color-text-primary;
  }

  .dropdown-options {
    font-size: 14px;
    overflow: auto;
    width: 100px;
    max-height: 136px;
    color: $color-text-main;
  }

  .dropdown-option-label {
    padding: 5px;
    transition: background-color 0.2s;

    &:hover {
      background-color: $color-bg-primary-dimmed;
    }
  }

  .trigger {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
