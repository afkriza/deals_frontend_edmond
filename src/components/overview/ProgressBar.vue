<template>
  <div
    :class="[
      $style.progressBar,
      $style[progressColorClass],
      shadow && $style.shadow
    ]"
    :style="{
      '--progressWidth': `${progressWidth}%`
    }"
  />
</template>

<script>
  export default {
    name: 'ProgressBar',
    props: {
      progress: {
        type: Number,
        default: 0
      },
      shadow: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      progressWidth() {
        return this.progress === null ? 0 : Math.min(this.progress, 100);
      },

      progressColorClass() {
        if (this.progress === null) {
          return 'default';
        }

        if (this.progress < 33) {
          return 'warning';
        } else if (this.progress > 66) {
          return 'success';
        }

        return 'default';
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .progress-bar {
    position: relative;
    min-height: 12px;
    width: 100%;
    border-radius: 4px;
    background-color: $color-bg-main-light;

    &::after {
      position: absolute;
      display: block;
      content: '';
      left: 0;
      top: 0;
      bottom: 0;
      min-width: var(--progressWidth);
      border-radius: 4px 0 0 4px;
    }

    &.default::after {
      background-color: $color-bg-main-mid;
    }

    &.success::after {
      background-color: $color-bg-success;
    }

    &.warning::after {
      background-color: $color-bg-warning;
    }

    &.shadow::before {
      position: absolute;
      display: block;
      width: 40px;
      height: 100%;
      z-index: 1;
      content: '';
      right: 0;
      background: linear-gradient(
        90deg,
        rgba($color-bg-light, 0) 0%,
        rgba($color-bg-light, 1) 100%
      );
    }
  }
</style>
