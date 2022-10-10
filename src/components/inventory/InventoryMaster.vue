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
        v-if="placedUnitsControls"
        :class="$style.dropdown"
        :isOpen="isDropdownOpen"
        @dropdown:open="openDropdown"
        @dropdown:close="closeDropdown"
      >
        <template #trigger>
          <div :class="$style.trigger">
            <span>{{
              dropdownPsLevel !== null ? dropdownPsLevel : 'Current'
            }}</span>
            <ArrowDown :rotated="isDropdownOpen" />
          </div>
        </template>
        <div :class="$style.dropdownOptions">
          <div
            v-for="psLevel in allowedPlacedUnitsWithCurrent"
            :key="psLevel"
            :class="$style.dropdownOption"
            @click="onDropdownClick(psLevel)"
          >
            <div :class="$style.dropdownOptionLabel">
              {{ psLevel }}
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
    computed: {
      channelName() {
        const channel = unitChannels.find(({ id }) => id === this.channel.id);
        return channel ? channel.name : '';
      },

      dropdownPsLevel() {
        return this.psLevel;
      },

      hasAvailabilityControls() {
        return (
          this.altAvailabilityControls || this.channel.id !== channels.ALT.id
        );
      },

      allowedPlacedUnitsWithCurrent() {
        return ['Current', ...this.allowedPlacedUnits];
      }
    },
    watch: {
      placedUnits() {
        this.isAccepted = false;
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
        this.psLevel = value;
        this.isDropdownOpen = false;
        this.$emit('master:update', {
          newNoOfPlacedUnits: value
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
        placedUnits: '',
        psLevel: null,
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
    background-color: $color-bg-primary-dimmed;
    flex: 1 0 auto;
    justify-content: space-between;
    border: 1px solid $color-border-primary;
    padding: 13px 8px 16px 16px;
  }

  .wrapper {
    display: flex;
    width: 160px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 10px;
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
