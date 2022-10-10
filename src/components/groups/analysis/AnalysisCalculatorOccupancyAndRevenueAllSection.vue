<template>
  <div :class="$style.container">
    <div>
      <div :class="$style.box">
        <b>Occupancy</b>
        <span>{{ round(toPercentage(occupancy.to - occupancy.from)) }}%</span>
        <span>
          <span>{{ round(toPercentage(occupancy.from)) }}%</span>
          <IconArrow :class="$style.arrow" />
          <span>{{ round(toPercentage(occupancy.to)) }}%</span>
        </span>
      </div>
      <div :class="$style.box">
        <b>ADR</b>
        <span
          :class="
            !isNegative(adrDifference) ? $style.positive : $style.negative
          "
          >{{ determineSign(adrDifference) }}€{{
            formatPriceNumber(adrDifferenceAbs)
          }}</span
        >
        <span>
          <span>€{{ formatPriceNumber(round(adr.from)) }}</span>
          <IconArrow :class="$style.arrow" />
          <span>€{{ formatPriceNumber(round(adr.to)) }}</span>
        </span>
      </div>
      <div :class="$style.box">
        <b>Revenue</b>
        <span
          :class="
            !isNegative(revenueDifference) ? $style.positive : $style.negative
          "
          >{{ determineSign(revenueDifference) }}€{{
            formatPriceNumber(revenueDifferenceAbs)
          }}</span
        >
        <span>
          <span>€{{ formatPriceNumber(round(revenue.from)) }}</span>
          <IconArrow :class="$style.arrow" />
          <span>€{{ formatPriceNumber(round(revenue.to)) }}</span>
        </span>
      </div>
    </div>
    <div :class="$style.graph">
      <OccupancyGraph
        :bookings="[booking]"
        :groups="[groupRooms]"
        :forecasts="[forecast]"
        :displacements="[displacement]"
        :capacity="capacity"
        :width="null"
        :height="400"
      />
      <section :class="$style.legend">
        <div>
          <div>
            <span>Displaced rooms</span>
            <b>{{ formatPriceNumber(displacement) }}</b>
          </div>
        </div>
        <div>
          <div>
            <span>Forecast</span>
            <b>{{ formatPriceNumber(forecast) }}</b>
          </div>
        </div>
        <div>
          <div>
            <span>Group</span>
            <b>{{ formatPriceNumber(groupRooms) }}</b>
          </div>
        </div>
        <div>
          <div>
            <span>Booking</span>
            <b>{{ formatPriceNumber(booking) }}</b>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';

  import IconArrow from '@/assets/images/icons/Navigation/Arrow/ic-16-arrow.svg';
  import OccupancyGraph from '@/components/groups/graphs/OccupancyGraph.vue';

  import { formatPriceNumber } from '@/utils/format';
  import { Range } from '@/models/analysis/AnalysisCalculator.model';

  @Component({
    components: { OccupancyGraph, IconArrow },
    methods: {
      formatPriceNumber
    }
  })
  export default class AnalysisCalculatorOccupancyAndRevenueAllSection extends Vue {
    @Prop({
      type: Number,
      required: true
    })
    readonly booking: number;

    @Prop({
      type: Number,
      required: true
    })
    readonly capacity: number;

    @Prop({
      type: Number,
      required: true
    })
    readonly displacement: number;

    @Prop({
      type: Number,
      required: true
    })
    readonly forecast: number;

    @Prop({
      type: Number,
      required: true
    })
    readonly groupRooms: number;

    @Prop({
      type: Object,
      required: true
    })
    readonly occupancy: Range;

    @Prop({
      type: Object,
      required: true
    })
    readonly adr: Range;

    @Prop({
      type: Object,
      required: true
    })
    readonly revenue: Range;

    get adrDifference() {
      return this.round(this.adr.to - this.adr.from);
    }

    get adrDifferenceAbs() {
      return Math.abs(this.adrDifference);
    }

    get revenueDifference() {
      return this.round(this.revenue.to - this.revenue.from);
    }

    get revenueDifferenceAbs() {
      return Math.abs(this.revenueDifference);
    }

    determineSign(number) {
      return !this.isNegative(number) ? '+' : '-';
    }

    isNegative(number) {
      return number < 0;
    }

    round(value: number) {
      return Math.round(value);
    }

    toPercentage(number) {
      return number * 100;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    display: grid;
    grid-template-columns: 1.25fr 2fr;
  }

  .graph {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 24px;
  }

  .box {
    @include column;

    padding: 12px 0;

    b {
      color: $color-text-light;

      margin-bottom: 28px;
    }

    > span:first-of-type {
      color: $color-text-light;
      font-size: 24px;
      line-height: 32px;
      font-weight: bold;

      &.positive {
        color: $color-text-success;
      }

      &.negative {
        color: $color-text-warning;
      }
    }

    > span:last-of-type {
      @include row;
      align-items: center;

      > * + * {
        margin-left: 4px;
      }
    }
  }

  .box + .box {
    border-top: 1px solid $color-border-primary-mid;
  }

  .arrow {
    transform: rotate(-90deg);
  }

  $colors: #fa775c, #62d9c9, #b954eb, #5568e0;

  .legend {
    align-self: center;

    color: $color-text-light;

    > div {
      padding: 12px;

      &:not(:last-child) {
        border-bottom: 1px solid $color-border-primary-mid;
      }

      > div {
        @include row;
        justify-content: space-between;

        > span:first-child {
          width: 10ch;
        }
      }

      &:before {
        display: block;
        content: '';
        width: 8px;
        height: 8px;

        border-radius: 1px;

        margin-bottom: 4px;
        margin-left: 4px;
      }

      @for $i from 1 through length($colors) {
        &:nth-child(#{$i}):before {
          background-color: nth($colors, $i);
        }
      }
    }
  }
</style>
