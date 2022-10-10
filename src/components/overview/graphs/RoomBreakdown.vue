<template>
  <OverviewSidebarGraph :traces="traces" :layout="layout" />
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { fill, map, sum } from 'lodash';
  import { LIGHT_BLUE } from '@/constants/overview-graph-colors';
  import OverviewSidebarGraph from '@/components/overview/graphs/OverviewSidebarGraph.vue';

  @Component({
    name: 'RoomBreakdown.vue',
    components: {
      OverviewSidebarGraph
    }
  })
  export default class BookingVsRoomBreakdown extends Vue {
    @Prop({ type: Array, required: true })
    private readonly rooms: string[];

    @Prop({ type: Array, required: true })
    private readonly bookings: number[];

    @Prop({ type: Array, default: null })
    private readonly base: number[] | null;

    /*
      Aggregation of all bookings
    */
    get bookingsSum() {
      return sum(this.bookings);
    }

    /*
      x-axis labels
    */
    get roomsWithSum() {
      return ['SUM', ...this.rooms];
    }

    /*
      y-axis labels
    */
    get bookingsWithSum() {
      return [this.bookingsSum, ...this.bookings];
    }

    /*
      Calculates y-axis offset for every bar, offset for 'SUM' bar is 0.
     */
    get bases() {
      let total = this.bookingsSum;

      return [
        0,
        ...map(this.bookings, booking => {
          const result = total - booking;

          total -= booking;

          return result;
        })
      ];
    }

    /*
      Determines bar color for every bar.
     */
    get markers() {
      return {
        color: [LIGHT_BLUE, ...fill(Array(this.bookings.length), LIGHT_BLUE)]
      };
    }

    get traces() {
      return [
        {
          x: this.roomsWithSum,
          y: this.bookingsWithSum,
          type: 'bar',
          base: this.bases,
          marker: this.markers,
          width: 0.6,
          hoverinfo: 'none'
        }
      ];
    }

    get layout() {
      return {
        yaxis: {
          title: {
            text: 'Number of rooms'
          },
          fixedrange: true
        },
        xaxis: {
          title: {
            text: 'Room'
          }
        },
        margin: {
          b: 50
        }
      };
    }
  }
</script>
