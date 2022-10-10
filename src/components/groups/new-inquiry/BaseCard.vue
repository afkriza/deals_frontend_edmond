<template>
  <div :class="$style.card">
    <slot />
  </div>
</template>

<style lang="scss" module>
  @import 'utils';

  .card {
    @include row;

    background: $color-bg-light;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
  }
</style>
