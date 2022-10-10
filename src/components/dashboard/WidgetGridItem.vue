<template>
  <div v-if="isLoading" :class="$style.loader">
    <bounce-spinner />
    <p :class="$style.loadingText">Loading widget…</p>
  </div>
  <div v-else-if="isConfigurationError" :class="$style.loader">
    <empty-state>
      <template v-slot:image>
        <!-- @svg("error-state-widget") -->
      </template>
      <template v-slot:title>
        Something went wrong
      </template>
      <template v-slot:text>
        Please try again.
      </template>
    </empty-state>
  </div>
  <div v-else :class="$style.wrapper">
    <widget-grid-item-header
      :widget="widget"
      :displayDensity="displayDensity"
      :hasCopyButton="hasCopyButton"
      :isDropdownOpen="isDropdownOpen"
      :readonly="readonly"
      :isActive="isActive"
      @dropdown:open="onDropdownOpen"
      @dropdown:close="onDropdownClose"
      @widget:edit="onEditWidgetClick"
      @widget:convert="onConvertWidgetClick"
      @widget:copy="onCopyWidgetClick"
      @widget:duplicate="onDuplicateWidgetClick"
      @widget:export="onExportWidgetClick"
      @widget:delete="onDeleteWidgetClick"
    />
    <div v-if="isCalculationError" :class="$style.loader">
      <empty-state>
        <template v-slot:image>
          <!-- @svg("error-state-widget") -->
        </template>
        <template v-slot:title>
          Something went wrong
        </template>
        <template v-slot:text>
          Please try again.
        </template>
      </empty-state>
    </div>
    <template v-if="isLoaded">
      <div v-if="!isWidgetEmpty" :class="$style.widgetWrapper">
        <TableWidget
          :class="$style.tableWidget"
          v-if="widget.category === widgetRepresentations.TABLE.id"
          :density="displayDensity"
          :column-header="tableWidgetColumnHeader"
          :row-header="tableWidgetRowHeader"
          :data="tableWidgetData"
          :separators="tableWidgetSeparators"
        >
          <template #dataCell="{ rows, columns, data }">
            <text-ellipsis
              :key="cellText(rows, columns, data) + displayDensity"
              :style="cellStyle(rows, columns, data)"
              :text="cellText(rows, columns, data)"
            />
          </template>
        </TableWidget>
        <graph-widget
          v-else
          :calculations="calculations.data"
          :widget="widget"
          :xAxis="calculations.meta.xAxis"
          :categoryNames="calculations.meta.categoryNames"
        />
      </div>
      <div v-else :class="$style.emptyState">
        <div :class="$style.emptyStateImage">
          <!-- @svg("emptystate-widget") -->
        </div>
        <div :class="$style.emptyStateText">
          <h2 :class="$style.emptyStateHeading">
            No results match the filter criteria
          </h2>
          <p :class="$style.emptyStateDescription">
            Try using fewer filters or expanding your criteria (longer time
            range, more hotels…).
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import { widgetRepresentations } from 'enums/widget-representations';

  import EmptyState from 'components/app/EmptyState';
  import BounceSpinner from 'components/core/BounceSpinner';
  import GraphWidget from 'components/analytics/graph-widget/GraphWidget';
  import WidgetGridItemHeader from 'components/dashboard/WidgetGridItemHeader';

  import TableWidget from 'components/dashboard/TableWidget';
  import { percentify } from '@/utils/string';
  import { find, isEmpty, keyBy, map } from 'lodash';
  import ConditionalFormatting from '@/classes/analytics/ConditionalFormatting';
  import textPickerColors from '@/enums/text-picker-colors';
  import { numericFormattingTypesEnum } from '@/enums/numeric-formatting-types';
  import currenciesEnum from '@/enums/currencies';
  import { VTooltip } from 'v-tooltip';
  import TextEllipsis from '@/components/core/TextEllipsis';

  export default {
    components: {
      TextEllipsis,
      BounceSpinner,
      EmptyState,
      GraphWidget,
      WidgetGridItemHeader,
      TableWidget
    },

    directives: {
      tooltip: VTooltip
    },

    props: {
      widget: {
        type: Object,
        required: true
      },

      readonly: {
        type: Boolean,
        required: true
      },

      displayDensity: {
        type: String,
        required: true
      },

      isLoading: {
        type: Boolean,
        required: true
      },

      isLoaded: {
        type: Boolean,
        required: true
      },

      isCalculationError: {
        type: Boolean,
        required: true
      },

      isConfigurationError: {
        type: Boolean,
        required: true
      },

      isActive: {
        type: Boolean,
        default: false
      },

      isDropdownOpen: {
        type: Boolean,
        default: false
      },

      hasCopyButton: {
        type: Boolean,
        default: false
      },

      calculations: {
        type: Object,
        default: () => ({})
      },

      configuration: {
        type: Object,
        default: () => ({})
      }
    },

    computed: {
      tableWidgetColumnHeader() {
        const { columns, showColumnsTotal } = this.configuration;
        if (
          !columns.length &&
          this.areCalculationsRowOriented &&
          !showColumnsTotal
        ) {
          return null;
        }

        const columnHeaderGroupIds = [];
        if (columns.length || !this.areCalculationsRowOriented) {
          columnHeaderGroupIds.push('main');
        }
        if (showColumnsTotal) {
          columnHeaderGroupIds.push('total');
        }

        const mainGroupCategoryIds = Object.keys(this.calculations.meta.xAxis);
        const mainGroupCategoryValuesByCategoryId = {
          ...this.calculations.meta.xAxis
        };

        if (!this.areCalculationsRowOriented) {
          mainGroupCategoryIds.push('value');
          mainGroupCategoryValuesByCategoryId.value = this.calculationNames;
        }

        return {
          groupIds: columnHeaderGroupIds,
          categoriesByGroupId: {
            main: {
              categoryIds: mainGroupCategoryIds,
              categoryValuesByCategoryId: mainGroupCategoryValuesByCategoryId
            },
            total: {
              categoryIds: !this.areCalculationsRowOriented
                ? ['total', 'value']
                : ['total'],
              categoryValuesByCategoryId: {
                total: ['Total'],
                value: this.calculationNames || []
              }
            }
          }
        };
      },
      tableWidgetRowHeader() {
        const { rows, showRowsTotal } = this.configuration;
        if (
          !rows.length &&
          !this.areCalculationsRowOriented &&
          !showRowsTotal
        ) {
          return null;
        }

        const mainGroupCategoryIds = Object.keys(this.calculations.meta.yAxis);
        const mainGroupCategoryValuesByCategoryId = {
          ...this.calculations.meta.yAxis
        };

        if (this.areCalculationsRowOriented) {
          mainGroupCategoryIds.push('value');
          mainGroupCategoryValuesByCategoryId.value = this.calculationNames;
        }

        let rowHeaderGroupIds = [];
        if (mainGroupCategoryIds.length) {
          if (mainGroupCategoryIds.length > 1) {
            const [firstHeaderId] = mainGroupCategoryIds;
            rowHeaderGroupIds = [
              ...mainGroupCategoryValuesByCategoryId[firstHeaderId]
            ];
          } else {
            rowHeaderGroupIds = ['main'];
          }
        }

        if (showRowsTotal) {
          rowHeaderGroupIds.push('total');
        }

        const otherGroupCategories = rowHeaderGroupIds.reduce(
          (acc, groupId) => {
            if (groupId === 'main' || groupId === 'total') {
              return acc;
            }
            const categoryIds = mainGroupCategoryIds;
            const categoryValuesByCategoryId = {
              ...mainGroupCategoryValuesByCategoryId
            };
            const [headId] = mainGroupCategoryIds;

            categoryValuesByCategoryId[headId] = categoryValuesByCategoryId[
              headId
            ].filter(value => value === groupId);

            acc[groupId] = {
              categoryIds,
              categoryValuesByCategoryId
            };

            return acc;
          },
          {}
        );

        return {
          groupIds: rowHeaderGroupIds,
          categoriesByGroupId: {
            main: {
              categoryIds: mainGroupCategoryIds,
              categoryValuesByCategoryId: mainGroupCategoryValuesByCategoryId
            },
            ...otherGroupCategories,
            total: {
              categoryIds: this.areCalculationsRowOriented
                ? ['total', 'value']
                : ['total'],
              categoryValuesByCategoryId: {
                total: ['Total'],
                value: this.calculationNames || []
              }
            }
          }
        };
      },
      tableWidgetData() {
        const isRowOrientation =
          this.configuration.calculationsOrientation === 'rows';

        return this.calculations.data.flatMap(
          ({ xAxis, yAxis, calculations }) => {
            return calculations.map(calculation => {
              const row = { ...yAxis };
              const column = { ...xAxis };
              if (isRowOrientation) {
                row.value = calculation.name;
              } else {
                column.value = calculation.name;
              }
              return {
                row,
                column,
                value: calculation.value
              };
            });
          }
        );
      },
      tableWidgetSeparators() {
        const separatedCalculations = this.configuration.calculations
          .filter(calculation => calculation.formatting.hasSeparator)
          .map(({ name }) => ({ value: name }));

        return {
          [this.areCalculationsRowOriented
            ? 'rows'
            : 'columns']: separatedCalculations
        };
      },
      isWidgetEmpty() {
        return this.calculations.meta.emptyResults;
      },
      areCalculationsRowOriented() {
        return this.configuration.calculationsOrientation === 'rows';
      },
      calculationByCalculationName() {
        return keyBy(this.configuration.calculations, 'name');
      },
      calculationNames() {
        return map(this.configuration.calculations, 'name');
      }
    },

    methods: {
      calculationFromRowsOrColumns(rows, columns) {
        let calculation = this.calculationByCalculationName[rows && rows.value];

        if (!calculation) {
          calculation = this.calculationByCalculationName[
            columns && columns.value
          ];
        }

        return calculation;
      },

      toDecimal(value, decimalPlaces) {
        return value.toLocaleString('de', {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces
        });
      },

      toPercentage(value, places, asOffset) {
        return asOffset
          ? percentify(
              this.handlePrefix(this.toDecimal((value - 1) * 100, places))
            )
          : percentify(this.toDecimal(value * 100, places));
      },

      toCurrency(value, type, decimalPlaces) {
        return value.toLocaleString('de', {
          style: 'currency',
          currency: currenciesEnum.find(({ name }) => name === type).abbr,
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces
        });
      },

      handlePrefix(value) {
        return value > 0 ? `+${value}` : value;
      },

      cellText(rows, columns, data) {
        if (!(data && data.value)) {
          return '-';
        }

        const { value } = data;

        const calculation = this.calculationFromRowsOrColumns(rows, columns);

        const { formatting } = calculation;

        const { numeric: numericFormatting } = formatting;

        if (!numericFormatting || isEmpty(numericFormatting)) {
          return value.toLocaleString();
        }

        if (numericFormatting.type === numericFormattingTypesEnum.NUMBER) {
          return this.toDecimal(value, numericFormatting.decimalPlaces);
        } else if (
          numericFormatting.type === numericFormattingTypesEnum.PERCENTAGE
        ) {
          return this.toPercentage(
            value,
            numericFormatting.decimalPlaces,
            numericFormatting.percentageChange
          );
        } else if (
          numericFormatting.type === numericFormattingTypesEnum.CURRENCY
        ) {
          return this.toCurrency(
            value,
            numericFormatting.currency,
            numericFormatting.decimalPlaces
          );
        }

        return value;
      },

      placeholderCellSeparatorClass(columns) {
        const calculation = this.calculationFromRowsOrColumns(columns);

        if (!calculation) {
          return null;
        }

        const { formatting } = calculation;

        const { hasSeparator } = formatting;

        if (hasSeparator) {
          return this.$style.separatorRight;
        }

        return null;
      },

      cellWrapperSeparatorClass(rows, columns) {
        const calculation = this.calculationFromRowsOrColumns(rows, columns);

        const { formatting } = calculation;

        const { hasSeparator } = formatting;

        if (hasSeparator) {
          if (this.areCalculationsRowOriented) {
            return this.$style.separatorBottom;
          }

          return this.$style.separatorRight;
        }

        return null;
      },

      cellStyle(rows, columns, data) {
        const style = {};

        const calculation = this.calculationFromRowsOrColumns(rows, columns);

        const { formatting } = calculation;

        const { conditional } = formatting;

        if (conditional && data && data.value) {
          const { value } = data;
          const firstMetConditionFormatting = find(
            map(conditional, ConditionalFormatting.from),
            formatting => formatting.isRuleMet(value)
          );

          if (firstMetConditionFormatting) {
            const { backgroundColor, textColor } = firstMetConditionFormatting;

            style.padding = '2px 6px';
            style.borderRadius = '4px';
            style.backgroundColor = backgroundColor;
            style.color = textColor;
            style.border = `1px solid ${this.findBorderColorByTextColor(
              textColor
            )}`;
          }
        }

        if ((rows && rows.total) || (columns && columns.total)) {
          style.fontWeight = 'bold';
        }

        return style;
      },

      findBorderColorByTextColor(textColor) {
        // Fallback for case where old text color is used for conditional formatting
        // Hopefully won't be necessary later
        const colorData = find(textPickerColors, ['value', textColor]);

        return colorData ? colorData.border : 'transparent';
      },

      onDropdownOpen() {
        this.$emit('dropdown:open', this.widget.id);
      },

      onDropdownClose() {
        this.$emit('dropdown:close');
      },

      onEditWidgetClick() {
        this.$emit('widget:edit', this.widget.id);
      },

      onConvertWidgetClick() {
        this.$emit('widget:convert', this.widget.id);
      },

      onCopyWidgetClick() {
        this.$emit('widget:copy', this.widget.id);
      },

      onDuplicateWidgetClick() {
        this.$emit('widget:duplicate', this.widget.id);
      },

      onExportWidgetClick() {
        this.$emit('widget:export', this.widget.id);
      },

      onDeleteWidgetClick() {
        this.$emit('widget:delete', this.widget.id);
      }
    },

    data() {
      return {
        widgetRepresentations
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .table-widget {
    width: 100%;
  }

  .table-cell-wrapper {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
    padding: 0 6px;

    &.separator-bottom {
      border-bottom: 1px solid black;
    }

    &.separator-right::after {
      position: absolute;
      content: '';
      width: 1px;
      height: 26px;
      background-color: black;
      right: 0;
    }
  }

  .table-cell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .placeholder-cell {
    position: relative;
    display: flex;
    flex: 1;

    &.separator-right::after {
      position: absolute;
      content: '';
      width: 1px;
      top: -1px;
      bottom: -1px;
      background-color: black;
      right: 0;
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;

    height: 100%;

    .is-new {
      transition: box-shadow 0.3s;
      box-shadow: $dashboard-grid-item-active-shadow;
    }
  }

  .widget-wrapper {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .loader {
    @include stretch;
    @include flex-center($flex-direction: column);
  }

  .loading-text {
    margin-top: 40px;

    color: $color-text-main-lighter;
  }

  .empty-state {
    @include flex-center($flex-direction: column);

    height: calc(100% - 65px);

    color: $color-text-main-light;
    padding: 20px;
    font-size: 14px;
    text-align: center;

    &-text {
      width: 332px;
      max-width: 71.42%;
    }

    &-heading {
      margin-top: 6px;
      margin-bottom: 8px;
      font-size: inherit;
      font-weight: bold;
    }

    &-image {
      max-width: 32.58%;
      height: 70%;

      /* stylelint-disable selector-max-type */
      > svg {
        max-width: 100%;
        max-height: 100%;
        height: auto;
      }

      /* stylelint-enable selector-max-type */
    }

    &-description {
      margin-top: 0;
    }
  }
</style>
