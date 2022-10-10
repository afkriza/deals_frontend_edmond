import Variable from './Variable.js';

import { toPascalCase, generateRandomHex } from 'utils/string';
import { expressionAttributeTypes } from 'enums/expression-attribute-types';

import { SUM } from 'constants/widget-operators';

export default class VariableInstance extends Variable {
  constructor({
    context,
    dayOffset,
    metric,
    name,
    variableId,
    yearOffset,
    id = generateRandomHex(),
    operator = SUM
  }) {
    super({ context, dayOffset, metric, name, variableId, yearOffset });
    this.id = id;
    this.operator = operator;
  }

  get operatorIcon() {
    return toPascalCase(this.operator);
  }

  get type() {
    return expressionAttributeTypes.VARIABLE;
  }

  static adaptKeys({ variableId, name, type, operator }) {
    return {
      nodeType: type,
      function: operator,
      name,
      variableId
    };
  }

  static from(variable) {
    return new VariableInstance(variable);
  }
}
