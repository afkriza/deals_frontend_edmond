<template>
  <app-modal width="560px" @close="close">
    <template v-slot:headerContent>
      <CloseIcon :class="$style.closeBtn" @click="close" />
      <h2 :class="$style.title">{{ title }}</h2>
    </template>
    <div :class="$style.content">
      <div
        v-for="graphTypeItem in widgetRepresentations"
        :key="graphTypeItem.id"
        :class="[
          $style.widgetType,
          { [$style.isActive]: graphTypeItem.id === currentGraphTypeCamelCase }
        ]"
        @click="onGraphTypeClick(graphTypeItem.id)"
      >
        <component :class="$style.icon" :is="graphTypeItem.icon" />
        <p :class="$style.widgetTypeName">{{ graphTypeItem.name }}</p>
      </div>
    </div>
    <template></template>
  </app-modal>
</template>

<script>
  import AppModal from 'components/modals/AppModal';

  import { widgetRepresentations } from 'enums/widget-representations';
  import { toCamelCase } from 'utils/string';

  import Table from '@/assets/images/icons/widget-types/table.svg';
  import LineChart from '@/assets/images/icons/widget-types/chart-line.svg';
  import AreaChartStacked from '@/assets/images/icons/widget-types/chart-area-stacked.svg';
  import BarChart from '@/assets/images/icons/widget-types/chart-bar.svg';
  import BarChartStacked from '@/assets/images/icons/widget-types/chart-bar-stacked.svg';
  import ChartMixed from '@/assets/images/icons/widget-types/chart-mixed.svg';
  import AreaChart from '@/assets/images/icons/widget-types/chart-area.svg';

  import CloseIcon from '@/assets/images/icons/close-2px.svg';

  export default {
    components: {
      AppModal,
      Table,
      LineChart,
      AreaChartStacked,
      BarChart,
      BarChartStacked,
      ChartMixed,
      AreaChart,
      CloseIcon
    },

    props: {
      graphType: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      }
    },

    computed: {
      isValid() {
        return Boolean(this.currentGraphType);
      }
    },

    methods: {
      onGraphTypeClick(type) {
        this.currentGraphType = type;
        this.onSubmit();
      },

      close() {
        this.$emit('close');
      },

      onSubmit() {
        this.$emit('submit', this.currentGraphType);
        this.close();
      }
    },

    data() {
      return {
        currentGraphType: this.graphType,
        currentGraphTypeCamelCase: toCamelCase(this.graphType),
        widgetRepresentations
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  $transition-duration: 0.2s;

  .content {
    display: grid;

    grid-template-columns: repeat(3, 128px);
    grid-column-gap: 48px;
    grid-row-gap: 48px;

    padding: 15px 40px 0;
  }

  .title {
    font-size: 20px;
    line-height: 1.6;
    margin: 0;

    color: $color-text-main;
  }

  .widget-type {
    font-size: 14px;

    margin: 10px 0 0;
    text-align: center;

    cursor: pointer;

    transition-property: font-weight, color;
    transition-duration: $transition-duration;

    &.is-active {
      font-weight: bold;
      color: $color-text-primary;

      .icon {
        border-color: $color-border-primary;
      }
    }
  }

  .icon {
    border-width: 2px;
    border-style: solid;
    border-color: transparent;
    border-radius: 4px;

    &.active,
    &:hover {
      border-color: $color-border-main-light;
    }
  }

  .widget-type-name {
    margin-bottom: 0px;
  }

  .closeBtn {
    float: right;
    margin-top: -21px;
    margin-right: -10px;
    cursor: pointer;
  }
</style>
