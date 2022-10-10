<template>
  <svg
    :class="active && $style.active"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.8 9.892l2.872-1.28a.5.5 0 0 1 .407.914l-3.876 1.726a.5.5 0 0 1-.66-.253L1.818 7.123a.5.5 0 0 1 .913-.407l1.183 2.656A8.506 8.506 0 0 1 12 3.5a8.5 8.5 0 1 1-7.672 12.163.5.5 0 0 1 .902-.432 7.5 7.5 0 1 0-.43-5.34zM12.5 7v4.793l2.854 2.853a.5.5 0 0 1-.708.708l-3-3A.5.5 0 0 1 11.5 12V7a.5.5 0 1 1 1 0z"
      fill="#4A4A4A"
      fill-rule="evenodd"
    />
  </svg>
</template>

<script>
  export default {
    name: 'HistoryIcon',
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
