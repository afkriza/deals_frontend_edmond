<template>
  <PriceAnalysis ref="container" :class="$style.container" v-bind="graphData">
    <div
      :class="$style.annotation"
      :style="generateOffsetStyle(q1AnnotationOffset)"
    >
      <div ref="q1Head" :class="$style.head">
        Q1 <b>€{{ Math.round(graphData.q1Price) }}</b>
      </div>
      <div :class="$style.line"></div>
    </div>
    <div
      :class="$style.annotation"
      :style="generateOffsetStyle(medianAnnotationOffset)"
    >
      <div :class="$style.head">
        Median <b>€{{ Math.round(graphData.medianPrice) }}</b>
      </div>
      <div :class="$style.line"></div>
    </div>
    <div
      :class="$style.annotation"
      :style="generateOffsetStyle(q3AnnotationOffset)"
    >
      <div ref="q3Head" :class="$style.head">
        Q3 <b>€{{ Math.round(graphData.q3Price) }}</b>
      </div>
      <div :class="$style.line"></div>
    </div>
  </PriceAnalysis>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
  import PriceAnalysis from '@/components/groups/PriceAnalysis.vue';
  import VueSlider from 'vue-slider-component';
  import { Range } from '@/models/analysis/AnalysisCalculator.model';

  @Component({
    components: { PriceAnalysis, VueSlider }
  })
  export default class AnalysisCalculatorUnitPriceHistoryData extends Vue {
    @Prop({
      type: Array,
      required: true
    })
    readonly count: number[];

    @Prop({
      type: Array,
      required: true
    })
    readonly prices: number[];

    @Prop({
      type: Number,
      required: true
    })
    readonly median: number;

    @Prop({
      type: Number,
      required: true
    })
    readonly q1: number;

    @Prop({
      type: Number,
      required: true
    })
    readonly q3: number;

    @Prop({
      type: Object,
      required: true
    })
    readonly range: Range;

    @Ref('container')
    readonly containerEl: PriceAnalysis;

    @Ref('q1Head')
    readonly q1HeadEl: HTMLDivElement;

    @Ref('q3Head')
    readonly q3HeadEl: HTMLDivElement;

    get graphData() {
      return {
        prices: this.prices,
        bookings: this.count,
        q1Price: this.q1,
        q3Price: this.q3,
        medianPrice: this.median
      };
    }

    get minPrice() {
      return this.range.from;
    }

    get maxPrice() {
      return this.range.to;
    }

    get q1AnnotationOffset() {
      return this.priceRatio(this.graphData.q1Price);
    }

    get q3AnnotationOffset() {
      return this.priceRatio(this.graphData.q3Price);
    }

    get medianAnnotationOffset() {
      return this.priceRatio(this.graphData.medianPrice);
    }

    priceRatio(price) {
      return (price - this.minPrice) / (this.maxPrice - this.minPrice);
    }

    generateOffsetStyle(offset) {
      return {
        '--offset': `${offset * 100}%`
      };
    }

    layoutAnnotations() {
      const containerBounds = this.containerEl.$el.getBoundingClientRect();
      const q1HeadBounds = this.q1HeadEl.getBoundingClientRect();
      const q3HeadBounds = this.q3HeadEl.getBoundingClientRect();

      this.q1HeadEl.style.left = `${Math.max(
        containerBounds.left - q1HeadBounds.left,
        0
      )}px`;

      this.q3HeadEl.style.right = `${Math.max(
        q3HeadBounds.right - containerBounds.right,
        0
      )}px`;
    }

    mounted() {
      this.layoutAnnotations();
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    display: flex;
    align-items: flex-end;
  }

  .annotation {
    @include column;

    --head-size: 160px;

    position: absolute;

    color: $color-text-light;

    left: calc(var(--offset) - calc(var(--head-size) / 2));

    &:nth-child(2) {
      --head-size: 85px;
      height: 60%;
    }

    &:nth-child(3) {
      --head-size: 112px;
      height: 80%;
    }

    &:nth-child(4) {
      --head-size: 85px;
      height: 70%;
    }

    .head {
      @include row;
      justify-content: space-between;

      position: relative;

      width: var(--head-size);
      border: 1px solid #fa775c;
      background-color: #fa775c;
      padding: 4px 10px;
      border-radius: 4px;

      z-index: 1;
    }

    .line {
      flex: 1;
      align-self: center;
      width: 0;
      border-left: 1px solid #fa775c;
    }
  }
</style>
