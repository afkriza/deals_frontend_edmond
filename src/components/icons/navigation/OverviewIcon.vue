<template>
  <svg
    :class="active && $style.active"
    fill="none"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clip-rule="evenodd"
      d="M7.5 3C7.22386 3 7 3.22386 7 3.5V5H4.99509C3.89262 5 3 5.89277 3 6.99406V10V11V17.0059C3 18.1055 3.89323 19 4.99509 19H17.0049C18.1074 19 19 18.1072 19 17.0059V11V10V6.99406C19 5.89451 18.1068 5 17.0049 5H15V3.5C15 3.22386 14.7761 3 14.5 3C14.2239 3 14 3.22386 14 3.5V5H8V3.5C8 3.22386 7.77614 3 7.5 3ZM18 10V6.99406C18 6.44618 17.5539 6 17.0049 6H15V7.5C15 7.77614 14.7761 8 14.5 8C14.2239 8 14 7.77614 14 7.5V6H8V7.5C8 7.77614 7.77614 8 7.5 8C7.22386 8 7 7.77614 7 7.5V6H4.99509C4.44505 6 4 6.44491 4 6.99406V10H18ZM4 11V17.0059C4 17.5538 4.44614 18 4.99509 18H17.0049C17.5549 18 18 17.5551 18 17.0059V11H4Z"
      fill="#3C3E40"
      fill-rule="evenodd"
    />
    <circle cx="16" cy="17" fill="#FAFAFA" r="3.5" stroke="#3C3E40" />
    <path d="M18.5 19.5L21 22" stroke="#3C3E40" stroke-linecap="round" />
  </svg>
</template>

<script>
  export default {
    name: 'OverviewIcon',
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
  .active path:first-child {
    fill: $color-bg-primary;
  }

  .active path:last-child,
  .active circle {
    stroke: $color-bg-primary;
  }
</style>
