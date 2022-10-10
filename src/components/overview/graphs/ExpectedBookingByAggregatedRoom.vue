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
        {{ tooltipInfo.data }}
      </div>
    </template>
  </OverviewSidebarGraph>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import OverviewSidebarGraph from '@/components/overview/graphs/OverviewSidebarGraph.vue';

  import { GREENISH, SHARP_BLUE } from '@/constants/overview-graph-colors';
  import { formatNumber } from '@/utils/format';
  import { DEFAULT_GRAPH_HEIGHT } from '@/constants/overview';

  @Component({
    name: 'ExpectedBookingByAggregatedRoom',
    components: {
      OverviewSidebarGraph
    }
  })
  export default class ExpectedBookingByAggregatedRoom extends Vue {
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
    readonly rooms: string[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly bookingCurrent: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly bookingExpected: number[];

    tooltipInfo = {
      data: '',
      color: ''
    };
    tooltipStyle = {
      color: ''
    };

    get bookingCurrentTrace() {
      return {
        type: 'bar',
        x: this.rooms,
        y: this.bookingCurrent,
        name: 'This year',
        hoverinfo: 'none',
        marker: {
          color: SHARP_BLUE
        }
      };
    }

    get bookingExpectedTrace() {
      return {
        type: 'bar',
        x: this.rooms,
        y: this.bookingExpected,
        name: 'Expected booking',
        hoverinfo: 'none',
        marker: {
          color: GREENISH
        }
      };
    }

    get traces() {
      return [this.bookingCurrentTrace, this.bookingExpectedTrace];
    }

    get layout() {
      return {
        xaxis: {
          title: { text: 'Room type', standoff: 12 }
        },
        yaxis: {
          title: { text: 'Booking' }
        },
        legend: {
          y: -0.35
        },
        bargap: 0.35
      };
    }

    onHover(e) {
      const [point] = e.points;

      const { y } = point;

      this.tooltipStyle.color =
        e.points[0].fullData.marker?.color || e.points[0].fullData.line?.color;

      this.tooltipInfo.data = formatNumber(y);
    }
  }
</script>

<style lang="scss" module>
  .tooltip {
    padding: 4px 16px;
    font-weight: bold;
  }
</style>
