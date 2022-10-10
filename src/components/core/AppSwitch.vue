<template>
  <div :class="$style.switchContainer">
    <div
      :class="[$style.switch, { [$style.isActive]: isActive }]"
      @click="toggleSwitch"
    ></div>
  </div>
</template>

<script>
  export default {
    props: {
      isActive: {
        type: Boolean,
        required: true
      }
    },
    components: {},
    computed: {},
    methods: {
      toggleSwitch() {
        if (this.isActive) {
          this.deactivate();
        } else {
          this.activate();
        }
      },

      deactivate() {
        this.$emit('switch:deactivate');
      },

      activate() {
        this.$emit('switch:activate');
      }
    },

    data() {
      return {};
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  $width: 24px;
  $radio-width: 12px;

  .switch-container {
    width: $width;
    height: 14px;
  }

  .switch {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50px;
    background-color: $color-bg-warning;

    &.is-active {
      background-color: $color-bg-success;

      &::after {
        border-color: $color-border-success;
        left: $width - $radio-width;
      }
    }

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      content: '';
      width: $radio-width;
      height: $radio-width;
      border: 1px solid $color-border-warning;
      border-radius: 50%;
      background-color: $color-bg-light;
      transition-property: left, right;
      transition-duration: 0.3s;
    }
  }
</style>
