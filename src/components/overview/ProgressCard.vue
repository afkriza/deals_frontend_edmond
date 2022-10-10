<template>
  <div
    :class="[
      $style.cardComponent,
      $style[theme],
      $style[layout],
      $style[timeGranulation]
    ]"
    @click="onClickSubmit"
    v-on="$listeners"
  >
    <progress-ratio :class="$style.ratio" :progress="progress" :total="total" />
    <card-icon :class="$style.icon" :type="type" v-visible="type !== 'none'" />
    <div :class="$style.content" v-if="progress !== null && total !== null">
      <progress-percent
        :class="[
          $style.progressPercent,
          { [$style.reverse]: flipProgressPercent }
        ]"
        :progress="percent"
      />
      <progress-bar
        :class="$style.progressBar"
        :progress="percent"
        :shadow="addShadow"
      />
    </div>
  </div>
</template>

<script>
  import CardIcon from './CardIcon.vue';
  import ProgressBar from './ProgressBar.vue';
  import ProgressPercent from './ProgressPercent.vue';
  import ProgressRatio from './ProgressRatio.vue';

  import vVisible from 'directives/v-visible';

  export default {
    components: {
      CardIcon,
      ProgressBar,
      ProgressPercent,
      ProgressRatio
    },
    name: 'ProgressCard',
    props: {
      theme: {
        type: String,
        default: 'normal',
        validator(value) {
          return ['normal', 'active'].includes(value);
        }
      },
      layout: {
        type: String,
        default: 'card',
        validator(value) {
          return ['card', 'row'].includes(value);
        }
      },
      progress: {
        type: Number,
        default: 0
      },
      total: {
        type: Number,
        default: 100
      },
      type: {
        type: String,
        default: 'none',
        validator(value) {
          return ['none', 'do', 'look', 'done'].includes(value);
        }
      },
      flipProgressPercent: {
        type: Boolean,
        default: false
      },
      timeGranulation: {
        type: String,
        required: true,
        validator(timeGranulation) {
          return ['month', 'year'].includes(timeGranulation);
        }
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
    },
    methods: {
      onClickSubmit() {
        this.$emit('card:submit');
      }
    },
    directives: {
      visible: vVisible
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .ratio {
    flex: 1;
    height: max-content;
  }

  .card-component {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    cursor: pointer;
    transition: box-shadow 0.2s ease;

    &.normal {
      border-color: $color-border-main-light;
    }

    &.normal:hover {
      box-shadow: 0 4px 10px $light-shadow-color;
    }

    &.active {
      border-color: $color-border-primary;
      box-shadow: inset 0 0 0 2px $color-border-primary;
    }

    &.active:hover {
      box-shadow: inset 0 0 0 2px $color-border-primary,
        0 4px 10px $light-shadow-color;
    }

    &.card {
      &.month {
        padding: 8px 12px 12px;
        width: 163px;
        height: inherit;
        min-height: 90px;
      }

      &.year {
        padding: 24px;
        width: 265px;
        height: 136px;
        margin-top: 24px;
      }

      .content {
        padding-top: 5px;
        flex-direction: column;
        justify-content: flex-end;
        width: 100%;
      }

      .header {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }

      .progress-percent {
        margin-bottom: 4px;

        &.reverse {
          margin: 4px 0 0;
          order: 1;
        }
      }
    }

    &.row {
      align-items: center;

      .content {
        flex-direction: row;
        align-items: flex-end;
        height: 18px;
        order: 2;
      }

      .ratio {
        order: 1;
      }

      .icon {
        order: 3;
      }

      .progress-percent {
        padding-right: 10px;
        position: relative;
        bottom: -2px;
      }

      .progress-bar {
        width: 140px;
      }
    }
  }

  .content {
    display: flex;
  }
</style>
