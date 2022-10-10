<template>
  <OverviewSidebarGraph
    :height="height"
    :layout="layout"
    :traces="traces"
    :width="width"
    @hover="onHover"
  >
    <template #tooltip>
      <div :class="$style.tooltip" :style="tooltipStyle">
        <span>{{ tooltipInfo.data.percentage }}</span>
      </div>
    </template>
  </OverviewSidebarGraph>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  import { last, size } from 'lodash';
  import OverviewSidebarGraph from '@/components/overview/graphs/OverviewSidebarGraph.vue';
  import {
    DARK_BLUE,
    GREENISH,
    MEDIUM_PURPLE,
    ORANGE,
    PURPLE
  } from '@/constants/overview-graph-colors';
  import { DEFAULT_GRAPH_HEIGHT } from '@/constants/overview';

  @Component({
    name: 'LongtermPredictions',
    components: {
      OverviewSidebarGraph
    }
  })
  export default class LongtermPredictions extends Vue {
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
      required: true
    })
    readonly years: number[];

    @Prop({
      type: Array,
      required: true
    })
    readonly historyRealisations: number[];

    @Prop({
      type: Number,
      required: true
    })
    readonly longtermPrediction: number;

    @Prop({
      type: Number,
      required: true
    })
    readonly currentEstimate: number;

    tooltipInfo = {
      data: {
        percentage: null
      }
    };
    tooltipStyle = {
      color: null
    };

    get historyRealisationsTrace() {
      return {
        x: this.years,
        y: this.historyRealisations,
        mode: 'markers',
        marker: {
          color: ORANGE,
          size: 12
        },
        hoverinfo: 'none',
        name: 'History realisation'
      };
    }

    get longtermPredictionYear() {
      return last(this.years) + 1;
    }

    get longtermPredictionTrace() {
      return {
        x: [this.longtermPredictionYear],
        y: [this.longtermPrediction],
        mode: 'markers',
        marker: {
          color: MEDIUM_PURPLE,
          size: 12
        },
        hoverinfo: 'none',
        name: 'Longterm prediction'
      };
    }

    get currentEstimateYear() {
      return this.longtermPredictionYear;
    }

    get currentEstimateTrace() {
      return {
        x: [this.currentEstimateYear],
        y: [this.currentEstimate],
        mode: 'markers',
        marker: {
          color: GREENISH,
          size: 12
        },
        hoverinfo: 'none',
        name: 'Current estimate  ' // Spaces are needed, otherwise legend entries get cut off
      };
    }

    get connectionTrace() {
      return {
        type: 'scatter',
        mode: 'lines',
        x: [...this.years, this.longtermPredictionYear],
        y: [...this.historyRealisations, this.longtermPrediction],
        hoverinfo: 'none',
        line: {
          width: 1,
          color: DARK_BLUE
        },
        showlegend: false,
        connectgaps: true
      };
    }

    get traces() {
      return [
        this.connectionTrace,
        this.historyRealisationsTrace,
        this.longtermPredictionTrace,
        this.currentEstimateTrace
      ];
    }

    get layout() {
      return {
        margin: {
          t: 10,
          b: 20
        },
        xaxis: {
          nticks: size(this.years) + 1,
          ticklen: 10,
          tickcolor: 'transparent',
          title: {
            text: 'Year'
          }
        },
        yaxis: {
          title: {
            text: 'Percentage of occupancy'
          },
          range: [0, 1.05],
          nticks: 0,
          tickformat: ',.0%'
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

      const { y } = point;

      this.tooltipInfo.data.percentage = Math.round(y * 100) + '%';
      this.tooltipStyle.color =
        e.points[0].fullData.marker?.color || e.points[0].fullData.line?.color;
    }
  }
</script>

<style lang="scss" module>
  .tooltip {
    padding: 4px 16px;
    font-weight: bold;
  }
</style>
