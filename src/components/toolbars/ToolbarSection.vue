<template>
  <section :class="$style.section">
    <span :class="$style.label">{{ switcherLabel }}</span>
    <div :class="$style.row">
      <multi-switch
        :switcherModes="switcherModes"
        :currentSwitcherMode="currentSwitcherMode"
        :isInverted="true"
        @change="onMultiSwitchChange"
      >
        <template v-slot="{ switcherMode }">{{
          capitalize(switcherMode[0])
        }}</template>
      </multi-switch>
      <basic-dropdown
        :class="$style.dropdown"
        :isOpen="isDropdownOpen"
        :offset="dropdownOffset"
        :disabled="isDropdownDisabled"
        @dropdown:open="onDropdownOpen"
        @dropdown:close="onDropdownClose"
      >
        <div slot="trigger" :class="$style.trigger">
          <span :class="$style.triggerText">{{ dropdownValue }}</span>
          <ArrowDown v-if="!isDropdownDisabled" :rotated="isDropdownOpen" />
        </div>
        <div :class="$style.dropdownOptions">
          <div
            v-for="dropdownOption in dropdownOptions"
            :key="dropdownOption"
            :class="$style.dropdownOption"
            @click="onDropdownClick(dropdownOption)"
          >
            <div :class="dropdownOptionClass">
              <span :class="$style.dropdownOptionText">{{
                dropdownOption
              }}</span>
            </div>
          </div>
        </div>
      </basic-dropdown>
    </div>
  </section>
</template>

<script>
  import { capitalize } from 'utils/string';

  import BasicDropdown from 'components/core/BasicDropdown';
  import MultiSwitch from 'components/core/MultiSwitch';
  import ArrowDown from '@/components/icons/ArrowDown';

  export default {
    components: {
      ArrowDown,
      BasicDropdown,
      MultiSwitch
    },
    props: {
      switcherLabel: {
        type: String,
        default: ''
      },
      switcherModes: {
        type: Array,
        required: true
      },
      currentSwitcherMode: {
        required: true
      },
      isDropdownOpen: {
        type: Boolean,
        default: false
      },
      isDropdownDisabled: {
        type: Boolean,
        default: false
      },
      dropdownOffset: {
        type: Object,
        default: null
      },
      dropdownValue: {
        type: [String, Number],
        default: 'Current'
      },
      dropdownOptions: {
        type: [Array, Object],
        default: () => []
      }
    },
    computed: {
      dropdownOptionClass() {
        return [
          {
            [this.$style.isActive]: this.dropdownValue === this.dropdownOption
          },
          this.$style.dropdownOptionLabel
        ];
      }
    },
    methods: {
      capitalize,

      onMultiSwitchChange(value) {
        this.$emit('multiswitch:change', value);
      },

      onDropdownOpen() {
        this.$emit('dropdown:open');
      },

      onDropdownClose() {
        this.$emit('dropdown:close');
      },

      onDropdownClick(value) {
        this.$emit('dropdown:click', value);
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .section {
    font-size: 12px;
  }

  .label {
    display: block;
    color: $color-text-light;
    text-transform: none;
    padding: 8px 0;
  }

  .row {
    display: flex;
  }

  .dropdown {
    min-width: 112px;
    margin-left: 26px;
  }

  .trigger {
    font-weight: bold;
    min-height: 28px;
    padding: 4px 8px 6px;
    background-color: $color-bg-primary-mid;
    border-radius: $base-border-radius;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: $color-text-light;
  }

  .dropdown-options {
    width: 125px;
    max-height: 176px;

    &.amount-dropdown-options {
      height: 170px;
      overflow: auto;
    }
  }

  .dropdown-option {
    &-text {
      padding: 6px 0;
    }
    padding: 6px 16px;
    border-radius: $base-border-radius;
    min-height: 27px; // To cover for empty option

    &:first-child {
      padding-top: 14px;
    }

    &:last-child {
      padding-bottom: 14px;
    }

    &:hover,
    &:focus,
    &:active {
      background-color: $color-bg-primary-dimmed;
    }
  }

  .dropdown-option-label {
    font-size: 14px;
    color: $color-text-main;

    &.is-active {
      color: $color-text-primary;
    }
  }
</style>
