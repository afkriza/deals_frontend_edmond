<template>
  <header :class="$style.logoWrapper">
    <span :class="$style.logo">
      <!-- @svg("logo-reduced") -->
    </span>
  </header>
</template>

<script>
  export default {};
</script>

<style lang="scss" module>
  @import 'utils';

  .logo-wrapper {
    @include flex-center;

    height: 60px;
    width: 100%;

    background-color: $color-bg-primary;
  }
</style>
