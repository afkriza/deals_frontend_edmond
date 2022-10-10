<template>
  <basic-dropdown
    :class="$style.dropdown"
    :isOpen="isOpen"
    :customContentClass="$style.dropdownContentWrapper"
    :offset="{ vertical: 0 }"
    :resetAlignStyle="true"
    @dropdown:open="openDropdown"
    @dropdown:close="closeDropdown"
  >
    <div slot="trigger" :class="$style.trigger">
      <div :class="$style.nameWrapper">
        <component
          :class="$style.representationIcon"
          :is="images.active[widgetTypeCamelCase]"
        />
        <span>{{ widgetRepresentationName }}</span>
      </div>
    </div>
    <div :class="$style.dropdownContent">
      <div
        v-for="representation in widgetRepresentations"
        :key="representation.id"
        :class="$style.dropdownItem"
        @click="selectRepresentation(representation.id)"
      >
        <component
          :class="$style.representationIcon"
          :is="images.normal[representation.id]"
        />
        <span>{{ representation.name }}</span>
      </div>
    </div>
  </basic-dropdown>
</template>
<script>
  import BasicDropdown from 'components/core/BasicDropdown';

  import { widgetRepresentations } from 'enums/widget-representations';

  import Table from 'widget-type-icons/table.svg';
  import LineChart from 'widget-type-icons/line-chart.svg';
  import BarChart from 'widget-type-icons/bar-chart.svg';
  import AreaChartStacked from 'widget-type-icons/stacked-area-chart.svg';
  import BarChartStacked from 'widget-type-icons/stacked-bar-chart.svg';
  import ChartMixed from 'widget-type-icons/mixed-chart.svg';
  import AreaChart from 'widget-type-icons/area-chart.svg';

  import ActiveTable from 'widget-type-icons/table-active.svg';
  import ActiveLineChart from 'widget-type-icons/line-chart-active.svg';
  import ActiveBarChart from 'widget-type-icons/bar-chart-active.svg';
  import ActiveAreaChartStacked from 'widget-type-icons/stacked-area-chart-active.svg';
  import ActiveBarChartStacked from 'widget-type-icons/stacked-bar-chart-active.svg';
  import ActiveChartMixed from 'widget-type-icons/mixed-chart-active.svg';
  import ActiveAreaChart from 'widget-type-icons/area-chart-active.svg';

  export default {
    components: {
      BasicDropdown,
      Table,
      LineChart,
      BarChart,
      AreaChartStacked,
      BarChartStacked,
      ChartMixed,
      AreaChart,
      ActiveTable,
      ActiveLineChart,
      ActiveBarChart,
      ActiveAreaChartStacked,
      ActiveBarChartStacked,
      ActiveChartMixed,
      ActiveAreaChart
    },

    props: {
      widgetType: {
        type: String,
        required: true
      },

      isOpen: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      widgetTypeCamelCase() {
        return this.widgetType;
      },

      widgetRepresentationName() {
        return Object.values(widgetRepresentations).find(
          ({ id }) => id === this.widgetTypeCamelCase
        ).name;
      }
    },

    methods: {
      openDropdown() {
        this.$emit('dropdown:open');
      },

      closeDropdown() {
        this.$emit('dropdown:close');
      },

      selectRepresentation(id) {
        this.$emit('widgetType:select', id);
        this.closeDropdown();
      }
    },

    data() {
      return {
        widgetRepresentations,
        images: {
          normal: {
            table: Table,
            lineChart: LineChart,
            barChart: BarChart,
            areaChart: AreaChart,
            stackedAreaChart: AreaChartStacked,
            stackedBarChart: BarChartStacked,
            mixedChart: ChartMixed
          },
          active: {
            table: ActiveTable,
            lineChart: ActiveLineChart,
            barChart: ActiveBarChart,
            areaChart: ActiveAreaChart,
            stackedAreaChart: ActiveAreaChartStacked,
            stackedBarChart: ActiveBarChartStacked,
            mixedChart: ActiveChartMixed
          }
        }
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .trigger {
    @include arrow;

    display: flex;
    align-items: center;
    justify-content: space-between;

    font-weight: bold;

    height: 50px;
    padding: 0 25px;

    color: $color-text-light;
    border-bottom: 1px solid $color-border-primary-darkest;
  }

  .name-wrapper {
    @include flex-center;
  }

  .dropdown-item {
    display: flex;
    align-items: center;

    height: 48px;
    padding: 0 15px;

    transition: 0.2s background-color;

    cursor: pointer;

    &:hover {
      background-color: $color-bg-primary-dimmed;
    }
  }

  .dropdown-content-wrapper {
    min-width: auto;
    left: 25px;
    right: 25px;
  }

  .representation-icon {
    margin-right: 10px;
  }
</style>
