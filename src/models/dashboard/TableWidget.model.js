import { find, isEmpty, keyBy, map } from 'lodash';
import { percentify } from '@/utils/string';
import ConditionalFormatting from '@/classes/analytics/ConditionalFormatting';
import textPickerColors from '@/enums/text-picker-colors';
import { numericFormattingTypesEnum } from '@/enums/numeric-formatting-types';
import currenciesEnum from '@/enums/currencies';

export default class TableWidget {
  constructor(widget, calculations, meta) {
    this.widget = widget;
    this.calculations = calculations;
    this.meta = meta;
  }

  get component() {
    return 'TableWidget';
  }

  get props() {
    return {
      columnHeader: this.columnHeader,
      rowHeader: this.rowHeader,
      data: this.tableData,
      separators: this.separators
    };
  }

  get isEmpty() {
    return this.meta.emptyResults;
  }

  get columnHeader() {
    const { columns, showColumnsTotal } = this.widget.configuration;
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

    const mainGroupCategoryIds = Object.keys(this.meta.xAxis);
    const mainGroupCategoryValuesByCategoryId = {
      ...this.meta.xAxis
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
  }

  get rowHeader() {
    const { rows, showRowsTotal } = this.widget.configuration;
    if (!rows.length && !this.areCalculationsRowOriented && !showRowsTotal) {
      return null;
    }

    const mainGroupCategoryIds = Object.keys(this.meta.yAxis);
    const mainGroupCategoryValuesByCategoryId = {
      ...this.meta.yAxis
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

    const otherGroupCategories = rowHeaderGroupIds.reduce((acc, groupId) => {
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
    }, {});

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
  }

  get tableData() {
    const isRowOrientation =
      this.widget.configuration.calculationsOrientation === 'rows';

    return this.calculations.flatMap(({ xAxis, yAxis, calculations }) => {
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
    });
  }

  get separators() {
    const separatedCalculations = this.widget.configuration.calculations
      .filter(calculation => calculation.formatting.hasSeparator)
      .map(({ name }) => ({ value: name }));

    return {
      [this.areCalculationsRowOriented
        ? 'rows'
        : 'columns']: separatedCalculations
    };
  }

  get areCalculationsRowOriented() {
    return this.widget.configuration.calculationsOrientation === 'rows';
  }

  get calculationByCalculationName() {
    return keyBy(this.widget.configuration.calculations, 'name');
  }

  get calculationNames() {
    return map(this.widget.configuration.calculations, 'name');
  }

  calculationFromRowsOrColumns(rows, columns) {
    let calculation = this.calculationByCalculationName[rows && rows.value];

    if (!calculation) {
      calculation = this.calculationByCalculationName[columns && columns.value];
    }

    return calculation;
  }

  toDecimal(value, decimalPlaces) {
    return value.toLocaleString('de', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    });
  }

  toPercentage(value, places, asOffset) {
    return asOffset
      ? percentify(this.handlePrefix(this.toDecimal((value - 1) * 100, places)))
      : percentify(this.toDecimal(value * 100, places));
  }

  toCurrency(value, type, decimalPlaces) {
    return value.toLocaleString('de', {
      style: 'currency',
      currency: currenciesEnum.find(({ name }) => name === type).abbr,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    });
  }

  handlePrefix(value) {
    return value > 0 ? `+${value}` : value;
  }

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
    } else if (numericFormatting.type === numericFormattingTypesEnum.CURRENCY) {
      return this.toCurrency(
        value,
        numericFormatting.currency,
        numericFormatting.decimalPlaces
      );
    }

    return value;
  }

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
  }

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
  }

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
  }

  findBorderColorByTextColor(textColor) {
    // Fallback for case where old text color is used for conditional formatting
    // Hopefully won't be necessary later
    const colorData = find(textPickerColors, ['value', textColor]);

    return colorData ? colorData.border : 'transparent';
  }
}
