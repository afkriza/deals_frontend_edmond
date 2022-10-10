import { keyBy } from 'lodash';

import Calculation from './Calculation.js';
import Variable from './Variable.js';
import Category from './Category.js';

import instantiate from './instantiate.js';
import CategoryInstance from './CategoryInstance.js';

import { calculationsOrientationEnum } from 'enums/calculations-orientation';

import { valuesCategory } from 'constants/widget-categories';
import { widgetTypes } from '@/enums/widget-types';

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
    variables
  }) {
    return {
      showColumnsTotal,
      showRowsTotal,
      calculationsOrientation:
        columns.map(({ id }) => id).indexOf(valuesCategory.id) !== -1
          ? calculationsOrientationEnum.COLUMNS
          : calculationsOrientationEnum.ROWS,
      filtersBlacklist,
      columnsAttributes: columns
        .filter(({ id }) => id !== valuesCategory.id)
        .map(CategoryInstance.adaptKeys),
      rowsAttributes: rows
        .filter(({ id }) => id !== valuesCategory.id)
        .map(CategoryInstance.adaptKeys),
      variablesAttributes: variables,
      calculationsAttributes: calculations.map(Calculation.adaptKeys)
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
    variables,
    categories,
    category
  }) {
    const categoryIdCategoryMap = keyBy(categories, 'id');

    const _columns = columns.map(col =>
      instantiate(Category.deserialize(categoryIdCategoryMap[col.name]), {
        granulation: col.granulation
      })
    );
    const _rows = rows.map(row =>
      instantiate(Category.deserialize(categoryIdCategoryMap[row.name]), {
        granulation: row.granulation
      })
    );

    if (category === widgetTypes.TABLE) {
      if (calculationsOrientation === calculationsOrientationEnum.ROWS) {
        _rows.push(valuesCategory);
      } else {
        _columns.push(valuesCategory);
      }
    }

    return WidgetConfiguration.from({
      calculations: calculations.map(calculation =>
        Calculation.deserialize({ ...calculation, variables })
      ), // have to send variables as well
      calculationsOrientation,
      columns: _columns,
      rows: _rows,
      filtersBlacklist,
      showColumnsTotal,
      showRowsTotal,
      variables: variables.map(Variable.deserialize)
    });
  }
}
