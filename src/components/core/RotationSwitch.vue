<template>
  <span
    v-on="$listeners"
    :class="[
      $style.wrapper,
      {
        [$style.isRotated]: isRotated,
        [$style.isDisabled]: isDisabled
      }
    ]"
  >
    <slot></slot>
  </span>
</template>

<script>
  export default {
    name: 'RotationSwitch',
    props: {
      isRotated: {
        type: Boolean,
        required: false
      },
      isDisabled: {
        type: Boolean,
        required: false
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .wrapper {
    transition: transform 0.2s;

    &.is-rotated {
      transform: rotate(180deg);
    }

    &.is-disabled {
      opacity: 0.3;
    }
  }
</style>
