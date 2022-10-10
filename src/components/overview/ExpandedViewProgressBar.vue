<template>
  <div :class="$style.wrapper">
    <div :class="$style.ratio">
      <div :class="$style.metric">
        <span>{{ numeratorMetric }}</span>
        <span>{{ formattedActual }}</span>
      </div>
      <div :class="$style.metric">
        <span>{{ denominatorMetric }}</span>
        <span>{{ formattedTotal }}</span>
      </div>
    </div>
    <div
      v-if="showProgressBar"
      :class="[$style.bar, isOverflow ? $style.overflow : null, $style[theme]]"
      :style="{
        '--progressWidth': `${progressWidth}%`
      }"
    >
      <div v-if="percentage !== null" :class="$style.row">
        <span :class="[$style.percentage, $style[theme]]">
          {{ percentage.toFixed(0) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import CardIcon from '@/components/overview/CardIcon.vue';
  import { determineCardStatus } from '@/utils/overview';

  @Component({
    name: 'ExpandedViewProgressBar',
    components: {
      CardIcon
    }
  })
  export default class ExpandedViewProgressBar extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly numeratorMetric: string;

    @Prop({
      type: String,
      required: true
    })
    readonly denominatorMetric: string;

    @Prop({
      type: Number,
      default: 0
    })
    readonly actual: number;

    @Prop({
      type: Number,
      default: 0
    })
    readonly total: number;

    get percentage() {
      if (this.total === null || this.actual === null) {
        return null;
      }

      if (this.total === 0) {
        return 100;
      }

      return Math.round((this.actual * 100) / this.total);
    }

    get showProgressBar() {
      return this.percentage !== null;
    }

    get formattedActual() {
      return this.actual === null ? '?' : this.actual.toLocaleString();
    }

    get formattedTotal() {
      return this.total === null || this.total === 0
        ? '?'
        : this.total.toLocaleString();
    }

    get theme() {
      return determineCardStatus(this.percentage);
    }

    get progressWidth() {
      return Math.min(this.percentage, 100);
    }

    get isOverflow() {
      return this.percentage >= 100;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .wrapper {
    display: flex;
  }

  .ratio {
    @include row;
    align-items: center;

    .metric {
      line-height: 20px;
      padding: 6px 16px;

      span:first-child {
        font-weight: bold;
        margin-right: 12px;
      }

      span:last-child {
        color: $color-text-main-light;
      }

      &:first-child {
        border-right: 1px solid $color-border-main-light;
      }
    }
  }

  .bar {
    position: relative;
    min-height: 32px;
    border-radius: 4px;
    flex: 1;

    margin-left: 24px;

    width: 160px;

    &.bad {
      background-color: $color-bad-darker;
    }

    &.mid {
      background-color: $color-mid-darker;
    }

    &.good {
      background-color: $color-good-darker;
    }

    &.bad::before {
      background-color: $color-bad-regular;
    }

    &.mid::before {
      background-color: $color-mid-regular;
    }

    &.good::before {
      background-color: $color-good-regular;
    }

    &::before {
      position: absolute;
      display: block;
      content: '';
      left: 0;
      top: 0;
      bottom: 0;
      width: var(--progressWidth);
      border-radius: 4px 0 0 4px;
    }

    &.overflow {
      background-color: rgba(0, 0, 0, 0);

      &::after {
        position: absolute;
        display: block;
        width: 8%; // 100% - 92%
        height: 100%;
        content: '';
        right: 0;
        background: linear-gradient(
          270deg,
          $progress-bar-shadow 0%,
          $color-good-regular 100%
        );
        border-radius: 4px 0 0 4px;
      }
    }

    .percentage {
      font-weight: bold;
      font-size: 17px;
      line-height: 22px;
      color: $color-text-light;
      z-index: 1;

      &.bad,
      &.good {
        color: $color-text-light;
      }

      &.mid {
        color: $color-text-main;
      }

      &::after {
        position: relative;
        right: 3px;
        content: '%';
        font-size: 14px;
      }
    }

    .row {
      @include row;
      align-items: center;
      justify-content: space-between;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto 0;
      left: 12px;
    }
  }
</style>
