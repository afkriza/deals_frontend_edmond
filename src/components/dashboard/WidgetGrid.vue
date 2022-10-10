<template>
  <div :class="[$style.wrapper, isActive && $style.active]">
    <GridLayout
      :class="$style.grid"
      :layout="layout"
      :col-num="gridConfig.colNum"
      :row-height="gridConfig.rowHeight"
      :is-draggable="isActive"
      :is-resizable="isActive"
      :margin="gridConfig.margin"
      :max-rows="actualNumberOfPlaceholderRows"
      :vertical-compact="false"
      :use-css-transforms="false"
      @layout-ready="onLayoutReady"
    >
      <GridItem
        v-for="item in sortedLayoutItems"
        :key="item.i"
        :style="gridItemStyle"
        :class="[
          $style.widgetGridItem,
          activeWidgetId === item.i && $style.activeZIndex
        ]"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :min-w="determineMinWidgetWidth(item.i)"
        :min-h="determineMinWidgetHeight(item.i)"
        @move="onWidgetStart"
        @resize="onWidgetStart"
        @moved="onWidgetStop"
        @resized="onWidgetStop"
      >
        <component
          :is="widgetCardType(widgetById[item.i].category)"
          :class="$style.widgetCard"
          :density="displayDensity"
          :widget="widgetById[item.i]"
          :namespace="namespace"
          :filters="filters"
          :expanded-filter-active="expandedFilterActive"
          :owner="currentUser.id === widgetById[item.i].user.id"
          @widget:edit="onEditWidgetClick(item.i)"
          @widget:duplicate="onDuplicateWidgetClick(item.i)"
          @widget:copy-to="onCopyWidgetClick(item.i)"
          @widget:convert-to="onConvertWidgetClick(item.i)"
          @widget:export-to-excel="onExportWidgetClick(item.i)"
          @widget:delete="onDeleteWidgetClick(item.i)"
        />
      </GridItem>
    </GridLayout>

    <WidgetGridPlaceholder
      v-show="fullscreen"
      :col-num="gridConfig.colNum"
      :row-num="actualNumberOfPlaceholderRows"
      :row-height="gridConfig.rowHeight"
      @mounted="onGridMounted"
    />
  </div>
</template>

<script>
  import VueGridLayout from 'vue-grid-layout';
  import ResizeObserver from 'resize-observer-polyfill';

  import { sortBy } from 'lodash';

  import WidgetGridItem from 'components/dashboard/WidgetGridItem';
  import WidgetGridPlaceholder from 'components/dashboard/WidgetGridPlaceholder';
  import namespacedMixin from 'mixins/namespaced';

  import { mapGetters, mapState } from 'vuex';
  import { widgetTypes } from 'enums/widget-types';
  import {
    MIN_CHART_WIDGET_HEIGHT,
    MIN_CHART_WIDGET_WIDTH,
    MIN_TABLE_WIDGET_HEIGHT,
    MIN_TABLE_WIDGET_WIDTH
  } from 'constants/widget-grid';
  import { debounce, max, map, keyBy } from 'lodash';
  import WidgetCard from '@/components/dashboard/WidgetCard';
  import WidgetDataFetcher from '@/components/dashboard/WidgetDataFetcher';
  import TableWidget from '@/components/dashboard/TableWidget';
  import TextEllipsis from '@/components/core/TextEllipsis';
  import GraphWidget from '@/components/analytics/graph-widget/GraphWidget';
  import WidgetCardTable from '@/components/dashboard/WidgetCardTable';
  import WidgetCardGraph from '@/components/dashboard/WidgetCardGraph';

  export default {
    components: {
      WidgetCardGraph,
      WidgetCardTable,
      GraphWidget,
      TextEllipsis,
      TableWidget,
      WidgetDataFetcher,
      WidgetCard,
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
      WidgetGridItem,
      WidgetGridPlaceholder
    },
    mixins: [namespacedMixin],

    props: {
      layout: {
        type: Array,
        required: true
      },

      calculations: {
        type: Object,
        required: true
      },

      configurations: {
        type: Object,
        required: true
      },

      displayDensity: {
        type: String,
        required: true
      },

      currentOpenDropdown: {
        type: String,
        default: null
      },

      isActive: {
        type: Boolean,
        default: false
      },

      readonly: {
        type: Boolean,
        default: false
      },

      scroll: {
        type: Boolean,
        default: false
      },

      widgets: {
        type: Array,
        default: () => []
      },

      hasMultipleDashboards: {
        type: Boolean,
        default: false
      },

      filters: {
        type: Object,
        default: null
      },

      expandedFilterActive: {
        type: Boolean,
        required: true
      },

      currentUser: {
        type: Object,
        required: true
      }
    },

    watch: {
      actualNumberOfPlaceholderRows(curr, old) {
        if (this.isActive && curr > old) {
          this.scrollToBottom();
        }
      },
      isActive(curr) {
        if (curr && this.scroll) {
          this.scrollToBottom();
        }
      }
    },

    computed: {
      ...mapState({
        widgetsLoadingStates(state, getters) {
          return getters[`${this.namespace}/widgetsLoadingStates`];
        },

        widgetCalculationLoadingStates(state, getters) {
          return getters[`${this.namespace}/widgetCalculationLoadingStates`];
        }
      }),

      ...mapGetters(['fullscreen']),

      widgetById() {
        return keyBy(this.widgets, 'id');
      },

      // This enables auto scrolling to top when moving a widget
      // but only on firefox
      gridItemStyle() {
        return {
          'user-select': 'auto'
        };
      },

      lowestWidgetY() {
        return max(map(this.layout, ({ y, h }) => y + h));
      },

      actualNumberOfPlaceholderRows() {
        // if user is dragging the lowest widget to top, don't change number of rows because of bad UX
        if (
          this.isWidgetMoving &&
          this.lastNumberOfPlaceholderRows > this.numberOfPlaceholderRows
        ) {
          return this.lastNumberOfPlaceholderRows;
        }

        // Add additional 2 rows to widget grid if lowest widget outside the initial screen(e.i. it is scrolling)
        if (this.lowestWidgetY + 2 >= this.numberOfPlaceholderRows) {
          return this.numberOfPlaceholderRows + 2;
        }

        return this.numberOfPlaceholderRows;
      },

      sortedLayoutItems() {
        return sortBy(this.layout, 'y').reverse();
      }
    },

    methods: {
      widgetCardType(category) {
        return category === 'table' ? WidgetCardTable : WidgetCardGraph;
      },

      onDropdownOpen(id) {
        this.activeWidgetId = id;
        this.$emit('dropdown:open', id);
      },

      onDropdownClose() {
        this.$emit('dropdown:close');
      },

      onDuplicateWidgetClick(id) {
        this.$emit('widget:duplicate', id);
      },

      onEditWidgetClick(id) {
        this.$emit('widget:edit', id);
      },

      onConvertWidgetClick(id) {
        this.$emit('widget:convert', id);
      },

      onCopyWidgetClick(id) {
        this.$emit('widget:copy', id);
      },

      onExportWidgetClick(id) {
        this.$emit('widget:export', id);
      },

      onDeleteWidgetClick(id) {
        this.$emit('widget:delete', id);
      },

      onLayoutReady(layout) {
        this.$emit('layout:ready', layout);
      },

      onGridMounted() {
        if (this.scroll) {
          this.scrollToBottom();
        }
      },

      scrollToBottom: debounce(function () {
        this.$nextTick(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            left: 0,
            behavior: 'smooth'
          });
          this.$emit('scroll');
        });
      }, 300),

      findWidgetById(widgetId) {
        return this.widgets.find(({ id }) => id === widgetId);
      },

      determineMinWidgetDimensions(widgetId) {
        const widget = this.findWidgetById(widgetId);

        const dimensions = {
          width: MIN_CHART_WIDGET_WIDTH,
          height: MIN_CHART_WIDGET_HEIGHT
        };

        if (widget.category === widgetTypes.TABLE) {
          dimensions.width = MIN_TABLE_WIDGET_WIDTH;
          dimensions.height = MIN_TABLE_WIDGET_HEIGHT;
        }

        return dimensions;
      },

      determineMinWidgetWidth(widgetId) {
        return this.determineMinWidgetDimensions(widgetId).width;
      },

      determineMinWidgetHeight(widgetId) {
        return this.determineMinWidgetDimensions(widgetId).height;
      },

      onWidgetStart() {
        if (
          !this.isWidgetMoving ||
          this.numberOfPlaceholderRows > this.lastNumberOfPlaceholderRows
        ) {
          this.lastNumberOfPlaceholderRows = this.numberOfPlaceholderRows;
          this.isWidgetMoving = true;
        }
      },

      onWidgetStop() {
        this.isWidgetMoving = false;
      }
    },

    data() {
      return {
        gridConfig: {
          colNum: 32,
          rowHeight: 22,
          margin: [16, 16]
        },
        activeWidgetId: null,
        isWidgetMoving: false,
        numberOfPlaceholderRows: 0,
        lastNumberOfPlaceholderRows: 0
      };
    },
    mounted() {
      const resizeObserver = new ResizeObserver(([entry]) => {
        const contentBoxSize = entry.contentBoxSize || entry.contentRect;

        let blockSize = 0;

        // Chrome
        if (Array.isArray(contentBoxSize)) {
          blockSize = contentBoxSize[0].blockSize;
        }
        // Safari
        else if (contentBoxSize.height) {
          blockSize = contentBoxSize.height;
        }
        // Firefox
        else {
          blockSize = contentBoxSize.blockSize;
        }

        // magic number - row height
        this.numberOfPlaceholderRows = Math.ceil(blockSize / 38) + 1;

        if (
          this.isWidgetMoving &&
          this.numberOfPlaceholderRows > this.lastNumberOfPlaceholderRows
        ) {
          this.lastNumberOfPlaceholderRows = this.numberOfPlaceholderRows;
        }
      }).observe(this.$el);

      this.$once('hook:beforeDestroy', () => {
        if (!resizeObserver) {
          return;
        }
        resizeObserver.disconnect();
      });
    }
  };
</script>

<style lang="scss" module>
  .widget-card {
    height: 100%;
  }

  .wrapper {
    flex: 1;
    min-width: 576px;
    position: relative;

    &.active {
      margin-right: 0;
    }
  }

  .active-z-index {
    z-index: 4;
  }

  .widget-grid-item {
    border-radius: 4px;

    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
</style>
