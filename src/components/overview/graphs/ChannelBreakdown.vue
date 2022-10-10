<template>
  <OverviewSidebarGraph :traces="traces" :layout="layout" />
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  import { Plotly } from 'vue-plotly';
  import { map, sum, tail } from 'lodash';
  import OverviewSidebarGraph from '@/components/overview/graphs/OverviewSidebarGraph.vue';
  import { DARK_BLUE, ORANGE } from '@/constants/overview-graph-colors';

  @Component({
    name: 'ChannelBreakdown.vue',
    components: {
      OverviewSidebarGraph,
      Plotly
    }
  })
  export default class ChannelVsExpectedCancellationBreakdown extends Vue {
    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly channels;

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly nettoBookings;

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly expectedCancellations;

    get nettoBookingsSum() {
      return sum(this.nettoBookings);
    }

    get expectedCancellationsSum() {
      return sum(this.expectedCancellations);
    }

    /*
    Calculates y-axis offset for expected calculation bars
   */
    get expectedCancellationTraceBase() {
      let sum = this.nettoBookings[0];

      return [
        this.nettoBookings[0],
        ...map(
          tail(this.expectedCancellations),
          (expectedCancellation: number, index: number) => {
            sum +=
              this.expectedCancellations[index] + this.nettoBookings[index + 1];

            return sum;
          }
        )
      ];
    }

    get expectedCancellationTrace() {
      return this.traceFactory(
        [...this.expectedCancellations, this.expectedCancellationsSum],
        [...this.expectedCancellationTraceBase, this.nettoBookingsSum],
        'Expected cancellation',
        ORANGE
      );
    }

    /*
    Calculates y-axis offset for netto booking bars
  */
    get nettoBookingTraceBase() {
      let sum = 0;

      return [
        0,
        ...map(
          tail(this.nettoBookings),
          (nettoBooking: number, index: number) => {
            sum +=
              this.expectedCancellations[index] + this.nettoBookings[index];

            return sum;
          }
        )
      ];
    }

    get nettoBookingsTrace() {
      return this.traceFactory(
        [...this.nettoBookings, this.nettoBookingsSum],
        [...this.nettoBookingTraceBase, 0],
        'Netto booking',
        DARK_BLUE
      );
    }

    get traces() {
      return [this.nettoBookingsTrace, this.expectedCancellationTrace];
    }

    get layout() {
      return {
        xaxis: {
          title: {
            text: 'Channel',
            standoff: 20
          }
        },
        yaxis: {
          title: {
            text: 'Number of rooms'
          }
        },
        barmode: 'stack'
      };
    }

    traceFactory(y: number[], base: number[], name: string, color: string) {
      return {
        x: [...this.channels, 'SUM'],
        y,
        type: 'bar',
        base,
        name,
        hoverinfo: 'none',
        marker: {
          color
        },
        width: 0.6
      };
    }
  }
</script>
