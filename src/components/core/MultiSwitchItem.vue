<template>
  <button
    :class="[
      $style.item,
      btnClass,
      { [$style.isActive]: isActive, [$style.inverted]: isInverted }
    ]"
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
      },
      isInverted: {
        type: Boolean,
        default: false
      },
      btnClass: {
        type: String
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  $border-radius: 14px;
  $border-style: 1px solid $color-border-primary;
  $inverted-border-style: 1px solid $color-border-light;

  .item {
    background-color: transparent;

    font-size: 12px;
    font-weight: bold;

    @include flex-center($is-inline: true);

    padding: 0 10px;
    height: 28px;

    vertical-align: top;

    cursor: pointer;

    color: $color-text-primary;
    border: $border-style;

    &:first-child {
      border-bottom-left-radius: $border-radius;
      border-top-left-radius: $border-radius;
    }

    &:last-child {
      border-bottom-right-radius: $border-radius;
      border-top-right-radius: $border-radius;
    }

    &.is-active {
      color: $color-text-light;
      background-color: $color-bg-primary;
    }

    &.inverted {
      color: $color-text-light;
      border: $inverted-border-style;

      &.is-active {
        color: $color-text-primary-dark;
        background-color: $color-bg-light;
      }
    }

    &:not(:last-child) {
      border-right: none;
    }
  }
</style>
