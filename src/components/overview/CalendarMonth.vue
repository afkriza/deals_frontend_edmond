<template>
  <div
    :style="{
      '--cellMaxWidth': cardSize.width
    }"
  >
    <overview-grid
      v-if="showHeader"
      :class="$style.header"
      :numberOfRows="1"
      :numberOfColumns="7"
      cellHeight="100%"
      cellWidth="180px"
      isInverted
      isStriped
      :hasBorder="false"
      :itemClass="$style.headerItem"
    >
      <template v-slot:tile="{ index }">
        <calendar-header-item
          v-if="showHeader"
          :class="$style.headerItemComponent"
          :day="headerItemsShort[index - 1]"
        />
      </template>
    </overview-grid>
    <overview-grid
      :numberOfRows="6"
      :numberOfColumns="7"
      :isStriped="hasBordersAndStripes"
      :cellWidth="cardSize.width"
      :cellHeight="cardSize.height"
      :itemClass="$style.cardItem"
      :hasBorder="false"
      :hasSideBorders="hasBordersAndStripes"
    >
      <template v-slot:tile="{ index }">
        <calendar-month-item :layout="layout" :class="$style.cardItemComponent">
          <calendar-card
            v-if="isCardItemRendering(index)"
            :day="items[itemIndexNumber(index)].day"
            :date="items[itemIndexNumber(index)].date"
            :layout="layout"
            :theme="activeClass(items[itemIndexNumber(index)].active)"
          >
            <progress-card
              @card:submit="cardAction(items[itemIndexNumber(index)].id)"
              :progress="items[itemIndexNumber(index)].progress"
              :total="items[itemIndexNumber(index)].total"
              :type="items[itemIndexNumber(index)].type"
              :theme="activeClass(items[itemIndexNumber(index)].active)"
            />
          </calendar-card>
        </calendar-month-item>
      </template>
    </overview-grid>
  </div>
</template>

<script>
  import ProgressCard from './ProgressCard.vue';
  import CalendarCard from './CalendarCard.vue';
  import CalendarMonthItem from './CalendarMonthItem.vue';
  import CalendarHeaderItem from './CalendarHeaderItem.vue';
  import OverviewGrid from './OverviewGrid';

  import { MONTHS } from '../../enums/date.js';

  import {
    screenSizes,
    calendarMonthItemsSizes
  } from '../../enums/responsive-screen-sizes';

  export default {
    name: 'CalendarMonthUpdate',
    components: {
      ProgressCard,
      CalendarCard,
      CalendarMonthItem,
      CalendarHeaderItem,
      OverviewGrid
    },
    props: {
      showHeader: {
        type: Boolean,
        default: true
      },
      headerItems: {
        type: Array,
        default: () => MONTHS,
        validator(value) {
          return value.length === 7;
        }
      },
      items: {
        type: Array,
        default: () => [
          {
            date: 1,
            day: 'Saturday',
            id: null,
            active: false,
            progress: 0,
            total: 0,
            type: ''
          }
        ],
        validator(items) {
          const filteredItems = items.filter(({ day, id }) => {
            const chackDay =
              (day && typeof day === 'string') ||
              this.headerItems.includes(day);

            return id && chackDay;
          });

          return filteredItems.length === items.length;
        }
      }
    },
    data() {
      return {
        screenWidth: 0
      };
    },
    created() {
      window.addEventListener('resize', this.handleResize);
      this.handleResize();
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize);
    },
    computed: {
      hasBordersAndStripes() {
        return this.screenWidth >= screenSizes.TABLET;
      },
      cardSize() {
        return this.screenWidth <= screenSizes.TABLET
          ? calendarMonthItemsSizes.TABLET
          : calendarMonthItemsSizes.DESKTOP;
      },
      headerItemsShort() {
        return this.headerItems.map(item => item.slice(0, 3));
      },
      layout() {
        return this.screenWidth <= screenSizes.TABLET ? 'small-card' : 'card';
      },
      firstDay() {
        return this.headerItems.indexOf(this.items[0].day) + 1;
      }
    },
    methods: {
      handleResize() {
        this.screenWidth = window.innerWidth;
      },
      itemIndexNumber(index) {
        return index - this.firstDay;
      },
      isCardItemRendering(index) {
        return (
          this.firstDay <= index &&
          index - this.firstDay <= this.items.length - 1
        );
      },
      cardAction(id) {
        this.$emit('card:submitted', id);
      },
      activeClass(active) {
        return active ? 'active' : 'normal';
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .header {
    border-color: $color-border-main-light;
    border-style: solid;
    border-width: 1px 0;
  }

  .header-item-component,
  .card-item-component {
    max-width: var(--cellMaxWidth);
  }

  .card-item:nth-child(7n) .card-item-component,
  .header-item:nth-child(7n) .header-item-component {
    margin-right: auto;
  }

  .card-item:nth-child(7n + 1) .card-item-component,
  .card-item:first-child .card-item-component,
  .header-item:first-child .header-item-component {
    margin-left: auto;
  }
</style>
