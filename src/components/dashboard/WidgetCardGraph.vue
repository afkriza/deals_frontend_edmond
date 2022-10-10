<template>
  <WidgetDataFetcher
    :filters="combinedFilters"
    :widget="widget"
    :namespace="namespace"
    :expanded-filter-active="expandedFilterActive"
    @fetch:success="onFetchSuccess"
  >
    <template #default="{ model, isLoading, isError, isEmpty }">
      <WidgetCard
        :is-loading="isLoading"
        :is-error="isError"
        :is-empty="isEmpty"
        :widget-name="widget.name"
        :is-table="false"
        :owner="owner"
        v-on="$listeners"
      >
        <template v-if="model" #controls>
          <GraphWidgetControls
            :class="$style.controls"
            :selected-x-axis="selectedXAxis"
            :x-axis-options="xAxisOptions"
            :selected-y-axis="selectedYAxis"
            :y-axis-options="yAxisOptions"
            :selected-breakdown-category="selectedBreakdownCategory"
            :breakdown-categories="[
              'none',
              ...Object.keys(model.meta.categoryNames)
            ]"
            :selected-breakdown-time-granulation="
              selectedBreakdownTimeGranulation
            "
            :show-breakdown-time-granulation-dropdown="
              showBreakdownTimeGranulationDropdown
            "
            @x-axis:select="selectedXAxis = $event"
            @y-axis:add="onYAxisAdd"
            @y-axis:remove="onYAxisRemove"
            @breakdown-category:select="onBreakdownCategorySelect"
            @breakdown-time-granulation:select="
              selectedBreakdownTimeGranulation = $event
            "
          />
          <VPopover :popover-class="$style.popover" trigger="hover">
            <IconInfo />
            <template #popover>
              <div :class="$style.infoTooltip">
                <img
                  :class="$style.infoGif"
                  src="@/assets/images/img-chart-bar-breakdown_4x.gif"
                  alt="Chart breakdown"
                />
                <p>Breaks down this chart by the selected category.</p>
              </div>
            </template>
          </VPopover>
        </template>
        <template v-if="calculations && meta" #default>
          <GraphWidget
            :class="$style.graph"
            :representation="widget.representation"
            :calculations="widget.configuration.calculations"
            :calculation-values="selectedCalculationValuesCalculations"
            :x-axis="selectedCalculationValuesXAxis"
            :is-breakdown="isBreakdown"
          />
        </template>
      </WidgetCard>
    </template>
  </WidgetDataFetcher>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { VPopover } from 'v-tooltip';
  import {
    snakeCase,
    map,
    find,
    isNull,
    every,
    filter,
    includes,
    uniq
  } from 'lodash';

  import WidgetDataFetcher from '@/components/dashboard/WidgetDataFetcher.vue';
  import WidgetCard from '@/components/dashboard/WidgetCard.vue';
  import TableWidget from '@/components/dashboard/TableWidget.vue';
  import TextEllipsis from '@/components/core/TextEllipsis.vue';
  import GraphWidget from '@/components/analytics/graph-widget/GraphWidget.vue';
  import GraphWidgetControls from '@/components/analytics/graph-widget/GraphWidgetControls.vue';
  import IconInfo from '@/assets/images/icons/info.svg';
  import { MONTH } from '@/constants/widget';

  @Component({
    name: 'WidgetCardGraph',
    components: {
      GraphWidgetControls,
      GraphWidget,
      TextEllipsis,
      TableWidget,
      WidgetCard,
      WidgetDataFetcher,
      VPopover,
      IconInfo
    }
  })
  export default class WidgetCardGraph extends Vue {
    @Prop({
      type: Object,
      required: true
    })
    readonly widget: object;

    @Prop({
      type: String,
      required: true
    })
    readonly namespace: string;

    @Prop({
      type: String,
      required: true
    })
    readonly density: string;

    @Prop({
      type: Object,
      required: true
    })
    readonly filters: object;

    @Prop({
      type: Boolean,
      required: true
    })
    readonly expandedFilterActive: boolean;

    @Prop({
      type: Boolean
    })
    readonly owner: boolean;

    selectedXAxis = null;
    selectedYAxis = [];
    selectedBreakdownCategory = 'none';
    selectedBreakdownTimeGranulation = MONTH;

    get isBreakdown() {
      return (
        this.selectedBreakdownCategory &&
        this.selectedBreakdownCategory !== 'none'
      );
    }

    get showBreakdownTimeGranulationDropdown() {
      return /date/i.test(this.selectedBreakdownCategory);
    }

    get breakdownFilters() {
      if (this.selectedBreakdownCategory === 'none') {
        return null;
      }

      return {
        breakdown_category: snakeCase(this.selectedBreakdownCategory),
        ...(this.showBreakdownTimeGranulationDropdown
          ? {
              breakdown_category_granulation: snakeCase(
                this.selectedBreakdownTimeGranulation
              )
            }
          : null)
      };
    }

    get combinedFilters() {
      return {
        ...this.filters,
        ...this.breakdownFilters
      };
    }

    get selectedCalculationValues() {
      return find(this.calculations, [
        'category',
        snakeCase(this.selectedXAxis)
      ]);
    }

    get selectedCalculationValuesCalculations() {
      return filter(
        this.selectedCalculationValues.calculations,
        ({ rootCalculation }) => includes(this.selectedYAxis, rootCalculation)
      );
    }

    get selectedCalculationValuesXAxis() {
      return this.selectedCalculationValues.xAxis;
    }

    meta = null;
    calculations = null;

    xAxisOptions = null;
    yAxisOptions = null;

    onFetchSuccess({ calculations, meta }) {
      this.calculations = calculations;
      this.meta = meta;

      this.xAxisOptions = Object.keys(this.meta.xAxis);
      if (!this.selectedXAxis) {
        this.selectedXAxis = this.xAxisOptions[0];
      }

      this.yAxisOptions = uniq(
        map(
          find(this.calculations, ['category', snakeCase(this.selectedXAxis)])
            .calculations,
          'rootCalculation'
        )
      );
      this.selectedYAxis = [...this.yAxisOptions];
    }

    onBreakdownCategorySelect(breakdownCategory) {
      this.selectedBreakdownCategory = breakdownCategory;
    }

    get xAxisOptionsFiltered() {
      return filter(this.xAxisOptions, []);
    }

    onYAxisAdd(rootCalculationName) {
      this.selectedYAxis.push(rootCalculationName);
    }

    onYAxisRemove(rootCalculationName) {
      this.selectedYAxis = this.selectedYAxis.filter(
        name => name !== rootCalculationName
      );
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .graph {
    flex: 1;
  }

  .controls {
    margin-left: auto;
  }

  .info-tooltip {
    padding: 16px;
    width: 152px;
    height: 172px;
    background-color: $color-bg-light;
  }

  .info-gif {
    max-width: 100%;
    height: auto;
  }

  .popover :global(.popover-inner) {
    padding: 0;
  }

  .popover :global(.wrapper) {
    margin-top: 0;
  }
</style>
