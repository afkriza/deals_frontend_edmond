<template>
  <div
    :class="$style.tooltipContainer"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  >
    <div :class="triggerClass">
      <slot name="trigger" />
    </div>
    <transition name="tooltip-fade">
      <div
        v-show="isTooltipOpen"
        :class="[
          customTooltipClass,
          $style.content,
          $style[theme],
          $style[align],
          {
            [$style.condensed]: condensed
          }
        ]"
        :style="tooltipOffset"
      >
        <div
          v-if="arrowPosition"
          :class="[$style.arrow, $style[arrowPosition]]"
        />
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
  import { capitalize } from 'utils/string';

  export default {
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      condensed: {
        type: Boolean,
        default: false
      },
      offset: {
        type: Object,
        default() {
          return {
            horizontal: 0,
            vertical: 0
          };
        }
      },
      customTooltipClass: {
        type: String,
        default: ''
      },
      align: {
        type: String,
        default: '',
        validator(value) {
          return ['left', 'center', 'right', ''].includes(value);
        }
      },
      theme: {
        type: String,
        default: 'primary',
        validator(value) {
          return ['primary', 'light', 'dark'].includes(value);
        }
      },
      arrowPosition: {
        type: String,
        default: '',
        validator(value) {
          return ['top', 'bottom', ''].includes(value);
        }
      }
    },
    components: {},
    computed: {
      tooltipOffset() {
        // Disregard horizontal offset in case align center is set
        const horizontalOffset =
          this.align === 'center' ? '-50%' : `${this.offset.horizontal || 0}px`;

        return {
          transform: `translateX(${horizontalOffset || 0}) translateY(${this
            .offset.vertical || 0}px)`
        };
      },

      triggerClass() {
        const classes = [this.$style.trigger];
        if (!this.disabled) {
          classes.push(this.$style.enabled);
        }
        return classes;
      }
    },
    watch: {
      disabled(val) {
        if (val) {
          this.hideTooltip();
        }
      }
    },
    methods: {
      showTooltip() {
        if (!this.disabled) {
          this.isTooltipOpen = true;
        }
      },

      hideTooltip() {
        this.isTooltipOpen = false;
      }
    },
    data() {
      return {
        isTooltipOpen: false
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  $arrow-size: 3px;

  .tooltip-container {
    position: relative;
  }

  .arrow {
    position: absolute;
    right: 0;
    left: 0;
    margin: 0 auto;

    width: 0;
    height: 0;
    border-right: $arrow-size solid transparent;
    border-left: $arrow-size solid transparent;

    &.top {
      top: -$arrow-size;

      border-bottom: {
        width: $arrow-size;
        style: solid;
      }
    }

    &.bottom {
      bottom: -$arrow-size;

      border-top: {
        width: $arrow-size;
        style: solid;
      }
    }
  }

  .content {
    position: absolute;
    z-index: $z-tooltip;
    padding: 15px;
    bottom: 0;
    color: $color-text-light;
    background-color: $color-bg-primary-dark;
    border-radius: $base-border-radius;
    box-shadow: $tooltip-shadow;

    .arrow.top {
      border-bottom-color: $color-border-primary-dark;
    }

    .arrow.bottom {
      border-top-color: $color-border-primary-dark;
    }

    // Size
    &.condensed {
      padding: 10px;
    }

    // Alignment
    &.left {
      left: 0;
    }

    &.center {
      left: 50%;
    }

    &.right {
      right: 0;
    }

    // Theme
    &.light {
      background-color: $color-bg-light;
      color: $color-text-main;

      .arrow.top {
        border-bottom-color: $color-border-light;
      }

      .arrow.bottom {
        border-top-color: $color-border-light;
      }
    }

    &.dark {
      background-color: $color-bg-main-dark;

      .arrow.top {
        border-bottom-color: $color-border-main-darker;
      }

      .arrow.bottom {
        border-top-color: $color-border-main-darker;
      }
    }
  }
</style>
