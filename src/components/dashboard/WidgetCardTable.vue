<template>
  <WidgetDataFetcher
    :filters="filters"
    :widget="widget"
    :namespace="namespace"
    :expanded-filter-active="expandedFilterActive"
  >
    <template #default="{ model, isLoading, isError, isEmpty }">
      <WidgetCard
        :is-loading="isLoading"
        :is-error="isError"
        :is-empty="isEmpty"
        :widget-name="widget.name"
        :is-table="true"
        :owner="owner"
        v-on="$listeners"
      >
        <template v-if="model" #default>
          <TableWidget
            :class="$style.table"
            :density="density"
            v-bind="model.props"
          >
            <template #dataCell="{ rows, columns, data }">
              <TextEllipsis
                :key="model.cellText(rows, columns, data) + density"
                :style="model.cellStyle(rows, columns, data)"
                :text="model.cellText(rows, columns, data)"
                track
              />
            </template>
          </TableWidget>
        </template>
      </WidgetCard>
    </template>
  </WidgetDataFetcher>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import WidgetDataFetcher from '@/components/dashboard/WidgetDataFetcher.vue';
  import WidgetCard from '@/components/dashboard/WidgetCard.vue';
  import TableWidget from '@/components/dashboard/TableWidget.vue';
  import TextEllipsis from '@/components/core/TextEllipsis.vue';

  @Component({
    name: 'WidgetCardTable',
    components: { TextEllipsis, TableWidget, WidgetCard, WidgetDataFetcher }
  })
  export default class WidgetCardTable extends Vue {
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
  }
</script>

<style lang="scss" module>
  .table {
    min-width: fit-content;
    max-width: 100%;
  }
</style>
