<template>
  <div :class="$style.container">
    <header :class="$style.header">
      <div>
        <div :class="$style.box">
          <h2 :class="$style.title">{{ propertyName }}</h2>
        </div>
        <div :class="$style.box">
          <h2 :class="$style.title">{{ titlePrimary }}</h2>
          <span :class="$style.titleSecondary">{{ titleSecondary }}</span>
        </div>
      </div>
      <div>
        <ExpandedViewProgressBar
          :numerator-metric="numeratorMetric"
          :denominator-metric="denominatorMetric"
          :actual="actual"
          :total="total"
        />
        <ButtonEsc @click="onClose" />
      </div>
    </header>
    <AppLoader v-if="isLoading" loading-text="Loading..." />
    <div v-else :class="$style.scroll">
      <div :class="$style.wrapper">
        <div v-if="hasNotifications" :class="$style.notifications">
          <NotificationMessageSidebar
            v-for="notification in notifications"
            :key="notification.id"
            :notification="notification"
          />
        </div>
        <EmptyState v-if="isEmpty">
          <template slot="image">
            <EmptyStateIllustration />
          </template>
          <template slot="title">
            No analysis available for the selected
            {{ emptyStateGranulationText }}.
          </template>
        </EmptyState>
        <SidebarGrid v-else :number-of-columns="4" :items="items">
          <template #default="{ item, index }">
            <SidebarItem
              :key="index"
              :class="$style.sidebarItem"
              :title="item.title"
              :description="item.description"
            >
              <component
                :is="item.component"
                :key="generateRandomHex()"
                :class="$style.graph"
                v-bind="item.props"
                :height="EXPANDED_VIEW_GRAPH_HEIGHT"
              />
            </SidebarItem>
          </template>
        </SidebarGrid>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  import { map, size } from 'lodash';

  import { generateRandomHex } from '@/utils/string';
  import { TIME_GRANULATION_LIST, TimeGranulations } from '@/enums/date';

  import IconClose from '@/assets/images/icons/close-2px.svg';
  import SidebarItem from '@/components/overview/SidebarItem.vue';
  import TwinsAnalysis from '@/components/overview/graphs/TwinsAnalysis.vue';
  import RoomBreakdown from '@/components/overview/graphs/RoomBreakdown.vue';
  import MidtermBooking from '@/components/overview/graphs/MidtermBooking.vue';
  import ChannelBreakdown from '@/components/overview/graphs/ChannelBreakdown.vue';
  import ExpectedBookingByChannel from '@/components/overview/graphs/ExpectedBookingByChannel.vue';
  import RateShopperPriceVsValue from '@/components/overview/graphs/RateShopperPriceVsValue.vue';
  import RateShopperPrice from '@/components/overview/graphs/RateShopperPrice.vue';
  import BookingCurve from '@/components/overview/graphs/BookingCurve.vue';
  import CancellationRate from '@/components/overview/graphs/CancellationRate.vue';
  import AdrCurve from '@/components/overview/graphs/AdrCurve.vue';
  import PriceBasket from '@/components/overview/graphs/PriceBasket.vue';
  import LongtermPredictions from '@/components/overview/graphs/LongtermPredictions.vue';
  import ExpectedBookingByAggregatedRoom from '@/components/overview/graphs/ExpectedBookingByAggregatedRoom.vue';
  import SidebarGrid from '@/components/overview/SidebarGrid.vue';
  import ProgressBar from '@/components/overview/CalendarCardProgressBar.vue';
  import ExpandedViewProgressBar from '@/components/overview/ExpandedViewProgressBar.vue';
  import { isKey } from '@/utils/keyboard-events';
  import { ESCAPE } from '@/constants/keyboard';
  import ButtonEsc from '@/components/overview/ButtonEsc.vue';
  import AppLoader from '@/components/app/AppLoader.vue';
  import EmptyState from '@/components/app/EmptyState.vue';
  import EmptyStateIllustration from '@/assets/images/icons/emptystate-no-units.svg';
  import { EXPANDED_VIEW_GRAPH_HEIGHT } from '@/constants/overview';
  import NotificationMessageSidebar from '@/components/overview/notifications/NotificationMessageSidebar.vue';

  @Component({
    components: {
      NotificationMessageSidebar,
      EmptyState,
      EmptyStateIllustration,
      AppLoader,
      ButtonEsc,
      ExpandedViewProgressBar,
      ProgressBar,
      SidebarGrid,
      TwinsAnalysis,
      RoomBreakdown,
      MidtermBooking,
      ChannelBreakdown,
      ExpectedBookingByChannel,
      RateShopperPriceVsValue,
      RateShopperPrice,
      BookingCurve,
      CancellationRate,
      AdrCurve,
      PriceBasket,
      LongtermPredictions,
      ExpectedBookingByAggregatedRoom,
      SidebarItem,
      IconClose
    },
    methods: {
      generateRandomHex
    }
  })
  export default class ExpandedView extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly propertyName: string;

    @Prop({
      type: String,
      required: true
    })
    readonly numeratorMetric: string;

    @Prop({
      type: String,
      required: true
    })
    readonly denominatorMetric: string;

    @Prop({
      type: Number,
      default: 0
    })
    readonly actual: number;

    @Prop({
      type: Number,
      default: 0
    })
    readonly total: number;

    @Prop({
      type: Array,
      required: true,
      default: () => []
    })
    readonly items;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly notifications;

    @Prop({
      type: Boolean
    })
    readonly isLoading: boolean;

    @Prop({
      type: String,
      default: ''
    })
    readonly titlePrimary: string;

    @Prop({
      type: String,
      default: ''
    })
    readonly titleSecondary: string;

    @Prop({
      type: String,
      required: true,
      validator(timeGranulation) {
        return map(TIME_GRANULATION_LIST, 'value').includes(timeGranulation);
      }
    })
    readonly timeGranulation: string;

    get EXPANDED_VIEW_GRAPH_HEIGHT() {
      return EXPANDED_VIEW_GRAPH_HEIGHT;
    }

    get emptyStateGranulationText() {
      return this.timeGranulation === TimeGranulations.YEAR ? 'month' : 'day';
    }

    get isEmpty() {
      return !size(this.items);
    }

    get hasNotifications() {
      return Boolean(size(this.notifications));
    }

    onClose() {
      this.$emit('close');
    }

    closeOnEsc(e) {
      if (isKey(ESCAPE, e)) {
        this.onClose();
      }
    }

    mounted() {
      document.addEventListener('keydown', this.closeOnEsc);
    }

    beforeDestroy() {
      document.removeEventListener('keydown', this.closeOnEsc);
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    @include column;
  }

  .title {
    display: inline;
    margin: 0;
    font-size: 17px;
    line-height: 22px;

    &-secondary {
      color: $color-text-main-light;
      line-height: 20px;
    }
  }

  .title + .title-secondary {
    margin-left: 8px;
    padding-top: 2px;
  }

  .box {
    display: flex;
    align-items: center;

    &:first-child {
      padding-right: 16px;

      border-right: 1px solid $color-border-main-light;
    }

    &:last-child {
      padding-left: 16px;
    }
  }

  .header {
    @include row;
    position: sticky;
    top: 0;
    background-color: $color-bg-light;
    z-index: 1;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px 8px 40px;
    border-bottom: 1px solid $color-border-main-light;

    > div:first-child {
      height: 100%;
    }

    > div:last-child > * + * {
      margin-left: 40px;
    }

    > div {
      display: flex;
    }
  }

  .scroll {
    @include column;
    flex: 1;

    overflow: auto;
  }

  .wrapper {
    @include column;
    flex: 1;

    min-width: fit-content;
  }

  .sidebar-item {
    @include column;
    padding: 24px;
    min-width: 443px;
    border-bottom: 1px solid $color-border-main-light;

    &:nth-child(4n + 1) {
      padding-left: 40px;
    }
  }

  .graph {
    margin-top: auto;
    min-width: 0;
  }

  .notifications {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 330px));
    align-items: baseline;

    grid-gap: 32px;

    padding: 16px 32px;

    border-bottom: 1px solid $color-border-main-light;
  }
</style>
