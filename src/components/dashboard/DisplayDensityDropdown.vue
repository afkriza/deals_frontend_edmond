<template>
  <VPopover :open.sync="open" :popover-inner-class="$style.popover">
    <div :class="$style.trigger">
      <component :is="iconByDisplayDensity[activeDisplayDensity]" />
      <span :class="$style.density">{{ activeDisplayDensity }}</span>
      <ArrowDown :rotated="open" />
    </div>
    <template #popover>
      <div>
        <DropdownList :items="displayDensities" @select="onDisplayDensityClick">
          <template #item="{ item }">
            <div
              :class="[
                $style.dropdownItem,
                { [$style.selected]: activeDisplayDensity === item.id }
              ]"
            >
              <component :is="item.icon" />
              <span>{{ item.label }}</span>
            </div>
          </template>
        </DropdownList>
      </div>
    </template>
  </VPopover>
</template>

<script>
  import BasicDropdown from 'components/core/BasicDropdown';
  import { VPopover } from 'v-tooltip';

  import DisplayDensities from 'enums/table-display-densities';

  import IconCompact from '@/assets/images/icons/controls/ic-24-display-density-compact.svg';
  import IconRegular from '@/assets/images/icons/controls/ic-24-display-density-regular.svg';
  import IconComfortable from '@/assets/images/icons/controls/ic-24-display-density-comfortable.svg';
  import { capitalize, map } from 'lodash';
  import ArrowDown from '@/components/icons/ArrowDown';
  import DropdownList from '@/components/core/DropdownList';

  export default {
    components: {
      DropdownList,
      ArrowDown,
      BasicDropdown,
      IconCompact,
      IconRegular,
      IconComfortable,
      VPopover
    },

    props: {
      activeDisplayDensity: {
        type: String,
        default: DisplayDensities.DEFAULT
      }
    },

    data() {
      return {
        open: false
      };
    },

    computed: {
      iconByDisplayDensity() {
        return {
          [DisplayDensities.COMPACT]: IconCompact,
          [DisplayDensities.DEFAULT]: IconRegular,
          [DisplayDensities.COMFORTABLE]: IconComfortable
        };
      },

      displayDensities() {
        return map(DisplayDensities, value => ({
          id: value,
          icon: this.iconByDisplayDensity[value],
          label: capitalize(value)
        }));
      }
    },

    methods: {
      onDisplayDensityClick({ id }) {
        this.open = false;

        this.$emit('displayDensity:click', id);
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .trigger {
    @include flex-center;

    > * + * {
      margin-left: 8px;
    }
  }

  .popover {
    background-color: $color-bg-light;
    border-radius: 4px;
    padding: 8px 0;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  .density {
    font-size: 12px;
    line-height: 16px;
    text-transform: capitalize;
  }

  .dropdown-item {
    display: flex;
    align-items: center;

    padding-top: 12px;
    padding-bottom: 12px;

    &.selected {
      color: $color-text-primary;
    }
  }

  .dropdown-item > * + * {
    margin-left: 8px;
  }
</style>
