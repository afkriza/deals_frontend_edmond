import { generateRandomHex } from 'utils/string';
import { expressionAttributeTypes } from 'enums/expression-attribute-types';
import widgetOperators from 'enums/widget-operators';
import { widgetVariableOperatorsEnum } from 'enums/widget-variable-operators';

import ConditionalFormatting from 'classes/analytics/ConditionalFormatting';

const widgetVariableOperators = Object.values(widgetVariableOperatorsEnum);

function _getWidgetCategory(category, widgetCategories) {
  return widgetCategories.find(
    widgetCategory => category.name === widgetCategory.id
  );
}

function _serializeCalculationValues(values) {
  return values.map(value => {
    return {
      nodeType: value.type,
      function:
        value.type === expressionAttributeTypes.VARIABLE
          ? value.operator.id
          : null,
      operator:
        value.type === expressionAttributeTypes.OPERATOR ? value.name : null,
      name: value.name,
      variableId:
        value.type === expressionAttributeTypes.VARIABLE
          ? value.variableId
          : null
    };
  });
}

function _deserializeFormatting(formatting) {
  return {
    numeric: formatting.numeric,
    conditional:
      formatting.conditional && formatting.conditional.length
        ? formatting.conditional.map(condition =>
            new ConditionalFormatting(condition).deserialize()
          )
        : []
  };
}

function deserializeCalculationValues(values, variables) {
  return values.map(value => {
    if (value.nodeType === expressionAttributeTypes.VARIABLE) {
      const activeVariable = variables.find(
        variable => variable.variableId === value.variableId
      );

      return {
        ...activeVariable,
        operator: widgetVariableOperators.find(
          ({ id }) => id === value.function
        )
      };
    }

    return {
      name: value.name,
      icon: widgetOperators.find(({ name }) => value.operator === name).icon,
      type: expressionAttributeTypes.OPERATOR
    };
  });
}

function serializeCategories(categories) {
  if (!categories.length) {
    return [];
  }

  return categories.map(category => {
    return {
      name: category.id,
      sort: 'asc',
      granulation: category.granulation || null
    };
  });
}

function serializeVariables(variables) {
  return variables.map(variable => {
    return {
      name: variable.name,
      metric: variable.metric,
      context: variable.context,
      yearOffset: variable.yearOffset,
      dayOffset: variable.dayOffset,
      variableId: variable.variableId,
      sort: 'asc'
    };
  });
}

function serializeCalculations(calculations) {
  return calculations.map(calculation => {
    return {
      name: calculation.name,
      sort: 'asc',
      formatting: calculation.formatting,
      seriesSettings: calculation.seriesSettings,
      expressionAttributes: _serializeCalculationValues(calculation.values)
    };
  });
}

function deserializeCategories(categories, widgetCategories) {
  if (!categories.length) {
    return [];
  }

  return categories.map(category => {
    const categoryDetails = _getWidgetCategory(category, widgetCategories);

    return {
      granulation: category.granulation,
      id: category.name,
      name: categoryDetails.name,
      timeGranulation: categoryDetails.timeGranulation
    };
  });
}

function deserializeVariables(variables) {
  return variables.map(variable => {
    return {
      ...variable,
      type: expressionAttributeTypes.VARIABLE
    };
  });
}

function deserializeValues(values, variables) {
  return values.map(value => {
    return {
      id: generateRandomHex(),
      formatting: _deserializeFormatting(value.formatting),
      name: value.name,
      seriesSettings: value.seriesSettings,
      values: deserializeCalculationValues(value.expression, variables)
    };
  });
}

export {
  deserializeCategories,
  deserializeValues,
  deserializeVariables,
  serializeCategories,
  serializeVariables,
  serializeCalculations
};
