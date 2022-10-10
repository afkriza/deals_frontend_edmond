<template>
  <button
    :class="[$style.item, { [$style.isActive]: isActive }]"
    v-on="$listeners"
  >
    <slot />
  </button>
</template>

<script>
  export default {
    props: {
      isActive: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .item {
    cursor: pointer;

    width: 48px;
    height: 32px;
    padding: 0;

    border: none;
    border-radius: 4px;
    background-color: $color-bg-main-dimmed;
    border: 1px solid $color-border-light;

    &:not(:last-child) {
      margin-right: 8px;
    }

    &:hover {
      background-color: $color-bg-primary-dimmed;

      > svg path {
        fill: $color-border-primary;
      }
    }

    &.is-active {
      border: 1px solid $color-border-primary;
      background-color: $color-bg-primary-dimmed;

      > svg path {
        fill: $color-border-primary;
      }
    }
  }
</style>
