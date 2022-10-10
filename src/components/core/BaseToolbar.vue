<template>
  <footer :class="$style.toolbar">
    <slot />
  </footer>
</template>

<script>
  export default {
    name: 'BaseToolbar'
  };
</script>

<style lang="scss" module>
  @import 'utils';

  $toolbar-height: 72px;

  .toolbar {
    background-color: $color-bg-primary-dark;
    box-shadow: $toolbar-shadow;

    width: 100%;
    height: $toolbar-height;
  }
</style>
