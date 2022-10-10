<template>
  <svg
    :class="active && $style.active"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="#4A4A4A"
      fill-rule="nonzero"
      d="M10.675 13.995l2.724 5.837 6.713-15.944L4.168 10.6l5.837 2.724L13.56 9.77a.474.474 0 0 1 .67.67l-3.555 3.555zm-.926.256l-6.95-3.243a.474.474 0 0 1 .017-.866l18-7.579a.474.474 0 0 1 .62.62l-7.578 18a.474.474 0 0 1-.866.017l-3.243-6.949z"
    />
  </svg>
</template>

<script>
  export default {
    name: 'CheckoutIcon',
    props: {
      active: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  /* stylelint-disable selector-max-type */
  svg.active > path {
    fill: $color-bg-primary;
  }
</style>
