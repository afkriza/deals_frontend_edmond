<template>
  <div :class="$style.wrapper">
    <template v-if="loading">
      <SkeletonLoader :class="$style.skeleton" />
    </template>
    <template v-else>
      <div
        :class="[
          $style.bar,
          isOverflow ? $style.overflow : null,
          $style[theme],
          {
            [$style.missing]: isDataMissing
          }
        ]"
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
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import CardIcon from '@/components/overview/CardIcon.vue';
  import { determineCardStatus } from '@/utils/overview';
  import SkeletonLoader from '@/components/core/SkeletonLoader.vue';

  @Component({
    name: 'HeaderProgressBar',
    components: {
      SkeletonLoader,
      CardIcon
    }
  })
  export default class HeaderProgressBar extends Vue {
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

    @Prop({
      type: Boolean
    })
    readonly loading: boolean;

    get percentage() {
      if (this.isDataMissing) {
        return null;
      }

      return Math.floor((this.actual * 100) / this.total);
    }

    get isDataMissing() {
      return this.total === null || this.actual === null || this.total === 0;
    }

    get percentageFormatted() {
      if (this.loading) {
        return null;
      }

      if (this.isDataMissing) {
        return '?';
      }

      return `${this.percentage.toFixed(0)}%`;
    }

    get theme() {
      if (this.loading || this.isDataMissing) {
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

  .wrapper {
    display: flex;
  }

  .skeleton {
    min-height: 32px;
    border-radius: 4px;
    flex: 1;
  }

  .bar {
    position: relative;
    min-height: 32px;
    border-radius: 4px;
    flex: 1;

    &.missing {
      background-color: $color-bg-primary-darker;
    }

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
      border-radius: 4px;
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
        border-radius: 4px;
      }
    }

    .percentage {
      font-weight: bold;
      font-size: 17px;
      line-height: 22px;
      color: $color-text-light;
      z-index: 1;
      margin-left: 12px;

      &.missing {
        margin: 0 auto;
        color: $color-text-main-lighter;
      }

      &.bad,
      &.good {
        color: $color-text-light;
      }

      &.mid {
        color: $color-text-main;
      }
    }

    .row {
      @include row;
      align-items: center;
      height: 100%;
    }
  }
</style>
