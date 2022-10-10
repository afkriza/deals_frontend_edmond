<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
  import { isEqual, isEmpty } from 'lodash';
  import { resolveLatest } from '@/utils/function';

  import TableWidget from '@/models/dashboard/TableWidget.model.js';
  import GraphWidget from '@/models/dashboard/GraphWidget.model.js';

  @Component({
    name: 'WidgetDataFetcher'
  })
  export default class WidgetDataFetcher extends Vue {
    @Prop({
      type: Object,
      required: true
    })
    readonly widget: { id: string; category: string };

    @Prop({
      type: String,
      required: true
    })
    readonly namespace: string;

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

    isLoading = false;
    isError = false;

    model = null;
    latestActiveFilters = null;
    resolveLatestFetchCalculations = resolveLatest(this.fetchCalculations);

    get widgetModelByWidgetCategory() {
      return {
        table: TableWidget,
        chart: GraphWidget
      };
    }

    get widgetAndFiltersData() {
      return {
        filters: this.filters,
        widget: this.widget
      };
    }

    @Watch('widgetAndFiltersData', { immediate: true, deep: true })
    onWidgetAndFiltersChange(newWidgetAndFiltersData, oldWidgetAndFiltersData) {
      const oldFilters = oldWidgetAndFiltersData
        ? oldWidgetAndFiltersData.filters
        : null;
      const oldWidget = oldWidgetAndFiltersData
        ? oldWidgetAndFiltersData.widget
        : null;
      const newFilters = newWidgetAndFiltersData
        ? newWidgetAndFiltersData.filters
        : null;
      const newWidget = newWidgetAndFiltersData
        ? newWidgetAndFiltersData.widget
        : null;

      if (
        (!newFilters ||
          isEmpty(newFilters) ||
          isEqual(newFilters, oldFilters)) &&
        (!newWidget || isEmpty(newWidget) || isEqual(newWidget, oldWidget))
      ) {
        return;
      }
      if (!this.expandedFilterActive) {
        this.fetchWidgetCalculations();
      }
    }

    @Watch('expandedFilterActive')
    onExpandChange(newValue) {
      if (!newValue && !isEqual(this.latestActiveFilters, this.filters)) {
        this.fetchWidgetCalculations();
      }
    }

    async fetchWidgetCalculations() {
      this.isError = false;
      this.isLoading = true;

      try {
        const { data: calculations, meta } =
          await this.resolveLatestFetchCalculations();
        this.latestActiveFilters = this.filters;

        this.model = new this.widgetModelByWidgetCategory[this.widget.category](
          this.widget,
          calculations,
          meta
        );

        this.$emit('fetch:success', { calculations, meta });
        this.isLoading = false;
      } catch (e) {
        if (e != 'stale') {
          this.isError = true;
          this.isLoading = false;
        }
      }
    }

    async fetchCalculations() {
      return await this.$store.dispatch(
        `${this.namespace}/fetchWidgetCalculations`,
        {
          widgetId: this.widget.id,
          filters: this.filters
        }
      );
    }

    render() {
      return this.$scopedSlots.default({
        model: this.model,
        isLoading: this.isLoading,
        isError: this.isError,
        isEmpty: Boolean(this.model && this.model.isEmpty)
      });
    }
  }
</script>
