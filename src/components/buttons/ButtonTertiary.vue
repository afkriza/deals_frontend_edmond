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
    name: 'ButtonTertiary',
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
    $background-color,
    $border-color,
    $color-hover,
    $background-color-hover,
    $border-color-hover,
    $color-pressed,
    $background-color-pressed,
    $border-color-pressed,
    $color-disabled,
    $background-color-disabled,
    $border-color-disabled,
    $color-loading,
    $background-color-loading,
    $border-color-loading
  ) {
    color: $color;
    background-color: $background-color;
    border: 1px solid $border-color;

    &:hover {
      color: $color-hover;
      background-color: $background-color-hover;
      border-color: $border-color-hover;
    }

    &:active {
      color: $color-pressed;
      background-color: $background-color-pressed;
      border-color: $border-color-pressed;
    }

    &:disabled {
      color: $color-disabled;
      background-color: $background-color-disabled;
      border-color: $border-color-disabled;
    }

    &.loading {
      color: $color-loading;
      background-color: $background-color-loading;
      border-color: $border-color-loading;
    }
  }

  .button {
    @include button(
      $color: $color-text-main,
      $background-color: transparent,
      $border-color: $color-border-main-light,
      $color-hover: $color-text-primary-highlight,
      $background-color-hover: $color-bg-primary-dimmed,
      $border-color-hover: $color-border-primary-highlight,
      $color-pressed: $color-text-light,
      $background-color-pressed: $color-bg-primary-highlight,
      $border-color-pressed: $color-border-primary-highlight,
      $color-disabled: $color-text-main-mild-light,
      $background-color-disabled: transparent,
      $border-color-disabled: $color-border-main-light,
      $color-loading: $color-text-primary,
      $background-color-loading: transparent,
      $border-color-loading: $color-border-main-light
    );

    &.dark {
      @include button(
        $color: $color-text-light,
        $background-color: transparent,
        $border-color: $color-border-secondary,
        $color-hover: $color-text-primary-mid,
        $background-color-hover: $color-bg-primary-hover-dark,
        $border-color-hover: $color-border-primary-highlight,
        $color-pressed: $color-text-light,
        $background-color-pressed: $color-bg-primary-highlight,
        $border-color-pressed: $color-border-primary-highlight,
        $color-disabled: $color-text-main-light,
        $background-color-disabled: transparent,
        $border-color-disabled: $color-border-secondary,
        $color-loading: $color-text-light,
        $background-color-loading: transparent,
        $border-color-loading: $color-border-secondary
      );

      &.destructive {
        @include button(
          $color: $color-text-warning,
          $background-color: transparent,
          $border-color: $color-border-secondary,
          $color-hover: $color-warning-highlight,
          $background-color-hover: $color-warning-hover-dark,
          $border-color-hover: $color-border-warning,
          $color-pressed: $color-text-light,
          $background-color-pressed: $color-bg-warning-dark,
          $border-color-pressed: color-warning-dark,
          $color-disabled: $color-text-main-light,
          $background-color-disabled: transparent,
          $border-color-disabled: $color-border-secondary,
          $color-loading: $color-text-light,
          $background-color-loading: transparent,
          $border-color-loading: $color-border-secondary
        );
      }
    }

    &.destructive {
      @include button(
        $color: $color-text-warning,
        $background-color: transparent,
        $border-color: $color-border-main-light,
        $color-hover: $color-warning-highlight,
        $background-color-hover: $color-warning-dimmed,
        $border-color-hover: $color-warning-highlight,
        $color-pressed: $color-text-light,
        $background-color-pressed: $color-bg-warning-dark,
        $border-color-pressed: $color-warning-dark,
        $color-disabled: $color-text-main-mild-light,
        $background-color-disabled: transparent,
        $border-color-disabled: $color-border-main-light,
        $color-loading: $color-text-warning,
        $background-color-loading: transparent,
        $border-color-loading: $color-border-main-light
      );
    }
  }
</style>
