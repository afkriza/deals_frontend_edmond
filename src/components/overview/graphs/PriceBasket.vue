<template>
  <OverviewSidebarGraph
    :height="height"
    :layout="layout"
    :traces="traces"
    :width="width"
    @hover="onHover"
  >
    <template #tooltip>
      <div :class="$style.tooltip">
        <span v-html="tooltipInfo.data.text"></span>
      </div>
    </template>
  </OverviewSidebarGraph>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { map, slice, sum, sumBy, unzip, zip } from 'lodash';
  import OverviewSidebarGraph from '@/components/overview/graphs/OverviewSidebarGraph.vue';
  import { GRID_COLOR } from '@/constants/overview-graph-colors';
  import { DEFAULT_GRAPH_HEIGHT } from '@/constants/overview';

  @Component({
    name: 'PriceBasket',
    components: {
      OverviewSidebarGraph
    }
  })
  export default class PriceBasket extends Vue {
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
      default: () => [],
      required: true
    })
    readonly scores: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly scoreValues: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly scoreBreakdownValues: number[][];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly scoreBreakdownCategories: string[];

    COLORS = ['#F23DB0', '#B954EB', '#DC76E3', '#FFA1D8'];
    tooltipInfo = {
      data: {
        text: null
      }
    };

    get scoreBreakdownValuesTransposed() {
      return unzip(this.scoreBreakdownValues);
    }

    get priceBasketTrace() {
      return {
        type: 'bar',
        x: this.scoreValues,
        y: this.scores,
        orientation: 'h',
        marker: {
          color: '#FAFAFA',
          line: {
            color: '#C8CACC',
            width: 1
          }
        },
        hoverinfo: 'none',
        showlegend: false
      };
    }

    get priceBasketBreakdownTraces() {
      return map(
        zip(this.scoreBreakdownValuesTransposed, this.scoreBreakdownCategories),
        ([values, category], idx) => ({
          type: 'bar',
          x: values,
          y: this.scores,
          orientation: 'h',
          marker: {
            color: this.COLORS[idx]
          },
          hoverinfo: 'none',
          base: this.calculateBase(values, idx),
          name: category
        })
      );
    }

    get traces() {
      return [this.priceBasketTrace, ...this.priceBasketBreakdownTraces];
    }

    get layout() {
      return {
        margin: {
          r: 20
        },
        yaxis: {
          type: 'category',
          title: { text: 'Price' },
          showgrid: false
        },
        xaxis: {
          zeroline: true,
          zerolinecolor: GRID_COLOR,
          showgrid: true
        },
        legend: {
          traceorder: 'normal',
          y: -0.15
        },
        hovermode: 'y',
        barmode: 'stack',
        shapes: [
          {
            type: 'line',
            xref: 'paper',
            yref: 'paper',
            x0: 0,
            x1: 1,
            y0: 0,
            y1: 0,
            line: {
              color: GRID_COLOR,
              width: 1
            }
          }
        ]
      };
    }

    calculateBase(values: number[], idx: number) {
      if (!idx) {
        return Array(values.length).fill(0);
      }

      // sums arrays by column [[1, 0, 1, 0], [1, 2, 3, 4]] results in [2, 2, 4, 4] - what we need to calculate base
      return map(
        unzip(slice(this.scoreBreakdownValuesTransposed, 0, idx)),
        sum
      );
    }

    onHover(e) {
      const points = e.points;
      const [lastYearTrace, ...breakdownTraces] = points;

      const [moreThan30, ...lessThan30] = breakdownTraces;

      const lessThan30Sum = sumBy(
        lessThan30,
        ({ value, base }) => value - base
      );
      const moreThan30Sum = moreThan30.value;
      const lastYearSum = lastYearTrace.value;

      let text = '';
      if (lastYearSum <= moreThan30Sum + lessThan30Sum) {
        text = `<b>${moreThan30Sum +
          lessThan30Sum}</b> currently sold, <b>${lastYearSum}</b> sold last year`;
      } else {
        text = `Sell <b>${lastYearSum -
          (moreThan30Sum + lessThan30Sum)}</b> units at <b>${points[0].y}</b>€`;
      }

      this.tooltipInfo.data.text = text;
    }
  }
</script>

<style lang="scss" module>
  .tooltip {
    padding: 8px 12px;
  }
</style>
