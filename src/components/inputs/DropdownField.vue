<template>
  <basic-dropdown
    :disabled="false"
    :isOpen="dropdownOpen"
    :offset="offset"
    :customContentClass="customContentClass"
    @dropdown:close="close"
    @dropdown:open="open"
  >
    <template slot="trigger">
      <label-wrapper :label="label">
        <material-input
          v-bind="$attrs"
          v-on="$listeners"
          :isCustom="isCustom"
          :isInvalid="isInvalid && !dropdownOpen"
          @enter:keypress="searchSubmit"
        >
          <template v-if="isCustom" v-slot:title>
            <div :class="$style.title">
              <slot name="title"></slot>
            </div>
          </template>
          <template v-if="isSelect" v-slot:icon>
            <span :class="[$style.arrow, dropdownOpen && $style.isReversed]" />
          </template>
          <template v-else v-slot:icon>
            <slot name="icon" />
          </template>
        </material-input>
      </label-wrapper>
    </template>
    <slot />
  </basic-dropdown>
</template>

<script>
  import { DROPDOWN_GLOBAL_CLOSE } from 'constants/events.js';

  import MaterialInput from 'components/inputs/MaterialInput';
  import LabelWrapper from 'components/inputs/LabelWrapper';
  import BasicDropdown from 'components/core/BasicDropdown';

  export default {
    name: 'DropdownField',
    inheritAttrs: false,
    components: {
      MaterialInput,
      LabelWrapper,
      BasicDropdown
    },
    model: {
      event: 'update'
    },
    props: {
      customContentClass: {
        type: String,
        default: ''
      },
      isSelect: {
        type: Boolean,
        default: false
      },
      isCustom: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: ''
      },
      isInvalid: {
        type: Boolean,
        default: false
      },
      offset: {
        type: Object,
        default() {
          return { horizontal: 0, vertical: -15 };
        }
      }
    },
    data() {
      return {
        dropdownOpen: false
      };
    },
    methods: {
      searchSubmit() {
        this.$emit('search:submit');
      },
      close() {
        this.$emit('dropdown:close');
        this.dropdownOpen = false;
      },
      open() {
        this.$emit('dropdown:open');
        this.dropdownOpen = true;
      }
    },
    mounted() {
      window.addEventListener(DROPDOWN_GLOBAL_CLOSE, this.close);
    },

    beforeDestroy() {
      window.removeEventListener(DROPDOWN_GLOBAL_CLOSE, this.close);
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .title {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .arrow {
    position: relative;
    width: 24px;
    height: 24px;

    &::after {
      position: absolute;
      content: '';
      display: block;
      width: 0;
      height: 0;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-style: solid;
      border-width: 5px 5px 0 5px;
      border-color: $color-border-main-darker transparent transparent
        transparent;
    }

    &.is-reversed::after {
      transform: translate(-50%, -50%) rotate(180deg);
    }
  }
</style>
