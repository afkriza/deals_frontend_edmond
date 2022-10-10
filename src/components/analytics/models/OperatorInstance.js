import Operator from './Operator.js';

import { generateRandomHex } from 'utils/string';
import { expressionAttributeTypes } from 'enums/expression-attribute-types';
import { widgetOperatorSymbols } from 'enums/widget-operator-symbols';

export default class OperatorInstance extends Operator {
  constructor({ name, id = generateRandomHex() }) {
    super({ name });
    this.id = id;
  }

  get type() {
    return expressionAttributeTypes.OPERATOR;
  }

  get symbol() {
    return widgetOperatorSymbols[this.name];
  }

  static adaptKeys({ name, type }) {
    return {
      nodeType: type,
      operator: name,
      name
    };
  }

  static from(operator) {
    return new OperatorInstance(operator);
  }
}
