import { toPascalCase } from 'utils/string';

export default class Operator {
  constructor({ name }) {
    this.name = name;
    this.icon = toPascalCase(name);
  }

  get props() {
    return { operator: this };
  }

  get component() {
    return 'Operator';
  }

  static from(name) {
    return new Operator({ name });
  }

  static deserialize({ name }) {
    return Operator.from(name);
  }
}
