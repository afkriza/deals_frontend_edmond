<template>
  <div :class="[$style.filter, { [$style.active]: isDropdownOpen }]">
    <BasicDropdown
      align="right"
      :custom-content-class="$style.dropdownContent"
      :disabled="disabled"
      :is-open="isDropdownOpen"
      :offset="{ horizontal: 16, vertical: 13 }"
      @dropdown:open="openDropdown"
      @dropdown:close="closeDropdown"
    >
      <div slot="trigger" :class="$style.trigger">
        <div :class="$style.name">
          <span>View</span>
          <IconArrowDown :class="$style.arrow" :rotated="isDropdownOpen" />
        </div>
      </div>

      <div :class="$style.dropdown">
        <div :class="$style.filterSection">
          <h5 :class="$style.filterSectionName">Rates</h5>
          <FilterListItemSingleSelect
            title="All"
            :active="isAllUnitScope"
            @update:active="changeRateType(unitScopes.ALL)"
          />
          <FilterListItemSingleSelect
            title="Suggestions"
            :active="isSuggestionsUnitScope"
            @update:active="changeRateType(unitScopes.SUGGESTIONS)"
          />
        </div>

        <div :class="$style.filterSection">
          <h5 :class="$style.filterSectionName">Channels</h5>
          <FilterListItemMultiSelect
            v-for="channel in unitChannels"
            :key="channel.id"
            :title="channel.name"
            :active="visibleChannels.includes(channel.id)"
            @update:active="changeVisibleChannel($event, channel.id)"
          />
        </div>
      </div>
    </BasicDropdown>
  </div>
</template>

<script>
  import BasicDropdown from 'components/core/BasicDropdown';

  import unitScopes from 'enums/unit-scopes';
  import unitChannels from 'enums/channels';
  import { nameComparator } from 'utils/sort';

  import IconArrowDown from '@/components/icons/ArrowDown';
  import FilterListItemSingleSelect from '@/components/filters/FilterListItemSingleSelect';
  import FilterListItemMultiSelect from '@/components/filters/FilterListItemMultiSelect';

  export default {
    components: {
      FilterListItemMultiSelect,
      FilterListItemSingleSelect,
      BasicDropdown,
      IconArrowDown
    },

    props: {
      disabled: {
        type: Boolean,
        required: true
      },
      selectedUnitScope: {
        type: String,
        required: true
      },
      visibleChannels: {
        type: Array,
        required: true
      }
    },

    data() {
      return {
        channelsValue: null,
        isDropdownOpen: false,
        unitScopes,
        unitChannels: unitChannels.sort(nameComparator)
      };
    },

    computed: {
      isAllUnitScope() {
        return this.selectedUnitScope === this.unitScopes.ALL;
      },

      isSuggestionsUnitScope() {
        return this.selectedUnitScope === this.unitScopes.SUGGESTIONS;
      }
    },

    methods: {
      changeRateType(newTypeID) {
        this.$emit('unit-scope:change', newTypeID);
      },

      changeVisibleChannel(value, channelID) {
        this.$emit('visible-channel:change', { value, channelID });
      },

      openDropdown() {
        this.isDropdownOpen = true;
      },

      closeDropdown() {
        this.isDropdownOpen = false;
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .filter {
    display: flex;
    align-items: center;
    border-radius: 6px;
    background-color: $color-bg-primary-mid;
    color: $color-text-light;

    transition: color, background-color 0.2s linear;

    &:hover {
      @include hard-shadow($color-border-main-dark, 2px);
    }

    &.active {
      background-color: $color-bg-light;
      color: $color-text-primary;

      .arrow {
        color: $color-text-primary;
      }
    }
  }

  .filter-section:nth-child(2) {
    margin-top: 24px;
  }

  .filter-section-name {
    margin: 0 16px 8px;
    text-transform: uppercase;
    color: $color-text-main-lighter;
  }

  .trigger {
    display: flex;
    align-items: center;
    padding: 0 15px;
    height: 32px;
  }

  .trigger-text {
    margin: 0 8px;
  }

  .trigger-icon {
    display: inline-block;
    vertical-align: middle;
  }

  .name {
    font-size: 16px;
    font-weight: bold;

    display: flex;
    align-items: center;
  }

  .arrow {
    margin-left: 5px;

    color: $color-text-main-lighter;
  }

  .value {
    margin-top: 3px;
    text-transform: uppercase;
  }

  .dropdown {
    padding: 16px 0 8px;
    color: $color-text-light;
    background-color: $color-bg-primary-darker;
  }

  .dropdown-content {
    min-width: 0;
    width: 155px;
    border-radius: 6px;

    /* stylelint-disable declaration-no-important */
    background-color: $color-bg-primary-mid !important; // To make sure it overrides color

    /* stylelint-enable declaration-no-important */

    overflow: hidden;
  }

  .checkbox-label {
    color: $color-text-light;
  }
</style>
