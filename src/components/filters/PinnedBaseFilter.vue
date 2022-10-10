<template>
  <VPopover
    placement="bottom-start"
    :class="[$style.popoverWrapper, { [$style.disabled]: loading }]"
    :popover-class="$style.popover"
    :open.sync="open"
    :offset="8"
    :container="false"
    :boundaries-element="$parent.$el"
    :disabled="disabled"
  >
    <div
      :class="[
        $style.filter,
        filterClass,
        { [$style.active]: open, [$style.loading]: loading }
      ]"
    >
      <div :class="[$style.wrapper, $style.ellipsis]">
        <span v-if="$scopedSlots.icon" :class="$style.icon">
          <slot name="icon" />
        </span>
        <span v-if="label" :class="[$style.label, { [$style.dot]: showDot }]">
          {{ label }}
        </span>
        <TextEllipsis v-if="value" :class="$style.value" :text="value" />
      </div>
      <div v-if="!loading" :class="$style.wrapper">
        <span
          v-if="textAfter"
          :class="[$style.textAfter, { [$style.active]: open }]"
        >
          {{ textAfter }}
        </span>
        <IconArrowDown v-if="!noArrow" :class="$style.arrow" :rotated="open" />
      </div>
    </div>
    <template #popover>
      <slot />
    </template>
  </VPopover>
</template>

<script>
  import { VPopover } from 'v-tooltip';
  import IconArrowDown from '@/components/icons/ArrowDown';
  import TextEllipsis from '@/components/core/TextEllipsis';

  export default {
    name: 'PinnedBaseFilter',
    components: { TextEllipsis, IconArrowDown, VPopover },
    props: {
      label: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      },
      textAfter: String,
      filterClass: String,
      loading: Boolean,
      noArrow: Boolean,
      disabled: Boolean
    },
    data() {
      return {
        isOpen: false,
        bodyElement: null
      };
    },
    computed: {
      showDot() {
        return Boolean(this.label && this.value);
      },

      open: {
        get() {
          return this.isOpen;
        },

        set(isOpen) {
          if (this.disabled) {
            return;
          }

          this.isOpen = isOpen;
        }
      }
    },
    watch: {
      isOpen(newIsOpen) {
        if (this.disabled) {
          return;
        }

        newIsOpen ? this.$emit('open') : this.$emit('close');
      }
    },
    mounted() {
      this.bodyElement = document.body;
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .popover-wrapper {
    position: relative;
  }

  .popover {
    margin-top: 40px;

    min-width: 100%;
  }

  .disabled {
    pointer-events: none;
  }

  .filter {
    display: flex;
    align-items: center;
    justify-content: space-between;

    height: 32px;
    padding: 0 12px;

    background-color: $color-bg-primary-mid;
    color: $color-text-light;

    border-radius: 6px;

    transition: color, background-color 0.2s linear;

    cursor: pointer;

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

    &.loading {
      @include skeleton;
    }
  }

  .wrapper {
    @include flex-center;

    &.ellipsis {
      min-width: 0;
    }
  }

  .icon {
    @include row;

    margin-right: 4px;
  }

  .label {
    @include flex-center;

    white-space: nowrap;
  }

  .dot::after {
    content: ' \25CF';
    font-size: 6px;
    position: relative;
    margin: 0 7px;
    top: 1px;
    right: 1px;
  }

  .value {
    font-weight: bold;

    min-width: 0;
  }

  .arrow {
    margin-left: 8px;
    margin-top: 2px;
    color: $color-text-main-lighter;
  }

  .text-after {
    margin-left: auto;

    &.active {
      font-weight: bold;
    }
  }
</style>
