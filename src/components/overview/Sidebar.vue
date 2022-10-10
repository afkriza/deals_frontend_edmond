<template>
  <div :class="$style.sidebar">
    <div :class="$style.header">
      <h2 :class="$style.title">{{ title }}</h2>
      <div :class="$style.controls">
        <ButtonFlat
          v-tooltip="{ content: 'Expand' }"
          :class="$style.button"
          @click="onExpand"
        >
          <IconExpand />
        </ButtonFlat>
        <ButtonEsc @click="onClose" />
      </div>
    </div>
    <AppLoader v-if="isLoading" loading-text="Loading..." />
    <template v-else>
      <div v-if="hasNotifications" :class="$style.notifications">
        <NotificationMessageSidebar
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
        />
      </div>
      <EmptyState v-if="isEmpty">
        <template slot="image">
          <!-- @svg("emptystate-no-units") -->
        </template>
        <template slot="title">
          No analysis available for the selected {{ emptyStateGranulation }}.
        </template>
      </EmptyState>
      <template v-else>
        <SidebarGrid :items="items" :number-of-columns="gridColumns">
          <template #default="{ item, index }">
            <SidebarItem
              :key="index"
              :class="[
                $style.sidebarItem,
                isHugeScreenWidth ? $style.separator : null
              ]"
              :title="item.title"
              :description="item.description"
            >
              <component
                :is="item.component"
                :key="generateRandomHex()"
                :class="$style.graph"
                v-bind="item.props"
              />
            </SidebarItem>
          </template>
        </SidebarGrid>
      </template>
    </template>
  </div>
</template>

<script>
  import ApexChart from 'vue-apexcharts';
  import { map, size } from 'lodash';

  import SidebarItem from './SidebarItem.vue';
  import SidebarGrid from './SidebarGrid.vue';
  import { screenSizes } from '@/enums/responsive-screen-sizes';
  import ChannelBreakdown from './graphs/ChannelBreakdown.vue';
  import EmptyState from '../app/EmptyState.vue';
  import MidtermBooking from '@/components/overview/graphs/MidtermBooking.vue';
  import TwinsAnalysis from '@/components/overview/graphs/TwinsAnalysis.vue';
  import RoomBreakdown from '@/components/overview/graphs/RoomBreakdown.vue';
  import ExpectedBookingByChannel from '@/components/overview/graphs/ExpectedBookingByChannel.vue';
  import RateShopperPriceVsValue from '@/components/overview/graphs/RateShopperPriceVsValue.vue';
  import RateShopperPrice from '@/components/overview/graphs/RateShopperPrice.vue';
  import BookingCurve from '@/components/overview/graphs/BookingCurve.vue';
  import CancellationRate from '@/components/overview/graphs/CancellationRate.vue';
  import AdrCurve from '@/components/overview/graphs/AdrCurve.vue';
  import PriceBasket from '@/components/overview/graphs/PriceBasket.vue';
  import LongtermPredictions from '@/components/overview/graphs/LongtermPredictions.vue';
  import ExpectedBookingByAggregatedRoom from '@/components/overview/graphs/ExpectedBookingByAggregatedRoom.vue';

  import { generateRandomHex } from '@/utils/string';
  import { TIME_GRANULATION_LIST } from '@/enums/date';

  import IconExpand from '@/assets/images/icons/expand-2px.svg';
  import IconClose from '@/assets/images/icons/close-2px.svg';
  import ButtonFlat from '@/components/buttons/ButtonFlat';

  import { VTooltip } from 'v-tooltip';
  import TooltipKeyboardShortcut from '@/components/core/tooltips/TooltipKeyboardShortcut';
  import { isKey } from '@/utils/keyboard-events';
  import { ESCAPE } from '@/constants/keyboard';
  import ButtonEsc from '@/components/overview/ButtonEsc';
  import AppLoader from '@/components/app/AppLoader';
  import NotificationMessage from '@/components/overview/notifications/NotificationMessage';
  import NotificationMessageSidebar from '@/components/overview/notifications/NotificationMessageSidebar';

  export default {
    name: 'Sidebar',
    components: {
      NotificationMessageSidebar,
      NotificationMessage,
      AppLoader,
      ButtonEsc,
      TooltipKeyboardShortcut,
      ButtonFlat,
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
      SidebarGrid,
      ApexChart,
      EmptyState,
      IconExpand,
      IconClose
    },
    directives: {
      tooltip: VTooltip
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      items: {
        type: Array,
        default: () => {
          return [];
        }
      },
      notifications: {
        type: Array,
        default: () => []
      },
      timeGranulation: {
        type: String,
        required: true,
        validator(timeGranulation) {
          return map(TIME_GRANULATION_LIST, 'value').includes(timeGranulation);
        }
      },
      isLoading: Boolean
    },
    data() {
      return {
        screenWidth: 0
      };
    },
    computed: {
      isEmpty() {
        return !this.items.length;
      },
      hasNotifications() {
        return Boolean(size(this.notifications));
      },
      emptyStateGranulation() {
        return this.timeGranulation === 'year' ? 'month' : 'day';
      },
      isHugeScreenWidth() {
        return this.screenWidth >= screenSizes.HUGE;
      },
      gridColumns() {
        if (
          this.timeGranulation === 'week' &&
          this.screenWidth >= screenSizes.LARGE
        ) {
          return 2;
        }

        return this.screenWidth < screenSizes.HUGE ? 1 : 2;
      },
      gridClass() {
        return this.isHugeScreenWidth ? 'grid-huge' : 'grid-desktop';
      }
    },
    created() {
      window.addEventListener('resize', this.handleResize);
      this.handleResize();
      document.addEventListener('keydown', this.closeOnEsc);
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize);
      document.removeEventListener('keydown', this.closeOnEsc);
    },
    methods: {
      generateRandomHex,

      handleResize() {
        this.screenWidth = window.innerWidth;
      },

      onClose() {
        this.$emit('close');
      },

      closeOnEsc(e) {
        if (isKey(ESCAPE, e)) {
          this.onClose();
        }
      },

      onExpand() {
        this.$emit('expand');
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .sidebar {
    overflow: auto;
    border-left: 1px solid $color-border-main-light;
  }

  .header {
    @include row;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 12px 18px 12px 22px;
    background-color: $color-bg-light;
    border-bottom: 1px solid $color-border-main-light;
  }

  .title {
    display: inline;
    font-size: 17px;
    line-height: 22px;
    margin: 0;
    color: $color-text-main;
  }

  .controls {
    @include row;
  }

  .sidebar-item {
    @include column;
    padding: 24px;

    min-width: 0;
    border-bottom: 1px solid $color-border-main-light;
  }

  .graph {
    margin-top: auto;
  }

  .button {
    @include flex-center($is-inline: true);
    padding: 0;
    width: 32px;
    height: 32px;

    &:hover {
      @include circle(
        32px,
        $color-bg-main-dimmed,
        1px solid $color-border-main-light
      );
    }
  }

  .notifications {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
    align-items: baseline;

    grid-column-gap: 32px;
    grid-row-gap: 20px;

    padding: 20px 24px;

    border-bottom: 1px solid $color-border-main-light;
  }
</style>
