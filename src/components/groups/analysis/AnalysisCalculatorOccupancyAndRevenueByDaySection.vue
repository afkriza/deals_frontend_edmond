<template>
  <div>
    <OccupancyGraph v-bind="graphData" />
    <div :class="$style.legend">
      <div>
        <span>Booking</span>
        <span>Group</span>
        <span>Forecast</span>
        <span>Displacement</span>
      </div>
      <div>
        <span>ADR</span>
        <span>ADR with group</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import OccupancyGraph from '@/components/groups/graphs/OccupancyGraph.vue';

  @Component({
    components: { OccupancyGraph }
  })
  export default class AnalysisCalculatorOccupancyAndRevenueByDaySection extends Vue {
    @Prop({
      type: Array,
      required: true
    })
    readonly adr: number[];

    @Prop({
      type: Array,
      required: true
    })
    readonly adrWithGroup: number[];

    @Prop({
      type: Array,
      required: true
    })
    readonly bookingDates: string[];

    @Prop({
      type: Array,
      required: true
    })
    readonly bookings: number[];

    @Prop({
      type: Number,
      required: true
    })
    readonly capacity: number;

    @Prop({
      type: Array,
      required: true
    })
    readonly displacements: number[];

    @Prop({
      type: Array,
      required: true
    })
    readonly forecasts: number[];

    @Prop({
      type: Array,
      required: true
    })
    readonly groupRooms: number[];

    get graphData() {
      return {
        width: null,
        height: 364,
        xAxisLabels: this.bookingDates,
        bookings: this.bookings,
        groups: this.groupRooms,
        forecasts: this.forecasts,
        displacements: this.displacements,
        capacity: this.capacity,
        adr: this.adr,
        adrWithGroup: this.adrWithGroup
      };
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  $colors: #5568e0, #b954eb, #62d9c9, #fa775c;

  .legend {
    @include column;
    margin: 0 auto;

    width: 400px;
    padding-left: 45px;

    > div {
      @include row;
      display: flex;
      justify-content: space-between;

      > span {
        display: flex;
        align-items: center;
        line-height: 16px;

        &:before {
          display: block;
          content: '';
          width: 8px;
          height: 8px;

          margin-right: 8px;
        }
      }

      &:first-child {
        > span {
          &:before {
            width: 8px;
            height: 8px;

            border-radius: 1px;
          }

          @for $i from 1 through length($colors) {
            &:nth-child(#{$i}):before {
              background-color: nth($colors, $i);
            }
          }
        }
      }

      &:last-child {
        width: 57%;
        margin: 4px auto 0;
        padding-left: 10px;

        > span {
          &::before {
            width: 14px;
          }

          &:first-child::before {
            height: 0;
            border-bottom: 2px solid $color-border-main;
          }

          &:last-child::before {
            height: 2px;
            background-image: linear-gradient(
              90deg,
              $color-border-main 2px,
              transparent 2px
            );
            background-size: 4px 2px;
          }
        }
      }
    }
  }
</style>
