<template>
  <div :class="$style.wrapper">
    <ApexChart
      :class="$style.apex"
      height="100%"
      :type="type"
      :options="options"
      :series="series"
    />
  </div>
</template>

<script>
  import ApexChart from 'vue-apexcharts';
  import {
    camelCase,
    every,
    findIndex,
    groupBy,
    keyBy,
    mapValues,
    size
  } from 'lodash';

  import chartColors from 'enums/chart-picker-colors';
  import { DEFAULT_LINE_THICKNESS } from 'enums/visual-formatting-line-thickness';
  import { widgetRepresentations } from 'enums/widget-representations';
  import ChartFormattingModel from 'components/analytics/models/ChartFormatting';
  import { generateOptions } from 'config/widgets/graph-widget';
  import {
    determineApexChartType,
    determineIfSpacedByStroke,
    determineIfStacked,
    determineStrokeWidth
  } from 'utils/widgets/graph';
  import { hasProperties } from '@/utils/validation';
  import { hexToRGBA } from '@/utils/color';

  export default {
    components: {
      ApexChart
    },

    props: {
      representation: {
        type: String,
        required: true
      },

      calculations: {
        type: Array,
        default: () => [],
        validator(calculations) {
          return every(calculations, calculation =>
            hasProperties(calculation, 'name', 'formatting', 'seriesSettings')
          );
        }
      },

      calculationValues: {
        type: Array,
        default: () => [],
        validator(calculationValues) {
          return every(calculationValues, calculationValue =>
            hasProperties(calculationValue, 'rootCalculation', 'name', 'values')
          );
        }
      },

      xAxis: {
        type: Array,
        default: () => []
      },

      isBreakdown: Boolean
    },

    computed: {
      deserializedGraphType() {
        return this.representation ? camelCase(this.representation) : '';
      },

      stacked() {
        return determineIfStacked(this.deserializedGraphType);
      },

      type() {
        return determineApexChartType(this.deserializedGraphType);
      },

      hasTransparentStroke() {
        return determineIfSpacedByStroke(this.deserializedGraphType);
      },

      isMixedChart() {
        return (
          this.deserializedGraphType === widgetRepresentations.MIXED_CHART.id
        );
      },

      options() {
        return generateOptions(
          this.xAxis,
          this.isMixedChart,
          this.stacked,
          this.hasTransparentStroke,
          [...this.series],
          this.seriesSettingsByCalculationValues,
          this.isBreakdown,
          this.deserializedGraphType
        );
      },

      seriesSettingsByCalculationValues() {
        return mapValues(keyBy(this.calculations, 'name'), calculation => {
          return {
            ...calculation.seriesSettings,
            opposite: this.stacked ? false : calculation.seriesSettings.opposite
          };
        });
      },

      numericFormattingByCalculationValues() {
        return mapValues(
          keyBy(this.calculations, 'name'),
          'formatting.numeric'
        );
      },

      series() {
        return this.calculationValues.map(
          ({ name, rootCalculation, values }, index) => {
            const seriesSettings =
              this.seriesSettingsByCalculationValues[rootCalculation];

            const serie = {
              name,
              data: values,
              numericFormatting:
                this.numericFormattingByCalculationValues[rootCalculation],
              seriesSettings,
              rootCalculation,
              color: this.selectedColorByName(rootCalculation, index, name),
              lineStyle: this.selectedLineStyleByName(rootCalculation),
              lineThickness: this.selectedLineThicknessByName(rootCalculation)
            };

            if (this.isMixedChart) {
              serie.type = seriesSettings.seriesType.toLowerCase();
            }
            return serie;
          }
        );
      },

      formatting() {
        return mapValues(keyBy(this.calculations, 'name'), 'formatting');
      },

      calculationValuesByRootCalculation() {
        return groupBy(this.calculationValues, 'rootCalculation');
      }
    },

    methods: {
      selectedColorByName(rootCalculation, index, name) {
        const rootColor =
          this.formatting[rootCalculation] &&
          this.formatting[rootCalculation].chart.color;

        if (!rootColor) {
          return chartColors[index % size(chartColors)];
        }

        if (this.isRootCalculationValue({ rootCalculation, name })) {
          return rootColor;
        }

        const idx = findIndex(
          this.calculationValuesByRootCalculation[rootCalculation],
          ['name', name]
        );

        const groupSize = size(
          this.calculationValuesByRootCalculation[rootCalculation]
        );

        return hexToRGBA(
          rootColor,
          // alpha(opacity) is in interval [0.4, 1] where calculation on index 0 has full opacity,
          // and last calculations has lower bound opacity(0.4 in this case)
          `${1 - ((idx / (Math.max(groupSize, 2) - 1)) * 40) / 100}`
        );
      },

      selectedLineStyleByName(name) {
        return this.formatting[name].chart &&
          this.formatting[name].chart.lineStyle
          ? this.formatting[name].chart.lineStyle
          : ChartFormattingModel.from().lineStyle;
      },

      selectedLineThicknessByName(name) {
        return this.formatting[name].chart &&
          this.formatting[name].chart.lineThickness
          ? this.formatting[name].chart.lineThickness
          : DEFAULT_LINE_THICKNESS;
      },

      isRootCalculationValue({ rootCalculation, name }) {
        return rootCalculation === name;
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .apex {
    /* stylelint-disable declaration-no-important */
    min-height: unset !important; // overrides the graph widget min height.

    /* stylelint-enable declaration-no-important */
  }

  .wrapper {
    width: 100%;
    padding-bottom: 28px;
  }
</style>
