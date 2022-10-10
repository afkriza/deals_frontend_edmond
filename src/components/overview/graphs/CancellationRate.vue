<template>
  <div>
    <OverviewSidebarGraph
      :height="height"
      :layout="layout"
      :traces="traces"
      :width="width"
      @hover="onHover"
    >
      <template #tooltip>
        <div>
          <div :class="$style.column">
            <span :class="[$style.date, $style.bold]">{{
              tooltipInfo.data.date
            }}</span>
            <span>{{ tooltipInfo.data.numberOfDaysBefore }} days before</span>
          </div>
          <div :class="$style.wrapper">
            <span :class="$style.light">Cancellation rate</span>
            <span :class="[$style.rate, $style.bold]">{{
              tooltipInfo.data.cancellationRate
            }}</span>
          </div>
        </div>
      </template>
    </OverviewSidebarGraph>
    <div :class="$style.expectedCancellations">
      <span>Expected cancellations</span>
      <b>{{ expectedCancellationsFormatted }} units</b>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { Plotly } from 'vue-plotly';
  import OverviewSidebarGraph from '@/components/overview/graphs/OverviewSidebarGraph.vue';
  import {
    DARK_BLUE,
    ORANGE,
    PURPLE,
    SHARP_BLUE,
    TEXT_MAIN,
    TEXT_MAIN_LIGHT,
    YELLOW
  } from '@/constants/overview-graph-colors';
  import {
    DEFAULT_LINE_SMOOTHING,
    STACKED_GRAPH_HEIGHT
  } from '@/constants/overview';
  import format from 'date-fns/format';
  import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
  import { subDays, subYears } from 'date-fns';

  @Component({
    name: 'CancellationRate',
    components: {
      Plotly,
      OverviewSidebarGraph
    }
  })
  export default class CancellationRate extends Vue {
    @Prop({
      type: Number
    })
    readonly width: number;

    @Prop({
      type: Number,
      default: STACKED_GRAPH_HEIGHT
    })
    readonly height: number;

    @Prop({ type: Date, required: true })
    readonly date: Date;

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly bookingWindow: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly cancellationRate: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly pieLabels: string[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly pieValuesCurrent: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly pieValuesHistory: number[];

    @Prop({
      type: Boolean
    })
    readonly showPie: boolean;

    @Prop({
      type: Number
    })
    readonly expectedCancellations: number;

    tooltipInfo = {
      data: {
        cancellationRate: null,
        date: null,
        numberOfDaysBefore: null
      }
    };

    get expectedCancellationsFormatted() {
      return this.expectedCancellations ?? '?';
    }

    get pieTraces() {
      return [
        {
          values: this.pieValuesCurrent,
          labels: this.pieLabels,
          type: 'pie',
          domain: {
            x: [0.05, 0.35],
            y: [0.7, 1]
          },
          textinfo: 'label+percent',
          texttemplate: `%{label}<br><b style="color: ${TEXT_MAIN}">%{percent}</b>`,
          pull: 0.04,
          marker: {
            colors: [PURPLE, SHARP_BLUE]
          },
          title: {
            text: '<b>Current</b><br> ',
            font: { color: SHARP_BLUE }
          },
          hoverinfo: 'skip',
          textposition: 'outside',
          outsidetextfont: {
            color: TEXT_MAIN_LIGHT
          }
        },
        {
          values: this.pieValuesHistory,
          labels: this.pieLabels,
          type: 'pie',
          domain: {
            x: [0.65, 0.95],
            y: [0.7, 1]
          },
          textinfo: 'label+percent',
          texttemplate: `%{label}<br><b style="color: ${TEXT_MAIN}">%{percent}</b>`,
          pull: 0.04,
          marker: {
            colors: [YELLOW, ORANGE]
          },
          title: {
            text: '<b>History</b><br> ',
            font: { color: ORANGE }
          },
          hoverinfo: 'skip',
          textposition: 'outside',
          outsidetextfont: {
            color: TEXT_MAIN_LIGHT,
            size: 12
          }
        }
      ];
    }

    get traces() {
      return [
        {
          type: 'scatter',
          mode: 'lines',
          x: this.bookingWindow,
          y: this.cancellationRate,
          hoverinfo: 'none',
          showlegend: false,
          connectgaps: true,
          line: {
            color: ORANGE,
            shape: 'spline',
            smoothing: DEFAULT_LINE_SMOOTHING
          }
        },
        ...(this.showPie ? this.pieTraces : [])
      ];
    }

    get shapes() {
      return [
        {
          type: 'line',
          x0: this.daysAfterToday,
          x1: this.daysAfterToday,
          y0: 0,
          y1: this.showPie ? 0.6 : 1,
          xref: 'x',
          yref: 'paper',
          line: {
            color: '#6D757E',
            width: 2
          }
        }
      ];
    }

    get annotations() {
      return [
        {
          x: this.daysAfterToday,
          y: this.showPie ? 0.625 : 1.125,
          xref: 'x',
          yref: 'paper',
          text: '<b>Today</b>',
          showarrow: false,
          font: {
            color: DARK_BLUE
          }
        }
      ];
    }

    get layout() {
      const layout = {
        margin: {
          t: 30,
          r: 20,
          b: -20
        },
        yaxis: {
          nticks: 6,
          title: { text: 'Cancellation rate' },
          domain: [0, 0.95],
          tickformat: ',.0%'
        },
        xaxis: {
          title: { text: 'Days before arrival' },
          autorange: 'reversed',
          rangemode: 'tozero'
        },
        showlegend: false,
        shapes: [],
        annotations: []
      };

      if (this.daysAfterToday >= 0) {
        layout.shapes = this.shapes;
        layout.annotations = this.annotations;
      }

      if (this.showPie) {
        layout.yaxis.domain = [0, 0.6];
      }

      return layout;
    }

    get daysAfterToday() {
      return differenceInCalendarDays(this.date, new Date());
    }

    onHover(e) {
      const [point] = e.points;

      const { x, y } = point;

      this.tooltipInfo.data.cancellationRate = Math.round(y * 100) + '%';
      this.tooltipInfo.data.date = format(
        subYears(subDays(this.date, parseInt(x)), 1),
        'd.M.yyyy'
      );
      this.tooltipInfo.data.numberOfDaysBefore = x;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .column {
    @include column;
    padding: 8px 12px 6px;
  }

  .bold {
    font-weight: bold;
  }

  .date {
    margin-bottom: 4px;
  }

  .light {
    color: $color-text-main-light;
  }

  .rate {
    margin-left: 16px;
  }

  .wrapper {
    border-top: 1px solid $color-border-main-light;
    padding: 6px 12px 8px;
  }

  .expected-cancellations {
    @include row;
    justify-content: space-between;

    background: $color-bg-main-dimmed;
    border-radius: 4px;

    padding: 6px 12px;
  }
</style>
