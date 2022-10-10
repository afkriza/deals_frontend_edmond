import ConditionalFormatting from 'classes/analytics/ConditionalFormatting';
import NumericFormatting from 'components/analytics/models/NumericFormatting';
import ChartFormatting from 'components/analytics/models/ChartFormatting';

export default class CalculationFormatting {
  constructor({
    conditional = [],
    numeric = {},
    chart = null,
    hasSeparator = false
  }) {
    this.conditional = conditional;
    this.numeric = numeric;
    this.chart = chart;
    this.hasSeparator = hasSeparator;
  }

  static from(calculationFormatting = {}) {
    return new CalculationFormatting(calculationFormatting);
  }

  static adaptKeys({ conditional, numeric, chart, hasSeparator }) {
    return {
      hasSeparator,
      conditional: ConditionalFormatting.adaptKeys(conditional),
      numeric: NumericFormatting.adaptKeys(numeric),
      chart: ChartFormatting.adaptKeys(chart)
    };
  }

  static deserialize({
    conditional = [],
    numeric = {},
    chart,
    hasSeparator = false
  } = {}) {
    return CalculationFormatting.from({
      hasSeparator,
      conditional: conditional.map(ConditionalFormatting.deserialize),
      numeric: NumericFormatting.deserialize(numeric),
      chart: chart ? ChartFormatting.deserialize(chart) : null
    });
  }
}
