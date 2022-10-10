<template>
  <action-toolbar
    :class="$style.toolbar"
    :isLoading="isLoading"
    :isDisabled="isDisabled"
    :primaryButtonText="primaryButtonText"
    :secondaryButtonText="secondaryButtonText"
    :secondaryButtonType="secondaryButtonType"
    @click:primary="onPrimaryButtonClick"
    @click:secondary="onSecondaryButtonClick"
  >
    <div :class="$style.content">
      <div :class="[$style.section, $style.inverted]">
        <span :class="[$style.label, $style.labelInverted]"
          >Linked channels</span
        >
        <div :class="$style.row">
          <choice-chip
            v-for="filterOption in filterOptions"
            :key="filterOption.id"
            :class="$style.chip"
            :label="filterOption.name"
            :value="selectedFilterOptions.includes(filterOption)"
            @input="toggleLinkChannel($event, filterOption.id)"
          />
        </div>
      </div>
      <toolbar-section
        :class="$style.section"
        :switcherLabel="primarySwitcherLabel"
        :switcherModes="switcherModes"
        :currentSwitcherMode="activePrimarySwitcherMode"
        :isDropdownOpen="currentOpenDropdown === 'primary'"
        :isDropdownDisabled="isPrimaryDropdownDisabled"
        :dropdownOffset="primaryDropdownOffset"
        :dropdownOptions="primaryDropdownOptions"
        :dropdownValue="primaryDropdownValue"
        @multiswitch:change="togglePrimarySwitcherMode"
        @dropdown:open="openDropdown('primary')"
        @dropdown:close="closeDropdown"
        @dropdown:click="onPrimaryDropdownSelect"
      />
      <toolbar-section
        v-if="showSecondarySection"
        :class="$style.section"
        :switcherLabel="secondarySwitcherLabel"
        :switcherModes="switcherModes"
        :currentSwitcherMode="activeSecondarySwitcherMode"
        :isDropdownOpen="currentOpenDropdown === 'secondary'"
        :isDropdownDisabled="isSecondaryDropdownDisabled"
        :dropdownOffset="secondaryDropdownOffset"
        :dropdownOptions="secondaryDropdownOptions"
        :dropdownValue="secondaryDropdownValue"
        @multiswitch:change="toggleSecondarySwitcherMode"
        @dropdown:open="openDropdown('secondary')"
        @dropdown:close="closeDropdown"
        @dropdown:click="onSecondaryDropdownSelect"
      />
    </div>
  </action-toolbar>
</template>

<script>
  import availabilities from 'enums/availabilities';
  import { channels } from 'enums/channels';

  import ActionToolbar from 'components/toolbars/ActionToolbar';
  import ToolbarSection from 'components/toolbars/ToolbarSection';
  import ChoiceChip from 'components/core/ChoiceChip';

  export default {
    extends: ActionToolbar,
    name: 'AppToolbar',
    components: {
      ActionToolbar,
      ChoiceChip,
      ToolbarSection
    },
    props: {
      showPrimarySection: {
        type: Boolean,
        default: true
      },
      showSecondarySection: {
        type: Boolean,
        default: true
      },
      filterOptions: {
        type: Array,
        default: null
      },
      selectedFilterOptions: {
        type: Array,
        default: null
      },
      switcherModes: {
        type: Array,
        default: null
      },
      activePrimarySwitcherMode: {
        type: String,
        default: ''
      },
      activeSecondarySwitcherMode: {
        type: String,
        default: ''
      },
      primarySwitcherLabel: {
        type: String,
        default: ''
      },
      secondarySwitcherLabel: {
        type: String,
        default: ''
      },
      isPrimaryDropdownDisabled: {
        type: Boolean,
        default: false
      },
      primaryDropdownOffset: {
        type: Object,
        default: null
      },
      primaryDropdownOptions: {
        type: [Array, Object],
        default: () => []
      },
      primaryDropdownValue: {
        type: [String, Number]
      },
      isSecondaryDropdownDisabled: {
        type: Boolean,
        default: false
      },
      secondaryDropdownOffset: {
        type: Object,
        default: null
      },
      secondaryDropdownOptions: {
        type: [Array, Object],
        default: () => []
      },
      secondaryDropdownValue: {
        type: [String, Number]
      }
    },
    methods: {
      toggleLinkChannel(value, channelID) {
        this.$emit('linkChannel:toggle', value, channelID);
      },

      togglePrimarySwitcherMode(value) {
        this.$emit('primarySwitcher:change', value);
      },

      toggleSecondarySwitcherMode(value) {
        this.$emit('secondarySwitcher:change', value);
      },

      openDropdown(dropdown) {
        this.currentOpenDropdown = dropdown;
      },

      closeDropdown() {
        this.currentOpenDropdown = '';
      },

      onDropdownClick(event, data) {
        this.closeDropdown();
        this.$emit(event, data);
      },

      onPrimaryDropdownSelect(value) {
        this.onDropdownClick('primaryDropdown:change', value);
      },

      onSecondaryDropdownSelect(value) {
        this.onDropdownClick('secondaryDropdown:change', value);
      }
    },

    data() {
      return {
        channels,
        selectedChannels: [channels.B2B, channels.IND],
        currentOpenDropdown: '',
        availabilitiesWithCurrent: { NONE: 'Current', ...availabilities }
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .toolbar {
    height: $smaller-action-footer-height;
  }

  .content {
    display: grid;
    grid-template-columns: repeat(3, minmax(290px, 312px)) auto;

    height: 100%;
    flex: 1;
  }

  .section {
    display: flex;
    flex-direction: column;
    padding-left: 10%;

    &:first-child {
      padding-left: 20%;
    }
  }

  .inverted {
    background-color: $color-bg-light;
  }

  .row {
    display: flex;
  }

  .label {
    color: $color-text-light;
    font-size: 12px;
    padding: 8px 0 6px 0;

    &-inverted {
      color: $color-text-main;
    }
  }

  .chip {
    margin-top: 4px;

    &:not(:last-child) {
      margin-right: 5px;
    }
  }
</style>
