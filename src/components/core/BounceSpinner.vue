<template>
  <div :class="[$style.spinner, { [$style.dark]: dark }]">
    <div :class="$style.doubleBounce1" />
    <div :class="$style.doubleBounce2" />
  </div>
</template>

<script>
  export default {
    props: {
      dark: Boolean
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  $color-big-circle: #dcebfc;
  $color-small-circle: #a7c6e8;

  $color-big-circle-dark: #32465d;
  $color-small-circle-dark: #77a9e6;

  .dark {
    .double-bounce1 {
      background-color: $color-big-circle-dark;
    }

    .double-bounce2 {
      background-color: $color-small-circle-dark;
    }
  }

  @keyframes bounce {
    0%,
    100% {
      transform: scale(0);
    }

    50% {
      transform: scale(1);
    }
  }

  .spinner {
    position: relative;

    width: 40px;
    height: 40px;
  }

  .double-bounce1,
  .double-bounce2 {
    @include circle(40px);

    position: absolute;
    top: 0;
    left: 0;

    animation: bounce 2s infinite ease-in-out;
  }

  .double-bounce1 {
    background-color: $color-big-circle;
  }

  .double-bounce2 {
    background-color: $color-small-circle;
  }

  .double-bounce2 {
    animation-delay: -1s;
  }
</style>
