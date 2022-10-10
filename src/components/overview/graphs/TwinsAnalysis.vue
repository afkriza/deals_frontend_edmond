<template>
  <OverviewSidebarGraph
    :height="height"
    :layout="layout"
    :traces="traces"
    :width="width"
    @hover="onHover"
  >
    <template #tooltip>
      <div v-if="tooltipInfo.tooltip === 'bar'" :class="$style.tooltip">
        <span :class="$style.date">{{ tooltipInfo.data.date }}</span>
        <div>
          <span :class="$style.bold">{{ tooltipInfo.data.rooms }}</span>
          <span :class="$style.grey"> rooms</span>
        </div>
      </div>
      <div v-else :class="$style.tooltipMean">{{ meanFormatted }} rooms</div>
    </template>
  </OverviewSidebarGraph>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { filter, isFinite, max, mean, min, size, round } from 'lodash';
  import addDays from 'date-fns/addDays';
  import format from 'date-fns/format';

  import {
    DARK_BLUE,
    MEDIUM_PURPLE,
    TEXT_MAIN_LIGHT
  } from '@/constants/overview-graph-colors';
  import OverviewSidebarGraph from '@/components/overview/graphs/OverviewSidebarGraph.vue';
  import { formatNumber } from '@/utils/format';
  import { DEFAULT_GRAPH_HEIGHT } from '@/constants/overview';

  @Component({
    name: 'TwinsAnalysis',
    components: {
      OverviewSidebarGraph
    }
  })
  export default class TwinsAnalysis extends Vue {
    @Prop({
      type: Number
    })
    readonly width: number;

    @Prop({
      type: Number,
      default: DEFAULT_GRAPH_HEIGHT
    })
    readonly height: number;

    @Prop({ type: Date, default: () => new Date() })
    private readonly date: Date;

    @Prop({ type: Array, default: () => [], required: true })
    private readonly dates: string[];

    @Prop({ type: Array, default: () => [], required: true })
    private readonly numberOfRooms: number[];

    tooltipInfo = {
      data: {
        rooms: null,
        date: null
      },
      tooltip: null
    };

    get mean() {
      return round(mean(filter(this.numberOfRooms, isFinite)));
    }

    get traces() {
      return [
        {
          x: this.dates,
          y: this.numberOfRooms,
          type: 'bar',
          marker: {
            color: DARK_BLUE
          },
          hoverinfo: 'none',
          width: 0.5,
          showlegend: false
        },
        {
          x: this.dates,
          y: Array(size(this.dates)).fill(this.mean),
          type: 'scatter',
          mode: 'lines',
          hoverinfo: 'none',
          name: 'Average',
          line: {
            color: MEDIUM_PURPLE
          }
        }
      ];
    }

    get minY() {
      return min(this.numberOfRooms);
    }

    get maxY() {
      return max(this.numberOfRooms);
    }

    get layout() {
      return {
        xaxis: {
          title: {
            text: 'Days offset',
            standoff: 12
          },
          type: 'category',
          automargin: true,
          fixedrange: true,
          tickfont: { color: TEXT_MAIN_LIGHT }
        },
        yaxis: {
          title: {
            text: 'Booking'
          },
          tickfont: { color: TEXT_MAIN_LIGHT }
        },
        legend: {
          y: -0.3
        },
        shapes: [
          {
            type: 'line',
            x0: 0,
            x1: 1,
            y0: this.mean,
            y1: this.mean,
            xref: 'paper',
            yref: 'y',
            line: {
              color: MEDIUM_PURPLE
            }
          }
        ]
      };
    }

    get meanFormatted() {
      return formatNumber(this.mean);
    }

    onHover(e) {
      const [point] = e.points;

      const { x, y } = point;

      if (point.data.type === 'bar') {
        this.tooltipInfo.tooltip = 'bar';

        this.tooltipInfo.data.rooms = formatNumber(y);
        this.tooltipInfo.data.date = format(
          !isNaN(x) ? addDays(this.date, parseInt(x)) : this.date,
          'd.M.yyyy'
        );
      } else {
        this.tooltipInfo.tooltip = 'line';
      }
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .tooltip {
    padding: 8px 12px;
  }

  .date {
    display: inline-flex;
    margin-bottom: 4px;
  }

  .bold {
    font-weight: bold;
  }

  .grey {
    color: $color-text-main-light;
  }

  .tooltip-mean {
    padding: 4px 16px;
    font-weight: bold;
    color: $color-chart-purple;
  }
</style>
