<template>
  <transition name="dropdown">
    <slot></slot>
  </transition>
</template>

<script>
  export default {
    name: 'DropdownTransition'
  };
</script>

<style lang="scss">
  .dropdown-enter-active {
    transition-duration: 0.5s;
    transition-timing-function: ease;
  }

  .dropdown-leave-active {
    transition-duration: 0.5s;
    transition-timing-function: ease;
  }

  .dropdown-enter-to,
  .dropdown-leave {
    max-height: 100%;
    overflow: hidden;
  }

  .dropdown-enter,
  .dropdown-leave-to {
    overflow: hidden;
    max-height: 0;
  }
</style>
