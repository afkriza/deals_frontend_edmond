<template>
  <div
    :class="[
      $style.progressRatio,
      $style[theme],
      isEnlarged ? $style.enlarged : null
    ]"
  >
    <span :class="$style.progressRatioTitle">{{ formattedProgress }}</span>
    <div :class="$style.denominator">
      <span :class="$style.divider">/</span>
      <span>{{ formattedTotal }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ProgressRatio',
    props: {
      progress: {
        type: Number,
        default: 0
      },
      total: {
        type: Number,
        default: 100
      },
      theme: {
        type: String,
        default: 'primary',
        validator(value) {
          return ['primary', 'featured'].includes(value);
        }
      },
      isEnlarged: {
        type: Boolean
      }
    },
    computed: {
      formattedProgress() {
        return this.progress === null ? '?' : this.progress.toLocaleString();
      },
      formattedTotal() {
        return this.total === null || this.total === 0
          ? '?'
          : this.total.toLocaleString();
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .progress-ratio {
    display: flex;
    font-weight: bold;
    font-size: 14px;
    line-height: 20px;
    color: $color-text-main-light;
    flex-wrap: wrap;

    &.featured {
      .progress-ratio-title {
        font-size: 24px;
        line-height: 32px;
      }
    }

    &.primary.enlarged {
      font-size: 24px;
      line-height: 32px;

      .denominator {
        line-height: 32px;
      }
    }
  }

  .progress-ratio-title {
    color: $color-text-primary-darker;
  }

  .denominator {
    align-self: flex-end;
    line-height: 20px;
  }

  .divider {
    margin: 0 4px;
  }
</style>
