<template>
  <div :class="$style.page">
    <AppHeader :class="$style.header">
      <PinnedPropertyFilter
        v-if="propertyFilter_"
        :class="[$style.filter, $style.property]"
        v-bind.sync="propertyFilter_"
        @update:filter="updateFilters"
        @refresh:sidebar="fetchSidebarData"
      />
      <div :class="$style.navigation">
        <ButtonFlat :class="$style.chevron" @click="onChevronLeftClick">
          <IconChevronLeft />
        </ButtonFlat>
        <ButtonFlat :class="$style.chevron" @click="onChevronRightClick">
          <IconChevronRight />
        </ButtonFlat>
        <VPopover
          :popover-base-class="$style.popover"
          :popover-inner-class="null"
          :open.sync="isDatePickerOpen"
        >
          <template #popover>
            <DatePicker
              :class="$style.datePicker"
              :current-month="month"
              :current-year="year"
              :type="timeGranulation"
              @date:change="onDateSubmitted"
            />
          </template>
          <ButtonFlat :class="$style.headerTitleBtn">
            <span :class="$style.headerTitle">{{ headerTitle }}</span>
          </ButtonFlat>
        </VPopover>
      </div>
      <SegmentControl
        :class="$style.segmentControl"
        :value="timeGranulation"
        :options="timeGranulationItems"
        track-by="value"
        dark
        compact
        @update="onTimeGranulationSelect"
      >
        <template #default="{ option }">
          <span
            v-tooltip="{
              content: `${option.name} <span>${option.abbr}</span>`,
              classes: $style.segmentControlTooltip
            }"
            :class="$style.segmentControlOption"
            >{{ option.abbr }}</span
          >
        </template>
      </SegmentControl>
      <PinnedMeasureFilter
        v-if="measureFilter_"
        :class="[$style.filter, $style.measure]"
        v-bind.sync="measureFilter_"
        :filter-class="$style.grow"
        :numerator-value="headerProgress"
        :denominator-value="headerTotal"
        :numerator-loading="
          isNumeratorLoading || (isLoading && !isDenominatorLoading)
        "
        :denominator-loading="isLoading"
        @update:filter="updateFilters"
        @refresh:sidebar="fetchSidebarData"
      />
      <HeaderProgressBar
        :class="$style.progressBar"
        :actual="headerProgress"
        :total="headerTotal"
        :loading="isLoading"
      />
      <NotificationsHub
        :open.sync="isAlertHubOpen"
        @notification:click="onNotificationClick"
        @seen-all="onNotificationsSeen"
      />
    </AppHeader>
    <main :class="$style.content">
      <div ref="scrollContainer" :class="$style.gridContainer">
        <template v-if="isCalendarView">
          <OverviewGrid
            v-if="isMonthGranulation"
            :cell-width="cellWidth"
            :class="$style.gridHeader"
            :has-border="false"
            :number-of-columns="numberOfColumns"
            :number-of-rows="1"
            cell-height="100%"
            is-inverted
            left-padding="22px"
            right-padding="22px"
          >
            <template #tile="{ index }">
              <div :class="$style.gridHeaderItem">
                <span>{{ headerItemTitle(index) }}</span>
              </div>
            </template>
          </OverviewGrid>
          <OverviewGrid
            :cell-height="cellHeight"
            :cell-width="cellWidth"
            :class="[$style.grid, $style[timeGranulation]]"
            :has-border="!(isMonthGranulation && isScreenSmall)"
            :is-striped="isMonthGranulation && !isScreenSmall"
            :number-of-columns="numberOfColumns"
            :number-of-rows="numberOfRows"
            :show-row-border="isYearGranulation"
            left-padding="22px"
            right-padding="22px"
            @click="closeSidebar"
          >
            <template #tile="{ index }">
              <GridItem
                v-if="isInsideCurrentMonth(index)"
                :class="[$style.gridItem, $style[timeGranulation]]"
              >
                <span
                  slot="title"
                  :class="[$style.gridItemTitle, $style[timeGranulation]]"
                >
                  <span :class="isToday(index) && $style.current">
                    {{ gridItemTitle(index) }}
                  </span>
                  <ExpandButton
                    v-if="
                      !isLoading &&
                      gridItem(index) &&
                      gridItem(index).hasDetails
                    "
                    :class="$style.expandBtn"
                    @click.stop="onExpand(index)"
                  />
                </span>
                <SkeletonLoader
                  v-if="isLoading"
                  :class="[$style.skeleton, $style[timeGranulation]]"
                  :style="{
                    '--bg-color': '#F2F2F2',
                    '--gradient':
                      'linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.05) 66.4%, rgba(0, 0, 0, 0) 100%)'
                  }"
                />
                <CalendarCardNew
                  v-else-if="gridItem(index)"
                  :class="[$style.card, $style[timeGranulation]]"
                  :actual="gridItem(index).progress"
                  :is-selected="isSidebarShown && activeItemIndex === index"
                  :total="gridItem(index).total"
                  :icon="gridItem(index).type"
                  :is-enlarged="isYearGranulation"
                  :no-details="!gridItem(index).hasDetails"
                  :has-notifications="gridItem(index).notifications.exist"
                  :are-notifications-seen="gridItem(index).notifications.seen"
                  @click.stop="onCardClick(index)"
                />
              </GridItem>
            </template>
          </OverviewGrid>
        </template>
        <template v-else>
          <WeeklyView @click.native="closeSidebar">
            <template #default="{ idx }">
              <WeeklyViewItem
                v-if="calculations[idx] && !isLoading"
                :key="calculations[idx].bookingPeriod"
                :class="$style.weeklyViewItem"
                :week="idx + 1"
                :start-date="calculations[idx].periodStartDate"
                :end-date="calculations[idx].periodEndDate"
                :actual="calculations[idx].progress"
                :expected="calculations[idx].total"
                :selected="isSidebarShown && activeItemIndex === idx"
                :no-details="!calculations[idx].hasDetails"
                :has-notifications="calculations[idx].notifications.exist"
                :are-notifications-seen="calculations[idx].notifications.seen"
                @click.stop="onCardClick(idx)"
                @expand.stop="onExpand(idx)"
              />
              <SkeletonLoader
                v-else
                :class="[$style.skeleton, $style.week]"
                :style="{
                  '--bg-color': '#F2F2F2',
                  '--gradient':
                    'linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.05) 66.4%, rgba(0, 0, 0, 0) 100%)'
                }"
              />
            </template>
          </WeeklyView>
        </template>
      </div>
      <Sidebar
        :class="[
          $style.sidebar,
          isSidebarShown ? $style.visible : $style.notVisible,
          $style[timeGranulation]
        ]"
        :items="sidebarGraphs"
        :notifications="sidebarNotifications"
        :title="sidebarTitle"
        :time-granulation="timeGranulation"
        :is-loading="isSidebarLoading"
        @expand="onExpand"
        @close="!isExpandedViewOpen && closeSidebar()"
      />
    </main>
    <transition name="tooltip-fade" appear>
      <ExpandedView
        v-show="isExpandedViewOpen"
        :class="$style.expanded"
        :property-name="selectedPropertyName"
        :numerator-metric="numeratorMetric"
        :denominator-metric="denominatorMetric"
        :title-primary="expandedViewTitlePrimary"
        :title-secondary="expandedViewTitleSecondary"
        :items="expandedViewGraphs"
        :notifications="expandedViewNotifications"
        :actual="activeExpandedViewItemProgress"
        :total="activeExpandedViewItemTotal"
        :is-loading="isExpandViewLoading"
        :time-granulation="timeGranulation"
        @close="isExpandedViewOpen = false"
      />
    </transition>
  </div>
</template>

<script>
  import AppHeader from '../components/app/AppHeader';

  import { cloneDeep, find, findIndex, forEach } from 'lodash';
  import { eachWeekOfInterval, getDaysInMonth, parseISO } from 'date-fns';

  import OverviewGrid from '../components/overview/OverviewGrid';
  import GridItem from '../components/overview/GridItem';
  import ProgressCard from '../components/overview/ProgressCard';
  import Sidebar from '../components/overview/Sidebar';

  import PinnedMeasureFilter from '../components/filters/PinnedMeasureFilter';
  import PinnedPropertyFilter from '../components/filters/PinnedPropertyFilter';

  import { screenSizes } from '@/enums/responsive-screen-sizes';
  import {
    CURRENT_DAY,
    CURRENT_MONTH,
    CURRENT_YEAR,
    DAYS,
    DEFAULT_TIME_GRANULATION,
    MONTHS,
    TIME_GRANULATION_LIST,
    TimeGranulations
  } from '@/enums/date';
  import OverviewHeader from '../components/overview/OverviewHeader';
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import * as mutationTypes from '../store/mutation-types';
  import CalendarCardNew from '@/components/overview/CalendarCardNew';
  import { resolveLatest } from '@/utils/function';
  import ExpandedView from '@/components/overview/ExpandedView';

  import IconChevronLeft from '@/assets/images/icons/Navigation/Chevron/chevron-left.svg';
  import IconChevronRight from '@/assets/images/icons/Navigation/Chevron/chevron-right.svg';
  import ButtonFlat from '@/components/buttons/ButtonFlat';
  import DateSlider from '@/components/overview/DateSlider';

  import { VPopover, VTooltip } from 'v-tooltip';
  import SimpleDropdown from '@/components/core/SimpleDropdown';
  import TimeGranulationDropdownList from '@/components/overview/TimeGranulationDropdownList';
  import DatePicker from '@/components/overview/DatePicker';
  import HeaderProgressBar from '@/components/overview/HeaderProgressBar';

  import ExpandButton from '@/components/overview/ExpandButton';
  import { isKey } from '@/utils/keyboard-events';
  import { KEY_D, KEY_M, KEY_W } from '@/constants/keyboard';
  import WeeklyViewItem from '@/components/overview/WeeklyViewItem';
  import WeeklyView from '@/components/overview/WeeklyView';
  import SkeletonLoader from '@/components/core/SkeletonLoader';
  import NotificationsHub from '@/components/overview/notifications/NotificationsHub';
  import { notificationsModule } from '@/store';
  import SegmentControl from '@/components/inputs/SegmentControl';

  export default {
    name: 'OverviewPage',
    components: {
      SegmentControl,
      NotificationsHub,
      WeeklyView,
      WeeklyViewItem,
      SkeletonLoader,
      ExpandedView,
      ExpandButton,
      HeaderProgressBar,
      DatePicker,
      TimeGranulationDropdownList,
      SimpleDropdown,
      DateSlider,
      ButtonFlat,
      CalendarCardNew,
      PinnedMeasureFilter,
      PinnedPropertyFilter,
      OverviewHeader,
      AppHeader,
      OverviewGrid,
      GridItem,
      ProgressCard,
      Sidebar,
      IconChevronLeft,
      IconChevronRight,
      VPopover
    },
    directives: {
      tooltip: VTooltip
    },
    computed: {
      activeItem() {
        return this.gridItem(this.activeItemIndex);
      },
      calculations() {
        return this.pageData.calculations || [];
      },
      yearWeeks() {
        return eachWeekOfInterval(
          {
            start: new Date(this.year, 0, 1),
            end: new Date(this.year, 11, 31)
          },
          { weekStartsOn: 1 }
        );
      },
      isCalendarView() {
        return this.isMonthGranulation || this.isYearGranulation;
      },

      propertyFilter_() {
        return find(this.filters_, ['id', 'property']);
      },

      measureFilter_() {
        return find(this.filters_, ['id', 'measure']);
      },

      propertyFilter() {
        return find(this.filters, ['id', 'property']);
      },

      selectedPropertyName() {
        return this.propertyFilter ? this.propertyFilter.property.name : '';
      },

      measureFilter() {
        return find(this.filters, ['id', 'measure']);
      },

      numeratorMetric() {
        return this.measureFilter ? this.measureFilter.numerator.name : '';
      },

      denominatorMetric() {
        return this.measureFilter ? this.measureFilter.denominator.name : '';
      },
      pickerSelectTitle() {
        return find(
          TIME_GRANULATION_LIST,
          ({ value }) => value === this.timeGranulation
        ).name;
      },
      headerProgress() {
        return this.pageData.progress;
      },
      headerTotal() {
        return this.pageData.total;
      },
      headerTitle() {
        if (this.isYearGranulation || this.isWeekGranulation) {
          return this.year;
        }

        return `${MONTHS[this.month - 1].substr(0, 3)} ${this.year}`;
      },
      sidebarTitle() {
        if (this.isYearGranulation) {
          return `${MONTHS[this.activeItemIndex]} ${this.year}`;
        }

        if (this.isWeekGranulation) {
          return `W${this.activeItemIndex + 1} ${this.year}`;
        }

        return `${DAYS[this.activeItemIndex % 7].name} ${
          this.activeItemIndex - this.dayOffset + 1
        }`;
      },
      expandedViewTitlePrimary() {
        if (this.isYearGranulation) {
          return MONTHS[this.activeExpandedViewItemIndex];
        }

        if (this.isWeekGranulation) {
          return `W${this.activeExpandedViewItemIndex + 1}`;
        }

        return DAYS[this.activeExpandedViewItemIndex % 7].name;
      },
      expandedViewTitleSecondary() {
        if (this.isYearGranulation || this.isWeekGranulation) {
          return `${this.year}`;
        }

        return `${this.activeExpandedViewItemIndex - this.dayOffset + 1} ${
          MONTHS[this.month - 1]
        } ${this.year}`;
      },
      isYearGranulation() {
        return this.timeGranulation === TimeGranulations.MONTH;
      },
      isMonthGranulation() {
        return this.timeGranulation === TimeGranulations.DAY;
      },
      isWeekGranulation() {
        return this.timeGranulation === TimeGranulations.WEEK;
      },
      numberOfColumns() {
        return this.isMonthGranulation ? 7 : 4;
      },
      numberOfRows() {
        return this.isMonthGranulation ? 6 : 3;
      },
      cellHeight() {
        return this.isMonthGranulation ? '64px' : '294px';
      },
      cellWidth() {
        return this.isMonthGranulation
          ? 'minmax(180px, 195px)'
          : 'minmax(300px, 345px)';
      },
      isScreenSmall() {
        return this.screenWidth <= screenSizes.TABLET;
      },
      dayOffset() {
        // calculate week index of first day of the month(we want MON as the first day, index 0 and sunday at index 6,
        // that is why - 1 at the end)
        let offset = new Date(this.year, this.month - 1, 1).getDay() - 1;

        // adjust sunday to be the last day (index 6, not -1)
        if (offset < 0) {
          offset += 7;
        }

        return offset;
      },
      sidebarGraphs() {
        return this.sidebarData.graphs;
      },
      sidebarNotifications() {
        return this.sidebarData.notifications;
      },
      expandedViewGraphs() {
        return this.expandedViewData.graphs;
      },
      expandedViewNotifications() {
        return this.expandedViewData.notifications;
      },
      activeExpandedViewItem() {
        return this.gridItem(this.activeExpandedViewItemIndex);
      },
      activeExpandedViewItemProgress() {
        return this.activeExpandedViewItem
          ? this.activeExpandedViewItem.progress
          : null;
      },
      activeExpandedViewItemTotal() {
        return this.activeExpandedViewItem
          ? this.activeExpandedViewItem.total
          : null;
      },
      numberOfDaysInCurrentMonth() {
        return getDaysInMonth(new Date(this.year, this.month - 1));
      },

      ...mapGetters('overview', ['filters', 'areFiltersLoaded'])
    },

    methods: {
      async onNotificationClick(notification) {
        this.closeSidebar();
        this.isAlertHubOpen = false;

        const propertyId = notification.property.id;
        const bookingPeriod = notification.bookingPeriod;

        const propertyFilter = find(this.filters_, ['id', 'property']);
        const { year, month, timeGranulation } =
          this.parseBookingPeriod(bookingPeriod);

        if (
          propertyFilter.property.id !== propertyId ||
          timeGranulation !== this.timeGranulation ||
          year !== this.year ||
          (TimeGranulations.DAY && month !== this.month)
        ) {
          propertyFilter.property = find(propertyFilter.options, [
            'id',
            propertyId
          ]);

          this.year = year;
          this.month = month;
          this.timeGranulation = timeGranulation;

          await this.updateFilters();
        }

        let calculationIndex = findIndex(this.calculations, [
          'bookingPeriod',
          bookingPeriod
        ]);

        if (calculationIndex !== -1) {
          if (this.isMonthGranulation) {
            calculationIndex += this.dayOffset;
          }

          this.onCardClick(calculationIndex);
        }
      },

      onNotificationsSeen() {
        forEach(this.calculations, this.triggerSeen);
      },

      parseBookingPeriod(bookingPeriod) {
        const date = parseISO(bookingPeriod);

        const result = {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          timeGranulation: TimeGranulations.DAY
        };

        if (/w/i.test(bookingPeriod)) {
          result.timeGranulation = TimeGranulations.WEEK;
        } else if (/^\d{4}-\d{1,2}$/.test(bookingPeriod)) {
          result.timeGranulation = TimeGranulations.MONTH;
        }

        return result;
      },
      isInsideCurrentMonth(index) {
        if (!this.isMonthGranulation) {
          return true;
        }

        const dayOfMonth = this.getDayOfMonth(index);
        return (
          dayOfMonth !== null && dayOfMonth < this.numberOfDaysInCurrentMonth
        );
      },

      onChevronLeftClick() {
        if (this.isYearGranulation || this.isWeekGranulation) {
          this.year--;
        } else {
          this.month--;

          if (this.month < 1) {
            this.year--;
            this.month = 12;
          }
        }

        this.onDateChange();
      },

      onChevronRightClick() {
        if (this.isYearGranulation || this.isWeekGranulation) {
          this.year++;
        } else {
          this.month++;

          if (this.month > 12) {
            this.year++;
            this.month = 1;
          }
        }

        this.onDateChange();
      },

      onDateSubmitted({ year, month }) {
        this.isDatePickerOpen = false;

        this.year = year;
        this.month = month;

        this.onDateChange();
      },

      isToday(index) {
        return (
          this.isMonthGranulation &&
          this.year === CURRENT_YEAR &&
          this.month === CURRENT_MONTH &&
          this.getDayOfMonth(index) + 1 === CURRENT_DAY
        );
      },

      getDayOfMonth(index) {
        if (index < this.dayOffset) {
          return null;
        }

        return index - this.dayOffset;
      },

      gridItem(index) {
        if (this.isYearGranulation || this.isWeekGranulation) {
          return this.calculations[index];
        }

        return this.calculations[this.getDayOfMonth(index)];
      },

      headerItemTitle(index) {
        return DAYS[index].abbr;
      },

      gridItemTitle(index) {
        return this.isMonthGranulation
          ? String(index - this.dayOffset + 1)
          : MONTHS[index];
      },

      handleResize() {
        this.screenWidth = window.innerWidth;
      },

      onCardClick(index) {
        if (this.activeItemIndex === index && this.isSidebarShown) {
          this.closeSidebar();
          return;
        }
        this.activeItemIndex = index;
        this.activeExpandedViewItemIndex = index;

        this.showSidebar();

        this.fetchSidebarData();
      },

      async onTimeGranulationSelect(timeGranulation) {
        if (timeGranulation === this.timeGranulation) {
          return;
        }

        this.timeGranulation = timeGranulation;

        this.isPickerSelectOpen = false;
        this.closeSidebar();

        await this.$nextTick();
        this.$refs.scrollContainer.scrollTop = 0;

        return this.fetchScreenData();
      },

      onDateChange() {
        this.closeSidebar();
        this.fetchScreenData();
      },

      showSidebar() {
        this.isSidebarShown = true;
      },

      closeSidebar() {
        this.isSidebarShown = false;
      },

      async fetchScreenData() {
        const payload = {
          view: find(
            TIME_GRANULATION_LIST,
            ({ value }) => value === this.timeGranulation
          ).view,
          year: this.year
        };

        if (this.isMonthGranulation) {
          payload.month = this.month;
        }

        this.isLoading = true;

        try {
          this.pageData = await this.latestFetchItems(payload);

          this.isLoading = false;
          this.isNumeratorLoading = false;
          this.isDenominatorLoading = false;
        } catch (ignored) {
          // if request is stale
        }
      },

      async fetchSidebarData() {
        try {
          this.isSidebarLoading = true;
          this.isSidebarError = false;

          this.triggerSeen(this.activeItem);

          this.sidebarData = await this.fetchItemData(this.activeItem);
        } catch (e) {
          this.isSidebarError = true;
        } finally {
          this.isSidebarLoading = false;
        }
      },

      updateFilters() {
        this.updateStoreFilters(cloneDeep(this.filters_));

        return this.fetchScreenData();
      },

      async onExpand(index) {
        this.isExpandedViewOpen = true;

        if (index === this.activeExpandedViewItemIndex) {
          this.expandedViewData = this.sidebarData;

          return;
        }

        this.activeExpandedViewItemIndex = index || this.activeItemIndex;

        if (
          !index ||
          this.activeExpandedViewItemIndex === this.activeItemIndex
        ) {
          this.expandedViewData = this.sidebarData;
          return;
        }

        try {
          this.isExpandViewLoading = true;
          this.isExpandViewError = false;

          this.triggerSeen(this.activeExpandedViewItem);

          this.expandedViewData = await this.fetchItemData(
            this.activeExpandedViewItem
          );
        } catch (e) {
          this.isExpandViewError = true;
        } finally {
          this.isExpandViewLoading = false;
        }
      },

      onKeyDown(e) {
        if (this.isExpandedViewOpen || this.isAlertHubOpen) {
          return;
        }

        if (isKey(KEY_M, e)) {
          this.onTimeGranulationSelect(TimeGranulations.MONTH);
        }

        if (isKey(KEY_W, e)) {
          this.onTimeGranulationSelect(TimeGranulations.WEEK);
        }

        if (isKey(KEY_D, e)) {
          this.onTimeGranulationSelect(TimeGranulations.DAY);
        }
      },

      ...mapMutations('overview', {
        updateStoreFilters: mutationTypes.OVERVIEW_FILTERS_UPDATE,
        updateStoreFilter: mutationTypes.OVERVIEW_FILTER_UPDATE
      }),

      ...mapActions('overview', [
        'fetchItems',
        'fetchItemData',
        'fetchFilters',
        'triggerSeen'
      ])
    },

    watch: {
      numeratorMetric() {
        this.isNumeratorLoading = true;
      },

      denominatorMetric() {
        this.isDenominatorLoading = true;
      }
    },

    data() {
      return {
        timeGranulation: DEFAULT_TIME_GRANULATION,
        year: CURRENT_YEAR,
        month: CURRENT_MONTH,
        screenWidth: 0,
        activeItemIndex: null,
        isSidebarShown: false,
        sidebarData: {
          graphs: [],
          notifications: []
        },
        pageData: {},
        filters_: [],
        isLoading: true,
        latestFetchItems: null,
        isDatePickerOpen: false,
        timeGranulationItems: TIME_GRANULATION_LIST,
        isExpandedViewOpen: false,
        isSidebarLoading: false,
        isSidebarError: false,
        isExpandViewLoading: false,
        isExpandViewError: false,
        expandedViewData: {
          graphs: [],
          notifications: []
        },
        activeExpandedViewItemIndex: null,
        isNumeratorLoading: true,
        isDenominatorLoading: true,
        isAlertHubOpen: false
      };
    },

    async created() {
      this.latestFetchItems = resolveLatest(this.fetchItems);

      window.addEventListener('resize', this.handleResize);
      this.handleResize();

      if (!this.areFiltersLoaded) {
        await this.fetchFilters();
      }

      this.filters_ = cloneDeep(this.filters);

      await this.fetchScreenData();
    },

    mounted() {
      document.addEventListener('keydown', this.onKeyDown);
    },

    destroyed() {
      window.removeEventListener('resize', this.handleResize);
      document.removeEventListener('keydown', this.onKeyDown);
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .page {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .weekly-view-item {
    min-width: 700px;
    max-width: 900px;
  }

  .chevron {
    @include button;
    @include circle(
      32px,
      $color-bg-primary-darker,
      1px solid $color-border-primary-mid
    );
    @include flex-center;

    color: $color-text-light;

    &:last-of-type {
      margin-left: 4px;
    }

    &:hover {
      color: $color-text-light;
      background-color: $color-bg-primary-mid;
    }
  }

  .popover {
    margin-top: 5px;
    z-index: $z-dropdown;
  }

  .grow {
    flex: 1;
  }

  .segment-control {
    margin-right: 24px;

    &-option {
      margin: -2px -8px;
      padding: 2px 8px;
    }

    &-tooltip :global(.tooltip-inner) {
      padding: 4px 8px;

      span {
        margin-left: 16px;
        color: $color-text-main-mild-light;
      }
    }
  }

  .filter {
    display: flex;

    &.measure {
      flex: 1;
      max-width: 592px;
      min-width: 464px;

      margin-left: auto;
      margin-right: 12px;
    }

    &.property {
      flex: 1;
      max-width: 280px;
      min-width: 216px;

      margin-right: 24px;
    }
  }

  .header {
    @include row;
    align-items: center;
    justify-content: space-between;
    padding: 14px 24px;
  }

  .header-title {
    color: $color-text-light;
    font-size: 17px;
    line-height: 22px;
    text-transform: none;
    cursor: pointer;

    &-btn {
      min-width: 96px;
      margin-left: 4px;
      margin-right: 4px;
      padding: 6px 12px;

      &.day {
        min-width: 160px;
      }

      &.month {
        min-width: 80px;
      }

      &:hover {
        background-color: $color-bg-primary-mid;
      }
    }
  }

  .navigation {
    @include flex-center;
  }

  .progress-bar {
    width: 120px;
  }

  .date-picker {
    min-width: 300px;
    padding: 8px;
    color: $color-text-main;
  }

  .date-picker {
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
  }

  .loader {
    position: static;

    // prevents clashes with date picker in OverviewHeader while loading
    z-index: $z-overlay;
  }

  .content {
    min-height: 0;
    flex: 1;

    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: 1fr;
    grid-template-areas: 'grid sidebar' 'grid sidebar';

    background-color: $color-bg-main-dimmed;
  }

  .grid-container {
    grid-area: grid;

    display: flex;
    flex-direction: column;

    overflow: auto;

    background-color: $color-bg-main-dimmed;
  }

  .grid-header {
    border-bottom: 1px solid $color-border-main-light;
    color: $color-text-main-lighter;
    position: sticky;
    top: 0;
    z-index: $z-floating-content;

    &-item {
      text-align: center;
      background-color: $color-bg-light;
      padding: 12px 0;
      letter-spacing: 0.2px;
      font-size: 12px;
      font-weight: bold;
    }
  }

  .grid.month {
    height: 100%;
  }

  .grid-item {
    height: 100%;
    width: min-content;
    margin: 0 auto;

    &.day {
      padding: 8px 0 22px;
    }

    &.month {
      justify-content: center;
      padding: 12px 8px 22px;
    }

    &:hover {
      .expand-btn {
        visibility: visible;
      }
    }
  }

  .skeleton {
    border-radius: 4px;

    &.day {
      width: 175px;
      height: 96px;
    }

    &.month {
      width: 277px;
      height: 116px;
    }

    &.week {
      width: 600px;
      height: 48px;
    }
  }

  .card {
    cursor: pointer;

    &.day {
      width: 175px;
      height: 96px;
    }

    &.month {
      width: 277px;
      height: 116px;
    }
  }

  .grid-item-title {
    @include row;
    align-items: center;
    justify-content: space-between;
    line-height: 22px;
    color: $color-text-main-light;

    &.day {
      padding: 4px 6px 4px 12px;
      font-size: 10px;
      font-weight: bold;
      height: 30px;
    }

    &.month {
      padding: 4px 4px 4px 6px;
      font-size: 17px;
      margin-bottom: 24px;
    }

    .current {
      @include flex-center;
      @include circle(20px);
      width: 20px;

      color: $color-text-primary;
      background-color: $color-bg-primary-light;
    }
  }

  .progress-card {
    margin-top: 6px;
    background-color: $color-bg-light;
  }

  .sidebar {
    @include column;

    grid-area: sidebar;
    max-width: 0;
    min-width: 0;
    transform: translateX(100%);
    transition: all 0.5s;

    will-change: min-width, padding;

    background-color: $color-bg-light;

    /* A hacky way to hide sidebar, because of box-sizing: border-box we have to remove the paddings and border as well */
    &.not-visible {
      padding-left: 0;
      padding-right: 0;
      border: none;
    }

    &.visible {
      min-width: 443px;
      max-width: 443px;
      transform: translateX(0);

      &.week {
        @include media(large up) {
          min-width: 894px;
          max-width: 894px;
        }
      }

      @include media(huge up) {
        min-width: 894px;
        max-width: 894px;
      }
    }
  }

  .expanded {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: $z-expanded;
    background-color: $color-bg-light;
  }

  .expand-btn {
    visibility: hidden;
  }
</style>
