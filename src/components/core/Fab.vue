<template>
  <div :class="$style.fab" v-on="$listeners">
    <span :class="$style.icon"><!-- @svg("plus") --></span>
  </div>
</template>

<style lang="scss" module>
  @import 'utils';

  .fab {
    @include circle(72px);
    @include button-states(
      $color-bg-primary,
      $color-bg-primary-mid,
      $color-bg-primary,
      $color-bg-primary-highlight
    );

    position: fixed;
    z-index: $z-floating-content;
    right: 40px;
    bottom: 40px;

    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: $fab-shadow;
    cursor: pointer;

    transition: background-color 0.2s;
  }

  .icon {
    /* stylelint-disable selector-max-type */
    > svg path {
      fill: $color-text-light;
    }

    /* stylelint-enable selector-max-type */
  }
</style>
