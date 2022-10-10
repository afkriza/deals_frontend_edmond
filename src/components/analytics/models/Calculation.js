import { keyBy } from 'lodash';

import CalculationFormatting from './CalculationFormatting.js';
import instantiate from './instantiate.js';
import { generateRandomHex } from 'utils/string';
import Variable from './Variable.js';
import Operator from './Operator.js';
import VariableInstance from './VariableInstance.js';
import OperatorInstance from './OperatorInstance.js';
import ExpressionInstance from './ExpressionInstance.js';
import SeriesSettings from './SeriesSettings.js';

/**
 * Calculation is made out of Variables and Operators
 */
export default class Calculation {
  constructor({
    formatting = CalculationFormatting.from(),
    id = generateRandomHex(),
    name,
    seriesSettings = null,
    elements,
    calculateTotalAsIndividual = false
  }) {
    if (!elements) {
      throw new Error('Expected at least one element instance');
    }

    this.formatting = formatting;
    this.id = id;
    this.name = name;
    this.seriesSettings = seriesSettings;
    this.elements = elements;
    this.calculateTotalAsIndividual = calculateTotalAsIndividual;
  }
  static from(calculation) {
    return new Calculation(calculation);
  }

  static adaptKeys({
    formatting,
    name,
    seriesSettings,
    elements,
    calculateTotalAsIndividual
  }) {
    return {
      name,
      calculateTotalAsIndividual,
      formatting: CalculationFormatting.adaptKeys(formatting),
      seriesSettings:
        seriesSettings && SeriesSettings.adaptKeys(seriesSettings),
      expressionAttributes: elements.map(expr => {
        if (expr instanceof VariableInstance) {
          return VariableInstance.adaptKeys(expr);
        } else if (expr instanceof OperatorInstance) {
          return OperatorInstance.adaptKeys(expr);
        } else if (expr instanceof ExpressionInstance) {
          return ExpressionInstance.adaptKeys(expr);
        }

        throw new Error('Unknown instance type.');
      })
    };
  }

  static deserialize({
    name,
    calculateTotalAsIndividual,
    seriesSettings,
    expression,
    formatting,
    variables
  }) {
    const variableIdVariableMap = keyBy(variables, 'variableId');

    return Calculation.from({
      name,
      seriesSettings:
        seriesSettings && SeriesSettings.deserialize(seriesSettings),
      calculateTotalAsIndividual,
      elements: expression
        ? expression.map(expr => {
            let element = null;
            let args = null;
            if (expr.nodeType === 'operator') {
              element = Operator.deserialize(expr);
            } else if (expr.nodeType === 'variable') {
              const variable = variableIdVariableMap[expr.variableId];

              element = Variable.deserialize({
                ...variable,
                name: expr.name
              });
              args = { operator: expr.function };
            }

            return instantiate(element, args);
          })
        : [],
      formatting: CalculationFormatting.deserialize(formatting)
    });
  }

  static generate({
    name,
    calculateTotalAsIndividual,
    seriesSettings,
    elements,
    formatting,
    id
  }) {
    return Calculation.from({
      name,
      id,
      seriesSettings:
        seriesSettings && SeriesSettings.deserialize(seriesSettings),
      calculateTotalAsIndividual,
      elements,
      formatting: CalculationFormatting.deserialize(formatting)
    });
  }

  get isNameManual() {
    const symbolsToEscape = ['+', '*', '(', ')'];
    let automaticName = this.automaticName;

    symbolsToEscape.forEach(symbol => {
      automaticName = automaticName.replace(symbol, '\\' + symbol);
    });

    const regex = '^' + automaticName + '(\\s\\(\\d+\\))?$';
    const r = new RegExp(regex);
    return !r.test(this.name);
  }

  get automaticName() {
    return this.elements
      .map(element => {
        if (element instanceof OperatorInstance) {
          return element.symbol;
        } else if (element instanceof VariableInstance) {
          return element.name.trim();
        }
      })
      .join(' ')
      .trim();
  }

  setAutomaticName() {
    this.name = this.automaticName;
  }
}
