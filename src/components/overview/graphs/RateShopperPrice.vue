<template>
  <OverviewSidebarGraph
    ref="sidebarGraph"
    :height="height"
    :layout="layout"
    :traces="traces"
    :width="width"
    @hover="onHover"
  >
    <template #tooltip>
      <div v-if="tooltipInfo.tooltip === 'violin'">
        <div :class="[$style.row, $style.gap, $style.top]">
          <span v-if="tooltipInfo.data.property" :class="$style.property">{{
            tooltipInfo.data.property
          }}</span>
          <span :class="$style.bold">{{ tooltipInfo.data.price }} €</span>
        </div>
        <div :class="[$style.row, $style.separator]">
          <div :class="[$style.column, $style.bottom]">
            <div :class="$style.compset">
              <span>
                <b>{{ tooltipInfo.data.numberOfProperties }} </b>
                <span :class="$style.light">properties in compset</span>
              </span>
            </div>
            <div :class="$style.row">
              <div :class="[$style.column, $style.light]">
                <span>Max</span>
                <span>Median</span>
                <span>Min</span>
              </div>
              <div :class="$style.column">
                <span>{{ tooltipInfo.data.max }} €</span>
                <span>{{ tooltipInfo.data.median }} €</span>
                <span>{{ tooltipInfo.data.min }} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else :class="$style.tooltipCurrentPrice">
        <span>{{ tooltipInfo.data.currentPrice }}</span>
      </div>
    </template>
  </OverviewSidebarGraph>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
  import { floor, map, max, min, size, zip } from 'lodash';
  import OverviewSidebarGraph from '@/components/overview/graphs/OverviewSidebarGraph.vue';
  import { formatNumber } from '@/utils/format';
  import { PINK, TEXT_MAIN_LIGHT } from '@/constants/overview-graph-colors';
  import { DEFAULT_GRAPH_HEIGHT } from '@/constants/overview';

  @Component({
    name: 'RateShopperPrice',
    components: {
      OverviewSidebarGraph
    }
  })
  export default class RateShopperPrice extends Vue {
    @Prop({
      type: Number
    })
    readonly width: number;

    @Prop({
      type: Number,
      default: DEFAULT_GRAPH_HEIGHT
    })
    readonly height: number;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly compset: string[];

    @Prop({
      type: Array,
      default: () => []
    })
    readonly currentPrices: number[];

    @Prop({
      type: Array,
      default: () => []
    })
    readonly priceMatrix: number[][];

    @Prop({
      type: Array,
      default: () => []
    })
    readonly properties: string[][];

    @Ref('sidebarGraph')
    readonly sidebarGraph: OverviewSidebarGraph;

    tooltipInfo = {
      data: {
        max: null,
        median: null,
        min: null,
        currentPrice: null,
        price: null,
        numberOfProperties: null,
        property: null
      },
      tooltip: null
    };

    get violinTraces() {
      return map(
        zip(this.compset, this.priceMatrix, this.properties),
        ([compset, prices, properties]) => ({
          type: 'violin',
          y: prices,
          customdata: properties,
          showlegend: false,
          hoverinfo: 'none',
          box: {
            visible: false,
            width: 0.1,
            fillcolor: '#131F2F',
            line: {
              width: 2
            }
          },
          marker: {
            opacity: 0.7,
            size: 8
          },
          meanline: {
            visible: false,
            color: '#FFFFFF',
            width: 2
          },
          line: {
            color: '#131F2F',
            width: 0
          },
          hoveron: 'violins+points',
          opacity: 0.85,
          fillcolor: '#9099fa',
          name: compset,
          points: 'all',
          pointpos: 0,
          jitter: 0
        })
      );
    }

    get currentPriceTrace() {
      return {
        type: 'scatter',
        x: this.compset,
        y: this.currentPrices,
        mode: 'markers',
        marker: {
          color: PINK,
          size: 8,
          opacity: 1
        },
        hoverinfo: 'none',
        name: 'Current price'
      };
    }

    get traces() {
      return [...this.violinTraces, this.currentPriceTrace];
    }

    get layout() {
      return {
        yaxis: {
          title: {
            text: 'Price'
          }
        },
        xaxis: {
          tickfont: { color: TEXT_MAIN_LIGHT }
        },
        showlegend: true,
        legend: {
          xanchor: 'center',
          x: 0.5,
          y: -0.25,
          orientation: 'h'
        }
      };
    }

    onHover(e) {
      const [point] = e.points;

      if (point.data.type === 'violin') {
        if (size(e.points) !== 1) {
          this.sidebarGraph.hideTooltip();
          return;
        }

        this.tooltipInfo.tooltip = 'violin';
        const ys = point.data.y;
        const property = point.customdata;

        this.tooltipInfo.data.max = formatNumber(max(ys));
        this.tooltipInfo.data.median = formatNumber(
          [...ys].sort((a, b) => a - b)[floor(size(ys) / 2)]
        );
        this.tooltipInfo.data.min = formatNumber(min(ys));
        this.tooltipInfo.data.price = formatNumber(point.y);
        this.tooltipInfo.data.property = property;
        this.tooltipInfo.data.numberOfProperties = size(ys);
      } else {
        this.tooltipInfo.tooltip = 'point';
        this.tooltipInfo.data.currentPrice = formatNumber(point.y);
      }
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .column {
    @include column;
  }

  .column + .column {
    margin-left: 16px;
  }

  .property {
    margin-right: 16px;
  }

  .separator {
    border-top: 1px solid #e3e4e5;
  }

  .row {
    @include row;
  }

  .compset {
    margin-bottom: 8px;
  }

  .top {
    padding: 8px 12px 6px;
  }

  .bottom {
    padding: 6px 12px 8px;
  }

  .gap {
    justify-content: space-between;
  }

  .light {
    color: $color-text-main-light;
  }

  .bold {
    font-weight: bold;
  }

  .tooltip-current-price {
    padding: 4px 16px;
    color: #f23db0;
    font-weight: bold;
  }
</style>
