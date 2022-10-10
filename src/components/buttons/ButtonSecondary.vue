<template>
  <ButtonBase
    :class="[
      $style.button,
      {
        [$style.destructive]: destructive,
        [$style.dark]: dark,
        [$style.loading]: loading
      }
    ]"
    :loading="loading"
    :small="small"
    :disabled="disabled"
    v-on="$listeners"
  >
    <slot></slot>
  </ButtonBase>
</template>

<script>
  import buttonMixin from 'mixins/button-new';

  export default {
    name: 'ButtonSecondary',
    mixins: [buttonMixin],
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      small: {
        type: Boolean,
        default: false
      },
      destructive: {
        type: Boolean,
        default: false
      },
      dark: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  @mixin button(
    $color,
    $color-hover,
    $background-color-hover,
    $color-pressed,
    $background-color-pressed,
    $color-disabled,
    $color-loading
  ) {
    color: $color;
    background-color: transparent;

    transition: box-shadow 0.1s linear;

    &:hover {
      box-shadow: 0 4px 10px 0 #0000001a;

      color: $color-hover;
      background-color: $background-color-hover;
    }

    &:active {
      color: $color-pressed;
      background-color: $background-color-pressed;
    }

    &:disabled {
      color: $color-disabled;
      background-color: transparent;
    }

    &.loading {
      color: $color-loading;
      background-color: transparent;
    }
  }

  .button {
    @include button(
      $color: $color-text-main,
      $color-hover: $color-text-primary-highlight,
      $background-color-hover: $color-bg-light,
      $color-pressed: $color-text-primary-highlight,
      $background-color-pressed: transparent,
      $color-disabled: $color-text-main-mild-light,
      $color-loading: $color-text-primary
    );

    &.dark {
      @include button(
        $color: $color-text-light,
        $color-hover: $color-text-primary-mid,
        $background-color-hover: $color-bg-primary-hover-dark,
        $color-pressed: $color-text-light,
        $background-color-pressed: $color-bg-primary-highlight,
        $color-disabled: $color-text-main-light,
        $color-loading: $color-text-light
      );

      &.destructive {
        @include button(
          $color: $color-text-warning,
          $color-hover: $color-warning-highlight,
          $background-color-hover: $color-warning-hover-dark,
          $color-pressed: $color-text-light,
          $background-color-pressed: $color-bg-warning-dark,
          $color-disabled: $color-text-main-light,
          $color-loading: $color-text-light
        );
      }
    }

    &.destructive {
      @include button(
        $color: $color-text-warning,
        $color-hover: $color-warning-highlight,
        $background-color-hover: $color-bg-light,
        $color-pressed: $color-warning-dark,
        $background-color-pressed: transparent,
        $color-disabled: $color-text-main-mild-light,
        $color-loading: $color-text-warning
      );
    }
  }
</style>
