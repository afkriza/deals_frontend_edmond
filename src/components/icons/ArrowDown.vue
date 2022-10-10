<template>
  <svg
    :class="[$style.arrow, { [$style.rotated]: rotated }]"
    height="16"
    viewBox="0 0 16 16"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      :class="$style.path"
      d="M8 11l4-5H4z"
      fill="#00A1BA"
      fill-rule="evenodd"
    />
  </svg>
</template>

<script>
  export default {
    name: 'ArrowDown',
    props: {
      rotated: Boolean
    }
  };
</script>

<style lang="scss" module>
  .arrow {
    transition: all 0.2s ease;

    &.rotated {
      transform: rotate(180deg);
    }
  }

  .path {
    fill: currentColor;
  }
</style>
