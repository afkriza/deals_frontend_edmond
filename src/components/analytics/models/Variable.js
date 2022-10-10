import { generateRandomHex } from 'utils/string';

export default class Variable {
  constructor({
    context,
    dayOffset,
    metric,
    name,
    variableId = generateRandomHex(),
    yearOffset,
    sort = 'asc'
  }) {
    this.context = context;
    this.dayOffset = dayOffset;
    this.metric = metric;
    this.name = name;
    this.variableId = variableId;
    this.yearOffset = yearOffset;
    this.sort = sort;
  }

  get props() {
    return { variable: this };
  }

  get component() {
    return 'Variable';
  }

  static from(variable = {}) {
    return new Variable(variable);
  }

  static deserialize({
    context,
    dayOffset,
    metric,
    name,
    variableId,
    yearOffset
  }) {
    return Variable.from({
      context,
      dayOffset,
      metric,
      name,
      variableId,
      yearOffset
    });
  }
}
