<template>
  <svg
    :class="active && $style.active"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <g fill="none" fill-rule="evenodd">
      <path
        stroke="#4A4A4A"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.5 12.5h17a1 1 0 0 1 1 1v5h-19v-5a1 1 0 0 1 1-1zM4.5 7.5C7 5.833 9.5 5 12 5s5 .833 7.5 2.5v5h-15v-5z"
      />
      <path fill="#4A4A4A" d="M2 16h1v5H2zM21 16h1v5h-1z" />
      <path
        stroke="#4A4A4A"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M8.5 8.5h7v4h-7z"
      />
    </g>
  </svg>
</template>

<script>
  export default {
    name: 'InventoryIcon',
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
  svg.active g > path {
    &:first-child,
    &:last-child {
      stroke: $color-bg-primary;
    }

    &:nth-child(2) {
      fill: $color-bg-primary;
    }
  }
</style>
