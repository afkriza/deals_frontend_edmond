<template>
  <div>
    <h4 :class="$style.title">Occupancy and revenue</h4>
    <AnalysisCalculatorGraphCard>
      <template #header>
        <header :class="$style.header">
          <InputSelect
            v-model="selectedTimePeriod"
            :options="bookingPeriods"
            search-by="name"
            dark
          />
          <SegmentControl
            v-model="activeTabId"
            :class="$style.segmentControl"
            :options="tabs"
            dark
          />
        </header>
      </template>
      <template>
        <KeepAlive>
          <Component :is="activeTab.component" v-bind="activeTab.props" />
        </KeepAlive>
      </template>
    </AnalysisCalculatorGraphCard>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import AnalysisCalculatorGraphCard from '@/components/groups/analysis/AnalysisCalculatorGraphCard.vue';
  import SegmentControl from '@/components/inputs/SegmentControl.vue';
  import InputSelect from '@/components/inputs/new/InputSelect.vue';
  import AnalysisCalculatorOccupancyAndRevenueAllSection from '@/components/groups/analysis/AnalysisCalculatorOccupancyAndRevenueAllSection.vue';
  import AnalysisCalculatorOccupancyAndRevenueByDaySection from '@/components/groups/analysis/AnalysisCalculatorOccupancyAndRevenueByDaySection.vue';
  import { map, keyBy } from 'lodash';
  import {
    AnalysisData,
    UnitType
  } from '@/models/analysis/AnalysisCalculator.model';
  import { format, parseISO } from 'date-fns';

  @Component({
    components: { InputSelect, SegmentControl, AnalysisCalculatorGraphCard }
  })
  export default class AnalysisCalculatorOccupancyAndRevenue extends Vue {
    @Prop({
      type: Array,
      required: true
    })
    readonly bookingPeriods!: AnalysisData['bookingPeriods'];

    @Prop({
      type: Object,
      required: true
    })
    readonly roomPrices;

    selectedTimePeriod = this.bookingPeriods[0];
    activeTabId = this.tabs[0].id;

    get adr() {
      const {
        adr: { a, b, from }
      } = this.selectedTimePeriod.all;

      const to =
        a[UnitType.Single] * this.roomPrices[UnitType.Single] +
        a[UnitType.Double] * this.roomPrices[UnitType.Double] +
        a[UnitType.Triple] * this.roomPrices[UnitType.Triple] +
        a[UnitType.Family] * this.roomPrices[UnitType.Family] +
        a[UnitType.Suite] * this.roomPrices[UnitType.Suite] +
        b;

      return {
        from,
        to
      };
    }

    get revenue() {
      const {
        revenue: { a, b, from }
      } = this.selectedTimePeriod.all;

      const to =
        a[UnitType.Single] * this.roomPrices[UnitType.Single] +
        a[UnitType.Double] * this.roomPrices[UnitType.Double] +
        a[UnitType.Triple] * this.roomPrices[UnitType.Triple] +
        a[UnitType.Family] * this.roomPrices[UnitType.Family] +
        a[UnitType.Suite] * this.roomPrices[UnitType.Suite] +
        b;

      return {
        from,
        to
      };
    }

    get occupancy() {
      return this.selectedTimePeriod.all.occupancy;
    }

    get tabs() {
      return [
        {
          id: 'all',
          label: 'All',
          component: AnalysisCalculatorOccupancyAndRevenueAllSection,
          props: {
            booking: this.selectedTimePeriod.all.booking,
            capacity: this.selectedTimePeriod.all.capacity,
            displacement: this.selectedTimePeriod.all.displacement,
            forecast: this.selectedTimePeriod.all.forecast,
            groupRooms: this.selectedTimePeriod.all.groupRooms,
            missingRooms: this.selectedTimePeriod.all.missingRooms,
            occupancy: this.occupancy,
            adr: this.adr,
            revenue: this.revenue
          }
        },
        {
          id: 'by_day',
          label: 'By day',
          component: AnalysisCalculatorOccupancyAndRevenueByDaySection,
          props: {
            adr: this.selectedTimePeriod.byDay.adr,
            adrWithGroup: map(
              this.selectedTimePeriod.byDay.adrWithGroup,
              ({ a, b }) =>
                a[UnitType.Single] * this.roomPrices[UnitType.Single] +
                a[UnitType.Double] * this.roomPrices[UnitType.Double] +
                a[UnitType.Triple] * this.roomPrices[UnitType.Triple] +
                a[UnitType.Family] * this.roomPrices[UnitType.Family] +
                a[UnitType.Suite] * this.roomPrices[UnitType.Suite] +
                b
            ),
            bookingDates: map(
              this.selectedTimePeriod.byDay.bookingDates,
              date => format(parseISO(date), 'd.M')
            ),
            bookings: this.selectedTimePeriod.byDay.bookings,
            capacity: this.selectedTimePeriod.byDay.capacity,
            displacements: this.selectedTimePeriod.byDay.displacements,
            forecasts: this.selectedTimePeriod.byDay.forecasts,
            groupRooms: this.selectedTimePeriod.byDay.groupRooms
          }
        }
      ];
    }

    get tabsById() {
      return keyBy(this.tabs, 'id');
    }

    get activeTab() {
      return this.tabsById[this.activeTabId];
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .title {
    color: $color-text-main-mild-light;

    text-transform: uppercase;
    font-size: 12px;
    line-height: 16px;

    margin: 10px 0 16px 0;
  }

  .header {
    @include row;
    justify-content: space-between;

    .segment-control {
      font-size: 13px;
    }

    > * + * {
      margin-left: 10px;
    }

    > :first-child {
      flex-grow: 2;
    }

    > :last-child {
      width: 200px;
    }
  }
</style>
