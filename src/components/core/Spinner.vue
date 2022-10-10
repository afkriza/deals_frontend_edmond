<template>
  <div :class="$style.spinner" :style="spinnerStyle" />
</template>

<script>
  export default {
    name: 'Spinner',
    props: {
      size: {
        type: String,
        default: '18px'
      }
    },
    computed: {
      spinnerStyle() {
        return {
          '--size': this.size
        };
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .spinner {
    $spinner-border: 3px solid currentColor;

    width: var(--size);
    height: var(--size);
    border: $spinner-border;
    border-radius: 100%;

    // Important is being used because we always want this to be transparent
    // This enables us to use the border shorthand for other borders
    border-left-color: transparent !important; // stylelint-disable-line declaration-no-important

    animation-name: rotation;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
</style>
