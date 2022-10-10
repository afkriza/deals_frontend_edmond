<template>
  <Button :buttonStyleOverride="$style" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </Button>
</template>

<script>
  import buttonMixin from 'mixins/button';

  export default {
    mixins: [buttonMixin]
  };
</script>

<style lang="scss" module>
  @import 'utils';

  %button {
    color: $color-text-light;
    border: solid 1px transparent;

    &:disabled {
      background-color: $color-bg-main;
    }
  }

  .primary {
    @extend %button;
    @include button-states(
      $color-bg-primary,
      $color-bg-primary-mid,
      $color-bg-primary,
      $color-bg-primary-highlight
    );

    &.inverted {
      @include button-states($color-bg-light, $color-bg-light, $color-bg-light);

      color: $color-text-primary;

      &:hover {
        box-shadow: $light-shadow;
      }

      &:disabled {
        color: $color-text-main-lightest;

        &:hover {
          box-shadow: none;
        }
      }
    }

    &.loading {
      background-color: $color-bg-primary;
    }
  }

  .secondary {
    @extend %button;
    @include button-states(
      $color-bg-warning,
      $color-bg-warning,
      $color-bg-warning-dark,
      $color-bg-warning-highlight
    );

    &.loading {
      background-color: $color-bg-warning;
    }
  }
</style>
