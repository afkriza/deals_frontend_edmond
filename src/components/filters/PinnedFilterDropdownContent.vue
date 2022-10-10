<template>
  <div :class="$style.container">
    <div :class="$style.scroll">
      <slot />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PinnedFilterDropdownContent'
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    background-color: $color-bg-primary-darker;
    color: $color-text-light;
    padding: 8px 0;
    max-height: 550px;
    display: flex;
    flex-direction: column;
    border-radius: 4px;
  }

  .scroll {
    overflow-y: auto;
    flex: 1;
    min-height: 0;
  }
</style>
