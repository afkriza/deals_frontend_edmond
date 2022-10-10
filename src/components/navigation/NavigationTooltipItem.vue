<template>
  <div :class="$style.item">
    <slot>
      <span :class="$style.text">{{ text }}</span>
    </slot>
  </div>
</template>

<script>
  export default {
    name: 'NavigationTooltipItem',
    props: {
      text: {
        type: String,
        required: false
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .item {
    @include flex-center;
    justify-content: flex-start;
    height: 48px;
    padding: 15px 16px 13px 16px;
    color: $color-text-main;
    white-space: nowrap;
  }
</style>
