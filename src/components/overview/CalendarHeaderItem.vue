<template>
  <div :class="$style.headerText">
    {{ day }}
  </div>
</template>

<script>
  export default {
    name: 'CalendarHeaderItem',
    props: {
      day: {
        type: String
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .header-text {
    padding: 12px 0;
    color: $color-text-main-lighter;
    font-weight: bold;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.2px;
    text-transform: uppercase;
    text-align: center;
  }
</style>
