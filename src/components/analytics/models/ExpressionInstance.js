import { expressionAttributeTypes } from 'enums/expression-attribute-types';

export default class ExpressionInstance {
  constructor(props) {
    this.nodeType = props.nodeType;
    this.function = props.function;
    this.operator = props.operator;
    this.name = props.name;
    this.variableId = props.variableId;
    this.variableName = props.variableName;
  }

  get type() {
    return expressionAttributeTypes.EXPRESSION;
  }

  static adaptKeys(props) {
    return {
      nodeType: props.nodeType,
      function: props.function,
      operator: props.operator,
      name: props.name,
      variableId: props.variableId,
      variableName: props.variableName
    };
  }

  static from(variable) {
    return new ExpressionInstance(variable);
  }
}
