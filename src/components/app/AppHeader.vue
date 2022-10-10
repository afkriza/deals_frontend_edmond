<template>
  <header :class="$style.header">
    <slot></slot>
  </header>
</template>

<script>
  export default {
    name: 'AppHeader'
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .header {
    height: 60px;
    display: flex;
    align-items: center;

    background-color: $color-bg-primary-dark;
  }
</style>
