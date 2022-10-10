<template>
  <div>
    <OverviewSidebarGraph
      :height="height * 0.6"
      :layout="layout"
      :traces="traces"
      :width="width"
      :default-tooltip-style="false"
      @hover="onHover"
    >
      <template #tooltip>
        <div v-if="tooltipInfo.tooltip === 'line'">
          <div v-if="tooltipInfo.data.thisYearBooking" :class="$style.tooltip">
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
              <span :class="$style.light">Booking</span>
              <span :class="$style.bold">{{
                tooltipInfo.data.thisYearBooking
              }}</span>
            </div>
          </div>
          <div v-if="tooltipInfo.data.lastYearBooking" :class="$style.tooltip">
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
              <span :class="$style.light">Booking</span>
              <span :class="$style.bold">{{
                tooltipInfo.data.lastYearBooking
              }}</span>
            </div>
          </div>
        </div>
        <div v-else :class="[$style.tooltip, $style.tooltipBar]">
          <span :class="$style.light">Booking</span>
          <span :class="$style.bold">{{
            tooltipInfo.data.booking > 0
              ? `+${tooltipInfo.data.booking}`
              : tooltipInfo.data.booking
          }}</span>
        </div>
      </template>
    </OverviewSidebarGraph>
    <OverviewSidebarGraph
      :height="height * 0.4"
      :layout="layoutBar"
      :traces="tracesBar"
      :width="width"
      @hover="onHoverBar"
    >
      <template #tooltip>
        <div
          v-if="tooltipInfo.tooltip === 'bar'"
          :class="[$style.tooltip, $style.tooltipBar]"
        >
          <div :class="$style.row">
            <div :class="[$style.column, $style.light]">
              <span>Last year pickup</span>
              <span>This year pickup</span>
            </div>
            <div :class="$style.column">
              <b>{{ tooltipInfo.data.lastYearPickup }}</b>
              <b>{{ tooltipInfo.data.thisYearPickup }}</b>
            </div>
          </div>
        </div>
      </template>
    </OverviewSidebarGraph>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { Plotly } from 'vue-plotly';
  import { forEach } from 'lodash';
  import OverviewSidebarGraph from '@/components/overview/graphs/OverviewSidebarGraph.vue';
  import {
    ORANGE,
    SHARP_BLUE,
    ZEROLINE_COLOR
  } from '@/constants/overview-graph-colors';
  import {
    DEFAULT_LINE_SMOOTHING,
    STACKED_GRAPH_HEIGHT
  } from '@/constants/overview';
  import { formatNumber } from '@/utils/format';
  import subDays from 'date-fns/subDays';
  import format from 'date-fns/format';
  import subYears from 'date-fns/subYears';

  @Component({
    name: 'BookingCurve',
    components: {
      OverviewSidebarGraph,
      Plotly
    }
  })
  export default class BookingCurve extends Vue {
    @Prop({
      type: Number
    })
    readonly width: number;

    @Prop({
      type: Number,
      default: STACKED_GRAPH_HEIGHT
    })
    readonly height: number;

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly bookingCurrentX: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly bookingCurrentY: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly bookingPastX: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly bookingPastY: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly paceXCurrent: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly paceYCurrent: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly paceXPast: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly paceYPast: number[];

    @Prop({ type: Date, default: () => new Date() })
    readonly date: Date;

    tooltipInfo = {
      data: {
        thisYearBooking: null,
        lastYearBooking: null,
        thisYearPickup: null,
        lastYearPickup: null,
        daysBefore: null,
        date: null,
        lastYearDate: null,
        booking: null
      },
      tooltip: 'line'
    };

    get traces() {
      return [
        {
          type: 'scatter',
          mode: 'lines',
          x: this.bookingCurrentX,
          y: this.bookingCurrentY,
          name: 'This year booking',
          hoverinfo: 'none',
          line: {
            color: SHARP_BLUE,
            shape: 'spline',
            smoothing: DEFAULT_LINE_SMOOTHING
          },
          connectgaps: true
        },
        {
          type: 'scatter',
          mode: 'lines',
          x: this.bookingPastX,
          y: this.bookingPastY,
          name: 'Last year booking',
          hoverinfo: 'none',
          line: {
            color: ORANGE,
            shape: 'spline',
            smoothing: DEFAULT_LINE_SMOOTHING
          },
          connectgaps: true
        }
      ];
    }

    get tracesBar() {
      return [
        {
          type: 'bar',
          x: this.paceXCurrent,
          y: this.paceYCurrent,
          orientation: 'h',
          marker: { color: SHARP_BLUE },
          hoverinfo: 'none',
          name: 'This year pickup'
        },
        {
          type: 'bar',
          x: this.paceXPast,
          y: this.paceYPast,
          orientation: 'h',
          marker: { color: ORANGE },
          hoverinfo: 'none',
          name: 'Last year pickup'
        }
      ];
    }

    get layout() {
      return {
        margin: {
          b: 80
        },
        yaxis: {
          title: { text: 'Booking' }
        },
        xaxis: {
          title: { text: 'Days before arrival' },
          autorange: 'reversed',
          rangemode: 'tozero',
          showspikes: true,
          spikecolor: '#C8CACC',
          spikedash: 'solid',
          spikemode: 'across',
          spikesnap: 'cursor',
          spikethickness: 1
        },
        legend: {
          traceorder: 'reversed',
          y: -0.4
        },
        hovermode: 'x'
      };
    }

    get layoutBar() {
      return {
        margin: {
          t: 10,
          b: 60
        },
        yaxis: {
          title: { text: 'Days' },
          type: 'category',
          showgrid: false
        },
        xaxis: {
          title: { text: 'Pickup' },
          zeroline: true,
          showgrid: true,
          zerolinecolor: ZEROLINE_COLOR
        },
        legend: {
          traceorder: 'reversed',
          y: -0.9
        },
        hovermode: 'y',
        bargap: 0.3
      };
    }

    onHover(e) {
      const [point] = e.points;

      if (point.data.type === 'bar') {
        const { x } = point;
        this.tooltipInfo.data.booking = x;
        this.tooltipInfo.tooltip = 'bar';
      } else {
        this.tooltipInfo.data.thisYearBooking = null;
        this.tooltipInfo.data.lastYearBooking = null;

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
              this.tooltipInfo.data.lastYearBooking = formatNumber(y);
              break;
            case 0:
              this.tooltipInfo.data.thisYearBooking = formatNumber(y);
              break;
          }
        }
        this.tooltipInfo.tooltip = 'line';
      }
    }

    onHoverBar(e) {
      const points = e.points;

      let thisYearPickup = 0;
      let lastYearPickup = 0;
      forEach(points, p => {
        const { x } = p;
        if (p.curveNumber === 0) {
          thisYearPickup = x;
        } else {
          lastYearPickup = x;
        }
      });

      this.tooltipInfo.data.thisYearPickup = thisYearPickup;
      this.tooltipInfo.data.lastYearPickup = lastYearPickup;
      this.tooltipInfo.tooltip = 'bar';
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

  .column {
    @include column;
  }

  .row {
    @include row;
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

  .tooltip-bar {
    padding: 8px 12px;

    .row > * + * {
      margin-left: 16px;
    }
  }
</style>
