<template>
  <Button :button-style-override="$style" v-bind="$attrs" v-on="$listeners">
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
    @include button-states($color-bg-light, $color-bg-light, $color-bg-light);

    border: 1px solid $color-border-main-light;

    &:disabled {
      color: $color-text-main-lighter;
      border-color: $color-border-main;

      .spinner {
        border: 3px solid $color-border-main;
      }
    }
  }

  .primary {
    @extend %button;

    color: $color-text-primary;

    &.inverted {
      @include button-states(
        $color-bg-primary,
        $color-bg-primary,
        $color-bg-primary
      );
      color: $color-text-light;
    }

    .spinner {
      border: 3px solid $color-border-primary;
    }
  }

  .secondary {
    @extend %button;

    color: $color-text-warning;
    border-color: $color-border-main-light;

    .spinner {
      border: 3px solid $color-border-warning;
    }
  }

  .tertiary {
    @extend %button;
    @include button-states(
      $color-bg-primary-dark,
      $color-bg-primary-dark,
      $color-bg-primary-dark,
      $color-bg-primary-dark
    );

    &:disabled {
      color: rgba($color-text-light, 0.4);
    }

    color: $color-text-light;
  }
</style>
