<template>
  <div ref="container" :class="$style.container">
    <div
      :class="$style.annotation"
      :style="generateOffsetStyle(breakEvenAnnotationOffset)"
    >
      <div ref="breakEvenPriceHead" :class="$style.head">
        Break even price <b>€{{ formatNumber(breakEvenPrice) }}</b>
      </div>
      <div :class="$style.line"></div>
    </div>
    <div
      :class="$style.annotation"
      :style="generateOffsetStyle(recommendedAnnotationOffset)"
    >
      <div ref="recommendedPriceHead" :class="$style.head">
        Recommended <b>€{{ formatNumber(recommendedPrice) }}</b>
      </div>
      <div :class="$style.line"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
  import { formatNumber } from '@/utils/format';

  const DELTA = 1;

  @Component({
    methods: {
      formatNumber
    }
  })
  export default class AnalysisCalculatorUnitPriceRecommended extends Vue {
    @Prop({
      type: Number,
      required: true
    })
    readonly breakEvenPrice: number;

    @Prop({
      type: Number,
      required: true
    })
    readonly recommendedPrice: number;

    @Prop({
      type: Number,
      required: true
    })
    readonly min: number;

    @Prop({
      type: Number,
      required: true
    })
    readonly max: number;

    @Ref('container')
    readonly containerEl: HTMLDivElement;

    @Ref('breakEvenPriceHead')
    readonly breakEvenPriceHeadEl: HTMLDivElement;

    @Ref('recommendedPriceHead')
    readonly recommendedPriceHeadEl: HTMLDivElement;

    get breakEvenAnnotationOffset() {
      return this.priceRatio(this.breakEvenPrice);
    }

    get recommendedAnnotationOffset() {
      return this.priceRatio(this.recommendedPrice);
    }

    priceRatio(price) {
      return (price - this.min) / (this.max - this.min);
    }

    generateOffsetStyle(offset) {
      return {
        '--offset': `${Math.max(Math.min(offset * 100, 100), 0)}%`
      };
    }

    updated() {
      const containerBounds = this.containerEl.getBoundingClientRect();
      const breakEvenPriceBounds =
        this.breakEvenPriceHeadEl.getBoundingClientRect();
      const recommendedPriceBounds =
        this.recommendedPriceHeadEl.getBoundingClientRect();

      if (containerBounds.left > breakEvenPriceBounds.left) {
        this.breakEvenPriceHeadEl.style.left = `${
          containerBounds.left - breakEvenPriceBounds.left
        }px`;
        this.breakEvenPriceHeadEl.style.right = 'unset';
      } else if (containerBounds.right < breakEvenPriceBounds.right) {
        this.breakEvenPriceHeadEl.style.right = `${
          breakEvenPriceBounds.right - containerBounds.right
        }px`;
        this.breakEvenPriceHeadEl.style.left = 'unset';
      } else if (
        Math.abs(containerBounds.right - breakEvenPriceBounds.right) > DELTA &&
        Math.abs(containerBounds.left - breakEvenPriceBounds.left) > DELTA
      ) {
        this.breakEvenPriceHeadEl.style.left = 'unset';
        this.breakEvenPriceHeadEl.style.right = 'unset';
      }
      if (containerBounds.left > recommendedPriceBounds.left) {
        this.recommendedPriceHeadEl.style.left = `${
          containerBounds.left - recommendedPriceBounds.left
        }px`;
        this.recommendedPriceHeadEl.style.right = 'unset';
      } else if (containerBounds.right < recommendedPriceBounds.right) {
        this.recommendedPriceHeadEl.style.right = `${
          recommendedPriceBounds.right - containerBounds.right
        }px`;
        this.recommendedPriceHeadEl.style.left = 'unset';
      } else if (
        Math.abs(containerBounds.right - recommendedPriceBounds.right) >
          DELTA &&
        Math.abs(containerBounds.left - recommendedPriceBounds.left) > DELTA
      ) {
        this.recommendedPriceHeadEl.style.left = 'unset';
        this.recommendedPriceHeadEl.style.right = 'unset';
      }
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';
  .container {
    display: flex;
    align-items: flex-end;

    background: radial-gradient(
      50% 100% at 50% 100%,
      rgba(98, 217, 201, 0.2) 0%,
      rgba(98, 217, 201, 0) 100%
    );
  }

  .annotation {
    @include column;

    $head-size: 160px;

    position: absolute;

    color: #98ebc9;

    height: 80%;

    left: calc(var(--offset) - calc(#{$head-size} / 2));

    .head {
      @include row;
      justify-content: space-between;

      position: relative;

      width: $head-size;
      border: 1px solid #98ebc9;
      padding: 4px 10px;
      border-radius: 4px;
    }

    .line {
      flex: 1;
      align-self: center;
      width: 0;
      border-left: 1px solid;
    }

    &:first-child {
      height: 55%;
    }

    &:last-child {
      .head {
        color: $color-text-main;
        background-color: #98ebc9;
      }
    }
  }
</style>
