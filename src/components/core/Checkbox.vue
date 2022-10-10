<template>
  <div
    :class="[
      {
        [$style.reverse]: reverse,
        [$style.condensed]: condensed,
        [$style.disabled]: disabled
      },
      $style[verticalAlignment],
      $style.wrapper,
      themeClass
    ]"
    @click.stop="onClick"
  >
    <div
      :class="[
        {
          [$style.isActive]: checked,
          [$style.noWrap]: addNoWrap,
          [$style.indeterminate]: indeterminate
        },
        $style.label,
        labelClass && labelClass
      ]"
    >
      <slot></slot>
    </div>
    <div
      :class="[
        {
          [$style.isActive]: checked,
          [$style.indeterminate]: indeterminate
        },
        $style.checkbox
      ]"
    ></div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: [String, Number]
      },
      checked: {
        type: Boolean,
        required: true
      },
      labelClass: {
        type: String
      },
      indeterminate: {
        type: Boolean,
        default: false
      },
      addNoWrap: {
        type: Boolean,
        default: true
      },
      disabled: {
        type: Boolean,
        default: false
      },
      theme: {
        type: [String, Array],
        default: 'primary'
      },
      reverse: {
        type: Boolean,
        default: false
      },
      condensed: {
        type: Boolean,
        default: false
      },

      verticalAlignment: {
        type: String,
        default: 'center'
      }
    },
    computed: {
      themeClass() {
        if (typeof this.theme === 'string') {
          return this.$style[this.theme];
        }

        return this.theme.map(theme => {
          return this.$style[theme];
        });
      }
    },
    methods: {
      onClick($event) {
        if (!this.disabled) {
          this.$emit('checked:update', !this.checked, this.value, $event);
        }
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  @mixin primary-style {
    border-color: $color-border-main;

    &.is-active,
    &.indeterminate {
      border-color: $color-border-primary;
      background-color: $color-bg-primary;

      &::after {
        border-color: $color-border-light;
      }
    }

    &.indeterminate::after {
      background-color: $color-border-light;
    }
  }

  @keyframes pop {
    25% {
      transform: scale(1.1);
    }

    100% {
      transform: scale(1);
    }
  }

  /* stylelint-disable max-nesting-depth, selector-max-specificity */
  .wrapper {
    display: flex;
    justify-content: space-between;

    &.center {
      align-items: center;
    }

    &.top {
      align-items: flex-start;
    }

    &.condensed {
      justify-content: flex-end;

      .label {
        margin-right: 10px;
        overflow: hidden;
      }
    }

    &.reverse {
      flex-direction: row-reverse;

      .label {
        margin-right: 0;
        margin-left: 10px;
      }
    }

    &.primary {
      .checkbox {
        @include primary-style;
      }
    }

    &.secondary {
      &:hover {
        .checkbox {
          border-color: $color-border-light;
        }
      }

      &.disabled {
        opacity: 0.3;

        .checkbox {
          cursor: default;
        }
      }

      .checkbox {
        @include primary-style;
        border-color: $color-border-main-mid;

        transition-property: border-color, background-color;
        transition-duration: 0.2s;

        &::after {
          transition: border-color, 0.2s;
        }

        &.is-active,
        &.indeterminate {
          background-color: $color-bg-light;
          border-color: $color-border-light;
          animation: pop 0.2s forwards;
        }

        &.is-active::after {
          border-color: $color-border-primary;
        }

        &.indeterminate::after {
          background-color: $color-border-primary;
        }
      }
    }

    &.small {
      .checkbox {
        @include primary-style;
        width: 14px;
        height: 14px;

        &.is-active::after {
          height: 8px;
          width: 3px;

          border-bottom-width: 1px;
          border-right-width: 1px;
        }

        &.indeterminate::after {
          height: 2px;
          width: 6px;
        }
      }
    }

    &.medium {
      .checkbox {
        @include primary-style;
        width: 16px;
        height: 16px;

        &.is-active::after {
          height: 8px;
          width: 3px;

          border-bottom-width: 2px;
          border-right-width: 2px;
        }

        &.indeterminate::after {
          height: 2px;
          width: 6px;
        }
      }
    }

    &.white {
      .checkbox {
        background-color: $color-bg-light;
      }
    }

    &.inverse {
      &.checkbox {
        border-color: $color-border-light;

        &.is-active,
        &.indeterminate {
          border-color: $color-border-light;
          background-color: transparent;
        }

        &.is-active::after {
          border-color: $color-border-light;
        }

        &.indeterminate::after {
          background-color: $color-border-light;
        }
      }
    }

    &.inverse-filled {
      .checkbox {
        border-color: $color-border-light;

        &.is-active,
        &.indeterminate {
          border-color: $color-border-light;
          background-color: $color-bg-light;

          &::after {
            border-color: $color-border-primary;
          }
        }
      }
    }

    &.warning {
      .checkbox {
        border-color: $color-border-warning;

        &.is-active {
          border-color: $color-border-warning;
          background-color: $color-bg-warning;
        }
      }
    }
  }

  /* stylelint-enable max-nesting-depth, selector-max-specificity */
  .label {
    display: flex;
    color: $color-text-main-lighter;
    cursor: default;

    &.no-wrap {
      white-space: nowrap;
    }

    &.is-active &.indeterminate {
      color: $color-text-main;
    }
  }

  .checkbox {
    flex-shrink: 0;

    position: relative;
    width: 20px;
    height: 20px;
    border: 1px solid;
    border-radius: 2px;
    cursor: pointer;

    &.is-active::after {
      @include stretch;
      content: '';
      margin: auto;

      width: 4px;
      height: 12px;

      border-bottom: 2px solid;
      border-right: 2px solid;

      transform: rotate(40deg) translateY(-1px);
    }

    &.indeterminate::after {
      @include stretch;
      content: '';
      margin: auto;

      width: 10px;
      height: 2px;

      border-radius: 1px;
    }
  }
</style>
