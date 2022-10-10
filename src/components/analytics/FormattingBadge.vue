<template>
  <div :class="$style.badge">
    <slot />
  </div>
</template>

<style lang="scss" module>
  @import 'utils';

  $radius: 24px;

  /* stylelint-disable selector-max-type */
  .badge {
    @include circle(24px);
    @include flex-center;

    color: $color-text-primary-mid;
    background-color: $color-bg-main-light;
    border: 2px solid $color-border-light;

    box-sizing: content-box;

    svg path {
      fill: currentColor;
    }
  }

  /* stylelint-enable selector-max-type */
</style>
