<template>
  <div :class="[$style.variable, { [$style.placed]: isPlaced }, 'variable']">
    <template v-if="isInstance">
      <div :class="$style.wrapper">
        <VPopover
          :open.sync="open"
          :popover-inner-class="$style.popover"
          placement="bottom-end"
          :container="false"
        >
          <div :class="$style.trigger">
            <component :is="variable.operatorIcon" />
            <ArrowDown :rotated="open" />
          </div>
          <template #popover>
            <DropdownList
              v-close-popover
              :items="dropdownOptions"
              @select="onDropdownOptionClick"
            >
              <template #item="{ item }">
                <div
                  :class="[
                    $style.dropdownItem,
                    { [$style.selected]: variable.operator === item.id }
                  ]"
                >
                  <component :is="item.icon" />
                  <span>{{ item.name }}</span>
                </div>
              </template>
            </DropdownList>
          </template>
        </VPopover>
      </div>
    </template>
    <span :class="$style.name">{{ variable.name }}</span>
  </div>
</template>

<script>
  import { VPopover, VClosePopover } from 'v-tooltip';
  import BasicDropdown from 'components/core/BasicDropdown';

  import operatorsMixin from 'mixins/widget-operators';
  import VariableModel from 'components/analytics/models/Variable';
  import VariableInstanceModel from 'components/analytics/models/VariableInstance';

  import { SUM, MIN, MAX, AVG } from 'constants/widget-operators';
  import ArrowDown from '@/components/icons/ArrowDown';
  import DropdownList from '@/components/core/DropdownList';

  export default {
    name: 'Variable',
    components: {
      DropdownList,
      ArrowDown,
      BasicDropdown,
      VPopover
    },

    directives: {
      closePopover: VClosePopover
    },
    mixins: [operatorsMixin],

    props: {
      variable: {
        type: [VariableModel, VariableInstanceModel],
        required: true
      },

      isPlaced: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        open: false,
        dropdownOptions: [
          {
            id: SUM,
            icon: 'Sum',
            name: 'Sum'
          },
          {
            id: AVG,
            icon: 'Avg',
            name: 'Average'
          },
          {
            id: MIN,
            icon: 'Min',
            name: 'Minimum'
          },
          {
            id: MAX,
            icon: 'Max',
            name: 'Maximum'
          }
        ]
      };
    },

    computed: {
      isInstance() {
        return this.variable instanceof VariableInstanceModel;
      }
    },

    methods: {
      onDropdownOptionClick({ id }) {
        this.variable.operator = id;
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .variable {
    display: flex;
    align-items: center;

    height: 48px;
    border-radius: 4px;

    .name {
      font-weight: bold;
      color: $color-text-primary;
      margin: 0 16px;
    }

    &:hover {
      background-color: $color-bg-main-dimmed;
    }
  }

  .wrapper {
    @include flex-center($flex-direction: column);

    height: 100%;
    border-right: 1px solid #e3e4e5;

    padding: 12px 0;
  }

  .placed {
    border: 1px solid $color-border-main-light;

    &:hover {
      background-color: $color-bg-main-dimmed;
    }
  }

  .trigger {
    @include flex-center;
    color: $color-text-primary;

    padding: 0 16px;
  }

  .dropdown-item {
    display: flex;
    align-items: center;

    &.selected {
      color: $color-text-primary;
    }

    > * + * {
      margin-left: 8px;
    }
  }

  .popover {
    background-color: $color-bg-light;
    border-radius: 4px;
    padding: 8px 0;
    box-shadow: 0px 10px 26px rgba(0, 0, 0, 0.15);

    min-width: 224px;
  }
</style>
