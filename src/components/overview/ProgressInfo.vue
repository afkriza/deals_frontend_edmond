<template>
  <div :class="$style.progressInfo">
    <div :class="$style.progressInfoHeader">
      <progress-ratio :progress="progress" :total="total" />
      <progress-percent :progress="percent" theme="secondary" />
    </div>
    <progress-bar :progress="percent" :shadow="addShadow" />
  </div>
</template>

<script>
  import ProgressBar from './ProgressBar.vue';
  import ProgressPercent from './ProgressPercent.vue';
  import ProgressRatio from './ProgressRatio.vue';

  export default {
    components: {
      ProgressBar,
      ProgressPercent,
      ProgressRatio
    },
    name: 'ProgressInfo',
    props: {
      progress: {
        type: Number,
        default: 0
      },
      total: {
        type: Number,
        default: 100
      }
    },
    computed: {
      percent() {
        if (this.total === null || this.progress === null) {
          return null;
        }

        if (this.total === 0) {
          return 100;
        }

        return Math.floor((this.progress * 100) / this.total);
      },
      addShadow() {
        return Boolean(this.percent) && this.percent > 100;
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .progress-info {
    display: block;
  }

  .progress-info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 5px;
  }
</style>
