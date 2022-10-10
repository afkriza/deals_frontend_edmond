import Calculation from './Calculation.js';
import ExpressionInstance from './ExpressionInstance';

export default class WidgetConfiguration {
  constructor({
    calculations = [],
    calculationsOrientation,
    columns = [],
    rows = [],
    filtersBlacklist = [],
    showColumnsTotal = false,
    showRowsTotal = false,
    variables = []
  }) {
    this.calculations = calculations;
    this.calculationsOrientation = calculationsOrientation;
    this.columns = columns;
    this.rows = rows;
    this.filtersBlacklist = filtersBlacklist;
    this.showColumnsTotal = showColumnsTotal;
    this.showRowsTotal = showRowsTotal;
    this.variables = variables;
  }

  static from(configuration = {}) {
    return new WidgetConfiguration(configuration);
  }

  static adaptKeys({
    calculations,
    columns,
    rows,
    filtersBlacklist,
    showColumnsTotal,
    showRowsTotal,
    variables,
    calculationsOrientation
  }) {
    const calculationsWitdExpressionInstance = calculations.map(
      calculcation => {
        return {
          ...calculcation,
          elements: calculcation.expression.map(expresionItem => {
            return ExpressionInstance.from(expresionItem);
          })
        };
      }
    );

    return {
      showColumnsTotal,
      showRowsTotal,
      calculationsOrientation,
      filtersBlacklist,
      columnsAttributes: columns,
      rowsAttributes: rows,
      variablesAttributes: variables,
      calculationsAttributes: calculationsWitdExpressionInstance.map(
        Calculation.adaptKeys
      )
    };
  }

  static deserialize({
    calculations,
    calculationsOrientation,
    columns,
    rows,
    filtersBlacklist,
    showColumnsTotal,
    showRowsTotal,
    variables
  }) {
    return WidgetConfiguration.from({
      calculations: calculations.map(calculation =>
        Calculation.deserialize({ ...calculation, variables })
      ),
      calculationsOrientation,
      columns,
      rows,
      filtersBlacklist,
      showColumnsTotal,
      showRowsTotal,
      variables
    });
  }
}
