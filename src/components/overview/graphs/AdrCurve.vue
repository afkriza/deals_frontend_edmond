<template>
  <OverviewSidebarGraph
    :default-tooltip-style="false"
    :height="height"
    :layout="layout"
    :traces="traces"
    :width="width"
    @hover="onHover"
  >
    <template #tooltip>
      <div>
        <div v-if="tooltipInfo.data.thisYearAdr" :class="$style.tooltip">
          <div :class="$style.info">
            <div>
              <span :class="$style.bold">{{
                tooltipInfo.data.daysBefore
              }}</span>
              <span :class="$style.light">
                {{ tooltipInfo.data.daysBefore === 1 ? 'day' : 'days' }}
                before</span
              >
            </div>
            <span :class="[$style.bold, $style.thisYear]">{{
              tooltipInfo.data.date
            }}</span>
          </div>
          <div :class="$style.footer">
            <span :class="$style.light">ADR</span>
            <span :class="$style.bold"
              >{{ tooltipInfo.data.thisYearAdr }} €</span
            >
          </div>
        </div>
        <div v-if="tooltipInfo.data.lastYearAdr" :class="$style.tooltip">
          <div :class="$style.info">
            <div>
              <span :class="$style.bold">{{
                tooltipInfo.data.daysBefore
              }}</span>
              <span :class="$style.light">
                {{ tooltipInfo.data.daysBefore === 1 ? 'day' : 'days' }}
                before</span
              >
            </div>
            <span :class="[$style.bold, $style.lastYear]">{{
              tooltipInfo.data.lastYearDate
            }}</span>
          </div>
          <div :class="$style.footer">
            <span :class="$style.light">ADR</span>
            <span :class="$style.bold"
              >{{ tooltipInfo.data.lastYearAdr }} €</span
            >
          </div>
        </div>
      </div>
    </template>
  </OverviewSidebarGraph>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import OverviewSidebarGraph from '@/components/overview/graphs/OverviewSidebarGraph.vue';
  import { ORANGE, SHARP_BLUE } from '@/constants/overview-graph-colors';
  import {
    DEFAULT_GRAPH_HEIGHT,
    DEFAULT_LINE_SMOOTHING
  } from '@/constants/overview';
  import { formatNumber } from '@/utils/format';
  import format from 'date-fns/format';
  import subDays from 'date-fns/subDays';
  import subYears from 'date-fns/subYears';

  @Component({
    name: 'AdrCurve',
    components: {
      OverviewSidebarGraph
    }
  })
  export default class AdrCurve extends Vue {
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
    readonly bookingWindow: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly currentDailyRate: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly currentCumulativeRate: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly historyCumulativeRate: number[];

    @Prop({ type: Date, default: () => new Date() })
    private readonly date: Date;

    tooltipInfo = {
      data: {
        thisYearAdr: null,
        lastYearAdr: null,
        daysBefore: null,
        date: null,
        lastYearDate: null
      }
    };

    get traces() {
      return [
        {
          mode: 'lines',
          x: this.bookingWindow,
          y: this.currentCumulativeRate,
          name: 'This year ADR',
          hoverinfo: 'none',
          connectgaps: true,
          line: {
            color: SHARP_BLUE,
            shape: 'spline',
            smoothing: DEFAULT_LINE_SMOOTHING
          }
        },
        {
          mode: 'lines',
          x: this.bookingWindow,
          y: this.historyCumulativeRate,
          name: 'Last year ADR',
          hoverinfo: 'none',
          connectgaps: true,
          line: {
            color: ORANGE,
            shape: 'spline',
            smoothing: DEFAULT_LINE_SMOOTHING
          }
        },
        {
          type: 'scatter',
          mode: 'markers',
          x: this.bookingWindow,
          y: this.currentDailyRate,
          name: 'Current ADR',
          hoverinfo: 'none',
          marker: {
            color: SHARP_BLUE,
            size: 10,
            opacity: 0.8
          }
        }
      ];
    }

    get layout() {
      return {
        margin: {
          t: 20
        },
        yaxis: {
          title: { text: 'ADR' },
          nticks: 6
        },
        xaxis: {
          title: { text: 'Days before arrival' },
          autorange: 'reversed',
          rangemode: 'tozero',
          nticks: 8
        },
        hovermode: 'x',
        legend: {
          traceorder: 'reversed',
          y: -0.35
        }
      };
    }

    onHover(e) {
      this.tooltipInfo.data.thisYearAdr = null;
      this.tooltipInfo.data.lastYearAdr = null;

      const { points } = e;

      const { x } = points[0];

      this.tooltipInfo.data.daysBefore = x;
      const date = subDays(this.date, parseInt(x));
      this.tooltipInfo.data.date = format(date, 'd.M.yyyy');
      this.tooltipInfo.data.lastYearDate = format(
        subYears(date, 1),
        'd.M.yyyy'
      );

      for (const point of points) {
        const { curveNumber, y } = point;

        switch (curveNumber) {
          case 1:
            this.tooltipInfo.data.lastYearAdr = formatNumber(y);
            break;
          case 2:
            this.tooltipInfo.data.thisYearAdr = formatNumber(y);
            break;
        }
      }
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .tooltip {
    border: 1px solid #e3e4e5;
    background-color: $color-bg-light;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    white-space: pre-line;
    line-height: 20px;
    min-width: max-content;
  }

  .this-year {
    color: #5568e0;
    margin-top: 4px;
  }

  .last-year {
    color: #fa775c;
  }

  .bold {
    font-weight: bold;
  }

  .tooltip + .tooltip {
    margin-top: 4px;
  }

  .info {
    padding: 8px 12px 6px;
  }

  .footer {
    padding: 6px 12px 8px;
    border-top: 1px solid #e3e4e5;

    > * + * {
      margin-left: 16px;
    }
  }

  .light {
    color: $color-text-main-light;
  }
</style>
