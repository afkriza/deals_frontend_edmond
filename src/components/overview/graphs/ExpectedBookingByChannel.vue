<template>
  <OverviewSidebarGraph
    :height="height"
    :layout="layout"
    :traces="traces"
    :width="width"
    @hover="onHover"
  >
    <template #tooltip>
      <div v-if="tooltipInfo.tooltip === 'box'" :class="$style.tooltipBox">
        <div :class="$style.column">
          <span>Max</span>
          <span>Median</span>
          <span>Min</span>
        </div>
        <div :class="$style.column">
          <span>{{ tooltipInfo.max }}</span>
          <span>{{ tooltipInfo.median }}</span>
          <span>{{ tooltipInfo.min }}</span>
        </div>
      </div>
      <div v-if="tooltipInfo.tooltip === 'point'" :class="$style.tooltipPoint">
        {{ tooltipInfo.point }}
      </div>
    </template>
  </OverviewSidebarGraph>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { head } from 'lodash';
  import {
    DARKER_BLUE,
    GREENISH,
    SHARP_BLUE,
    TEXT_MAIN_LIGHT
  } from '@/constants/overview-graph-colors';
  import OverviewSidebarGraph from '@/components/overview/graphs/OverviewSidebarGraph.vue';
  import { formatNumber } from '@/utils/format';
  import { DEFAULT_GRAPH_HEIGHT } from '@/constants/overview';

  @Component({
    name: 'ExpectedBookingByChannel',
    components: { OverviewSidebarGraph }
  })
  export default class ExpectedBookingByChannel extends Vue {
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
    readonly channels: string[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly median: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly q1: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly q3: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly min: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly max: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly booking: number[];

    tooltipInfo = {
      max: '',
      median: '',
      min: '',
      point: '',
      tooltip: null
    };

    get traces() {
      return [
        {
          type: 'box',
          x: this.channels,
          x0: head(this.channels),
          q1: this.q1,
          q3: this.q3,
          median: this.median,
          lowerfence: this.min,
          upperfence: this.max,
          width: 0.5,
          fillcolor: 'rgba(98,217,201,0.15)',
          marker: {
            color: DARKER_BLUE
          },
          line: {
            color: GREENISH
          },
          hoverinfo: 'none',
          showlegend: false
        },
        {
          type: 'scatter',
          x: this.channels,
          y: this.booking,
          mode: 'markers',
          hoverinfo: 'none',
          name: 'This year booking',
          marker: {
            color: SHARP_BLUE,
            size: 8
          }
        }
      ];
    }

    get layout() {
      return {
        margin: {
          b: 80
        },
        yaxis: {
          title: {
            text: 'Booking'
          },
          nticks: 8
        },
        xaxis: {
          title: {
            text: 'Market segment',
            standoff: 16
          },
          ticklen: 0,
          tickfont: { color: TEXT_MAIN_LIGHT }
        },
        legend: {
          y: -0.35
        }
      };
    }

    onHover(e) {
      const [point] = e.points;

      if (point.data.type === 'box') {
        this.tooltipInfo.tooltip = 'box';
        const { lowerfence, median, upperfence } = point;

        this.tooltipInfo.max = formatNumber(upperfence);
        this.tooltipInfo.median = formatNumber(median);
        this.tooltipInfo.min = formatNumber(lowerfence);
      } else {
        this.tooltipInfo.tooltip = 'point';

        this.tooltipInfo.point = formatNumber(point.y);
      }
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .tooltip-box {
    display: flex;
    padding: 8px 12px;
  }

  .tooltip-point {
    color: #5568e0;
    padding: 4px 16px;
    font-weight: bold;
  }

  .column {
    @include column;

    &:first-child {
      color: $color-text-main-light;
      margin-right: 16px;
    }
  }
</style>
