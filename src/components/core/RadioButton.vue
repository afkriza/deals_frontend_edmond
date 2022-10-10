<template>
  <div
    :class="[
      {
        [$style.disabled]: disabled
      },
      $style[theme],
      $style[verticalAlignment],
      $style.wrapper
    ]"
    @click="onClick"
  >
    <div :class="[{ [$style.isActive]: value }, $style.radio]" />
    <div :class="[{ [$style.isActive]: value }, $style.label]">
      <span v-if="label">{{ label }}</span>
      <slot v-else />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        required: true
      },
      disabled: {
        type: Boolean,
        default: false
      },
      label: {
        type: String
      },
      theme: {
        type: String,
        default: 'primary'
      },
      verticalAlignment: {
        type: String,
        default: 'center'
      }
    },
    methods: {
      onClick() {
        if (!this.disabled) {
          this.$emit('input', !this.value);
        }
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  @keyframes pop {
    25% {
      transform: scale(1.1);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes popout {
    25% {
      transform: scale (0.25);
    }

    100% {
      transform: scale(1);
    }
  }

  @mixin primary-style {
    .radio {
      border-color: $color-border-main;

      &.is-active {
        &.radio {
          border-color: $color-border-primary;
        }

        &::after {
          background-color: $color-bg-primary;
        }
      }
    }
  }

  .wrapper {
    display: flex;
    justify-content: flex-start;

    &.center {
      align-items: center;
    }

    &.top {
      align-items: flex-start;
    }

    &.primary {
      @include primary-style;
    }

    &.light {
      .radio {
        border-color: $color-border-main-mid;
        transition: border-color 0.2s, background-color, 0.2s;

        &::after {
          transform: scale(0);
        }

        &.is-active {
          background-color: $color-bg-light;
        }
      }

      &:hover {
        .radio {
          border-color: $color-border-light;
        }
      }

      &.disabled {
        opacity: 0.3;

        .radio {
          cursor: auto;
        }
      }

      .is-active {
        border-color: $color-border-light;

        &::after {
          background-color: $color-bg-primary;
        }
      }

      .label {
        transition: color, 0.2s;
        color: $color-text-light;
      }
    }
  }

  .label {
    margin-left: 10px;
    cursor: default;
  }

  .radio {
    position: relative;
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    border: 1px solid;
    border-radius: 50%;
    cursor: pointer;

    &.is-active {
      animation: pop 0.2s forwards;

      &::after {
        @include stretch;
        content: '';

        margin: auto;
        border-radius: 50%;

        width: 10px;
        height: 10px;

        animation: popout 0.1s forwards;
      }
    }
  }
</style>
