<template>
  <OverviewSidebarGraph
    :height="height"
    :layout="layout"
    :traces="traces"
    :width="width"
    @hover="onHover"
  >
    <template #tooltip>
      <div :class="$style.column">
        <div
          v-if="tooltipInfo.data.property !== 'line'"
          :class="[$style.header, $style.bold]"
        >
          <span :style="tooltipStyle">{{ tooltipInfo.data.property }}</span>
        </div>
        <div :class="$style.info">
          <div :class="[$style.column, $style.light]">
            <span>Rating</span>
            <span>Price</span>
          </div>
          <div :class="$style.column">
            <span>{{ tooltipInfo.data.rating }}</span>
            <span>{{ tooltipInfo.data.price }} €</span>
          </div>
        </div>
      </div>
    </template>
  </OverviewSidebarGraph>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import OverviewSidebarGraph from '@/components/overview/graphs/OverviewSidebarGraph.vue';
  import { indexOf, isNull, map, max, min, zip } from 'lodash';
  import {
    GREENISH,
    PINK,
    SHARP_BLUE,
    TEXT_MAIN,
    TEXT_MAIN_LIGHT
  } from '@/constants/overview-graph-colors';
  import { linspace } from '@/utils/graph';
  import { formatNumber } from '@/utils/format';
  import { DEFAULT_GRAPH_HEIGHT } from '@/constants/overview';

  const Q1_COLOR = '#E5FAF2';
  const Q2_COLOR = '#FEEFE5';
  const Q3_COLOR = '#EEF0FF';
  const Q4_COLOR = '#FEEDEE';

  @Component({
    name: 'RateShopperPriceVsValue',
    components: {
      OverviewSidebarGraph
    }
  })
  export default class RateShopperPriceVsValue extends Vue {
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
      required: true,
      default: () => []
    })
    readonly x: number[];

    @Prop({
      type: Array,
      required: true,
      default: () => []
    })
    readonly y: number[];

    @Prop({
      type: Array,
      required: true,
      default: () => []
    })
    readonly properties: string[];

    @Prop({
      type: Array,
      required: true,
      default: () => []
    })
    readonly ourProperties: string[];

    @Prop({
      type: Number,
      default: null
    })
    readonly currentPrice: number | null;

    @Prop({
      type: Number,
      default: null
    })
    readonly predictedPrice: number | null;

    @Prop({
      type: Number,
      default: null
    })
    readonly currentScore: number | null;

    @Prop({
      type: Number
    })
    readonly a: number;

    @Prop({
      type: Number,
      required: true
    })
    readonly b: number;

    @Prop({
      type: Array,
      default: null
    })
    readonly xRange: [number, number];

    @Prop({
      type: Array,
      default: null
    })
    readonly yRange: [number, number];

    tooltipInfo = {
      data: {
        rating: null,
        price: null,
        property: null
      },
      color: ''
    };
    tooltipStyle = {
      color: ''
    };

    get priceDisplacement() {
      return this.predictedPrice - this.currentPrice;
    }

    get dotTraces() {
      return map(zip(this.properties, this.x, this.y), ([property, x, y]) => ({
        type: 'scatter',
        x: [x],
        y: [y],
        name: property,
        showlegend: false,
        // hovertemplate:
        //   '<span>%{fullData.name}, € %{y}, %{x}</span><extra></extra>',
        customdata: [this.isOurProperty(property) ? SHARP_BLUE : TEXT_MAIN],
        marker: {
          color: this.isOurProperty(property) ? SHARP_BLUE : '#6D757E',
          size: 8,
          opacity: this.isOurProperty(property) ? 1 : 0.65
        },
        hoverinfo: 'none'
      }));
    }

    get currentPriceTrace() {
      return {
        type: 'scatter',
        mode: 'markers',
        x: [this.currentScore],
        y: [this.currentPrice],
        hoverinfo: 'none',
        name: 'Current price',
        marker: {
          color: PINK,
          size: 8
        }
      };
    }

    get predictedPriceTrace() {
      return {
        type: 'scatter',
        mode: 'markers',
        x: [this.currentScore],
        y: [this.predictedPrice],
        hoverinfo: 'none',
        name: 'Predicted price',
        marker: {
          color: GREENISH,
          size: 8
        }
      };
    }

    get lineTrace() {
      const x = linspace(this.rangeX[0], this.rangeX[1]);

      const xCenter = (this.rangeX[0] + this.rangeX[1]) / 2;
      const yCenter = (this.rangeY[0] + this.rangeY[1]) / 2;
      const offset = this.a * xCenter + this.b - yCenter;

      const y = map(x, x => this.a * x + this.b); // y = a * x + b

      return {
        type: 'scatter',
        mode: 'lines',
        name: 'line',
        x,
        y,
        hoverinfo: 'none',
        showlegend: false,
        marker: {
          color: TEXT_MAIN
        }
      };
    }

    get traces() {
      const traces: any[] = this.dotTraces;

      if (!isNull(this.currentScore)) {
        if (!isNull(this.currentPrice)) {
          traces.push(this.currentPriceTrace);
        }

        if (!isNull(this.predictedPrice)) {
          traces.push(this.predictedPriceTrace);
        }
      }
      traces.push(this.lineTrace);

      return traces;
    }

    get minX() {
      if (this.xRange) {
        return this.xRange[0];
      }

      return min(this.x);
    }

    get maxX() {
      if (this.xRange) {
        return this.xRange[1];
      }

      return max(this.x);
    }

    get minY() {
      if (this.yRange) {
        return this.yRange[0];
      }

      return min(this.y);
    }

    get maxY() {
      if (this.yRange) {
        return this.yRange[1];
      }

      return max(this.y);
    }

    get offsetX() {
      return (this.maxX - this.minX) * 0.1;
    }

    get offsetY() {
      return (this.maxY - this.minY) * 0.1;
    }

    get rangeY() {
      return [this.minY, this.maxY];
      // return [this.minY - this.offsetY, this.maxY + this.offsetY];
    }

    get rangeX() {
      return [this.minX, this.maxX];
      // return [this.minX - this.offsetX, this.maxX + this.offsetX];
    }

    get quadrantsLegend() {
      return [
        this.createQuadrantLegendEntry(
          this.createLegendShape(0.03, 0.06, -0.375, -0.325, '#B2ECE4'),
          this.createLegendAnnotation(0.07, -0.4, 'Leaders')
        ),
        this.createQuadrantLegendEntry(
          this.createLegendShape(0.25, 0.28, -0.375, -0.325, '#FCD1B6'),
          this.createLegendAnnotation(0.29, -0.4, 'Overpriced')
        ),
        this.createQuadrantLegendEntry(
          this.createLegendShape(0.52, 0.55, -0.375, -0.325, '#BCC1FF'),
          this.createLegendAnnotation(0.56, -0.4, 'Followers')
        ),
        this.createQuadrantLegendEntry(
          this.createLegendShape(0.75, 0.78, -0.375, -0.325, '#FCB6BA'),
          this.createLegendAnnotation(0.79, -0.4, 'Underpriced')
        )
      ];
    }

    get priceDisplacementAnnotation() {
      return [
        {
          xref: 'paper',
          yref: 'paper',
          x: 0.02,
          xanchor: 'left',
          y: 0.98,
          yanchor: 'top',
          text: `Price displacement <b>${formatNumber(
            this.priceDisplacement
          )} €</b>`,
          showarrow: false,
          font: {
            size: 10,
            color: TEXT_MAIN
          }
        }
      ];
    }

    get annotations() {
      return [
        ...this.priceDisplacementAnnotation,
        ...map(this.quadrantsLegend, 'annotation')
      ];
    }

    get shapes() {
      return [
        this.createQuadrant(0.5, 1, 0.5, 1, Q1_COLOR),
        this.createQuadrant(0, 0.5, 0.5, 1, Q2_COLOR),
        this.createQuadrant(0, 0.5, 0, 0.5, Q3_COLOR),
        this.createQuadrant(0.5, 1, 0, 0.5, Q4_COLOR),
        this.createAxis(0, 1, 0.5, 0.5),
        this.createAxis(0.5, 0.5, 0, 1),
        ...map(this.quadrantsLegend, 'shape')
      ];
    }

    get layout() {
      return {
        margin: {
          t: 10,
          r: 10,
          l: 60,
          b: 10
        },
        yaxis: {
          title: { text: 'Price', standoff: 20 },
          showgrid: false,
          zeroline: false,
          tickfont: { color: TEXT_MAIN_LIGHT },
          ticklen: 8,
          range: this.rangeY
        },
        xaxis: {
          title: { text: 'Value' },
          tickfont: { color: TEXT_MAIN_LIGHT },
          range: this.rangeX
        },
        legend: {
          xref: 'paper',
          yref: 'paper',
          xanchor: 'left',
          yanchor: 'bottom',
          x: 0,
          y: -0.55
        },
        annotations: this.annotations,
        shapes: this.shapes
      };
    }

    createLegendAnnotation(x, y, text) {
      return {
        xref: 'paper',
        yref: 'paper',
        x,
        xanchor: 'left',
        y,
        yanchor: 'bottom',
        text,
        showarrow: false,
        font: {
          size: 12,
          color: TEXT_MAIN
        }
      };
    }

    createQuadrantLegendEntry(shape, annotation) {
      return { shape, annotation };
    }

    createQuadrant(x0, x1, y0, y1, fillcolor) {
      return {
        type: 'rect',
        yref: 'paper',
        xref: 'paper',
        x0,
        x1,
        y0,
        y1,
        fillcolor,
        line: {
          width: 0
        },
        layer: 'below'
      };
    }

    createAxis(x0, x1, y0, y1) {
      return {
        type: 'line',
        yref: 'paper',
        xref: 'paper',
        x0,
        x1,
        y0,
        y1,
        line: {
          color: '#E3E4E5',
          width: 2
        },
        layer: 'below'
      };
    }

    createLegendShape(x0, x1, y0, y1, fillcolor) {
      return {
        type: 'rect',
        xref: 'paper',
        yref: 'paper',
        x0,
        x1,
        y0,
        y1,
        fillcolor,
        line: { width: 0 },
        yanchor: 'bottom',
        xanchor: 'left'
      };
    }

    isOurProperty(property: string) {
      return indexOf(this.ourProperties, property) !== -1;
    }

    onHover(e) {
      const [point] = e.points;

      const {
        x,
        y,
        data: { name },
        customdata: color
      } = point;

      this.tooltipStyle.color =
        color ||
        e.points[0].fullData.marker?.color ||
        e.points[0].fullData.line?.color;

      this.tooltipInfo.data.rating = formatNumber(x);
      this.tooltipInfo.data.price = formatNumber(y);
      this.tooltipInfo.data.property = name;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .header {
    padding: 8px 12px 6px;

    border-bottom: 1px solid #e3e4e5;
  }

  .info {
    @include row;
    padding: 6px 12px 8px;
  }

  .bold {
    font-weight: bold;
  }

  .column {
    @include column;
  }

  .light {
    color: $color-text-main-light;
  }

  .column + .column {
    margin-left: 16px;
  }
</style>
