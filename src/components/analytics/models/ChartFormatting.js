import { visualFormattingTypesEnum } from 'enums/visual-formatting-types';
import { DEFAULT_LINE_THICKNESS } from 'enums/visual-formatting-line-thickness';
import chartColors from 'enums/chart-picker-colors';

export default class ChartFormatting {
  constructor({
    lineStyle = visualFormattingTypesEnum.SOLID,
    color = chartColors[0],
    lineThickness = DEFAULT_LINE_THICKNESS
  } = {}) {
    this.lineStyle = lineStyle;
    this.color = color;
    this.lineThickness = lineThickness;
  }

  static from(chartFormatting = {}) {
    return new ChartFormatting(chartFormatting);
  }

  static adaptKeys(chartFormatting) {
    return chartFormatting;
  }

  static deserialize({ lineStyle, color, lineThickness }) {
    return ChartFormatting.from({
      lineStyle,
      color,
      lineThickness
    });
  }
}
