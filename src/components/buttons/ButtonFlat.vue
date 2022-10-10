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
    border: solid 1px transparent;
    background-color: transparent;

    &:hover {
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    &:disabled {
      color: $color-text-main-mild-light;

      .spinner {
        border: 3px solid $color-border-main;
      }
    }
  }

  .primary {
    @extend %button;

    color: $color-text-main;

    &:hover {
      color: $color-text-primary-highlight;
    }

    .spinner {
      border: 3px solid $color-border-primary;
    }
  }

  .secondary {
    @extend %button;

    color: $color-text-warning;

    &:hover {
      color: $color-border-warning-highlight;
    }

    .spinner {
      border: 3px solid $color-border-warning;
    }
  }
</style>
