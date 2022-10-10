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
    name: 'ButtonPrimary',
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
    $color-hover,
    $background-color-hover,
    $color-pressed,
    $background-color-pressed,
    $color-disabled,
    $background-color-disabled,
    $color-loading,
    $background-color-loading
  ) {
    color: $color;
    background-color: $background-color;

    &:hover {
      color: $color-hover;
      background-color: $background-color-hover;
    }

    &:active {
      color: $color-pressed;
      background-color: $background-color-pressed;
    }

    &:disabled {
      color: $color-disabled;
      background-color: $background-color-disabled;
    }

    &.loading {
      color: $color-loading;
      background-color: $background-color-loading;
    }
  }

  .button {
    @include button(
      $color-text-light,
      $color-bg-primary,
      $color-text-light,
      $color-bg-primary-highlight,
      $color-text-light,
      $color-bg-primary-mid,
      $color-text-light,
      $color-bg-main,
      $color-text-light,
      $color-bg-primary
    );

    &.dark {
      @include button(
        $color-text-primary,
        $color-bg-light,
        $color-text-primary,
        $color-bg-primary-light,
        $color-text-light,
        $color-bg-primary-highlight,
        $color-text-main-light,
        $color-bg-primary-mid,
        $color-text-primary,
        $color-bg-light
      );

      &.destructive {
        @include button(
          $color-text-warning,
          $color-bg-light,
          $color-warning-highlight,
          $color-warning-light,
          $color-text-light,
          $color-bg-warning-dark,
          $color-text-main-light,
          $color-bg-primary-mid,
          $color-text-warning,
          $color-bg-light
        );
      }
    }

    &.destructive {
      @include button(
        $color-text-light,
        $color-bg-warning,
        $color-text-light,
        $color-bg-warning-highlight,
        $color-text-light,
        $color-bg-warning-dark,
        $color-text-light,
        $color-bg-main,
        $color-text-light,
        $color-bg-warning
      );
    }
  }
  //
  //%button {
  //  color: $color-text-light;
  //
  //  padding: 14px;
  //  min-width: 176px;
  //
  //  &:disabled {
  //    background-color: $color-bg-main;
  //  }
  //}
  //
  //.regular {
  //  @extend %button;
  //  @include button-states(
  //    $color-bg-primary,
  //    $color-bg-primary-mid,
  //    $color-bg-primary,
  //    $color-bg-primary-hover
  //  );
  //
  //  &.dark {
  //    @include button-states($color-bg-light, $color-bg-light, $color-bg-light);
  //
  //    color: $color-text-primary;
  //
  //    &:hover {
  //      box-shadow: $light-shadow;
  //    }
  //
  //    &:disabled {
  //      color: $color-text-main-mild-light;
  //
  //      &:hover {
  //        box-shadow: none;
  //      }
  //    }
  //  }
  //
  //  &.loading {
  //    background-color: $color-bg-primary;
  //  }
  //}
  //
  //.destructive {
  //  @extend %button;
  //  @include button-states(
  //    $color-bg-warning,
  //    $color-bg-warning,
  //    $color-bg-warning-dark,
  //    $color-bg-warning-highlight
  //  );
  //
  //  &.loading {
  //    background-color: $color-bg-warning;
  //  }
  //}
</style>
