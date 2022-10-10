<template>
  <div
    :class="[$style.bar, isOverflow ? $style.overflow : null, $style[theme]]"
    :style="{
      '--progressWidth': `${progressWidth}%`
    }"
  >
    <div :class="$style.row">
      <span
        :class="[
          $style.percentage,
          $style[theme],
          { [$style.missing]: isDataMissing }
        ]"
      >
        {{ percentageFormatted }}
      </span>
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { determineCardStatus } from '@/utils/overview';

  @Component
  export default class ProgressBarNew extends Vue {
    @Prop({
      type: Number
    })
    readonly actual: number;

    @Prop({
      type: Number
    })
    readonly expected: number;

    get isDataMissing() {
      return (
        this.expected === null || this.actual === null || this.expected === 0
      );
    }

    get percentage() {
      if (this.isDataMissing) {
        return null;
      }

      return Math.round((this.actual * 100) / this.expected);
    }

    get percentageFormatted() {
      if (this.isDataMissing) {
        return '?';
      }

      return this.percentage.toFixed(0);
    }

    get theme() {
      if (this.isDataMissing) {
        return null;
      }

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

  .bar {
    position: relative;
    height: 32px;
    border-radius: 4px;

    margin-left: 24px;

    min-width: 160px;

    background-color: $color-bg-main-light;

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
        top: 0;
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
      color: $color-text-main-light;
      z-index: 1;
      margin-left: 12px;

      &.bad,
      &.good {
        color: $color-text-light;
      }

      &.mid {
        color: $color-text-main;
      }

      &.missing {
        margin: 0 auto;
      }

      &:not(.missing)::after {
        position: relative;
        right: 3px;
        content: '%';
        font-size: 14px;
      }
    }

    .row {
      @include row;
      align-items: center;
      height: 100%;
    }
  }
</style>
