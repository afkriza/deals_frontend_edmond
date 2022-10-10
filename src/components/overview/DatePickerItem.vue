<template>
  <div :class="[$style.itemClass, active && $style.active]" v-on="$listeners">
    {{ text }}
  </div>
</template>

<script>
  export default {
    name: 'DatePickerItem',
    props: {
      text: {
        type: [String, Number],
        default: ''
      },
      active: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .item-class {
    padding: 10px 0;
    text-align: center;
    border: 1px solid $color-border-main-dimmed;
    border-radius: 4px;
    cursor: pointer;
    transition: border 0.3s ease;

    &.active {
      border: 1px solid $color-border-primary;
      box-shadow: inset 0 0 0 2px $color-border-primary;
    }

    &:hover {
      border: 1px solid $color-border-primary-mid;
    }
  }
</style>
