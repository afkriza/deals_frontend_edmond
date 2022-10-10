<template>
  <div
    :class="[$style.progressPercent, $style[progressColorClass], $style[theme]]"
    :style="{
      '--progressWidth': `${progress || 0}%`
    }"
  >
    {{ formattedProgress }}
  </div>
</template>

<script>
  export default {
    name: 'ProgressPercent',
    props: {
      progress: {
        type: Number,
        default: 0
      },
      theme: {
        type: String,
        default: 'primary',
        validator(value) {
          return ['primary', 'secondary'].includes(value);
        }
      }
    },
    computed: {
      formattedProgress() {
        return this.progress === null ? '' : `${this.progress}%`;
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

  .progress-percent {
    font-weight: bold;
    letter-spacing: 0.2px;

    &.primary {
      font-size: 12px;
      line-height: 16px;
    }

    &.secondary {
      font-size: 14px;
      line-height: 20px;
    }

    &.default {
      color: $color-bg-main-mid;
    }

    &.success {
      color: $color-bg-success;
    }

    &.warning {
      color: $color-bg-warning;
    }
  }
</style>
