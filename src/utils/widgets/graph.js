import { apexChartTypes, apexStrokeTypes } from 'enums/apex-chart-types';
import { widgetRepresentations } from 'enums/widget-representations';
import { DEFAULT_LINE_THICKNESS } from 'enums/visual-formatting-line-thickness';

function determineApexChartType(graphType) {
  switch (graphType) {
    case widgetRepresentations.AREA_CHART_STACKED.id:
      return apexChartTypes.AREA;
    case widgetRepresentations.LINE_CHART.id:
      return apexChartTypes.LINE;
    case widgetRepresentations.BAR_CHART_STACKED.id:
      return apexChartTypes.BAR;
    case widgetRepresentations.BAR_CHART.id:
      return apexChartTypes.BAR;
    case widgetRepresentations.MIXED_CHART.id:
      return apexChartTypes.LINE;
    case widgetRepresentations.AREA_CHART.id:
      return apexChartTypes.AREA;
    default:
      return apexChartTypes.BAR;
  }
}

export function isBarChart(type) {
  return type === widgetRepresentations.BAR_CHART.id;
}

export function isStackedBarChart(type) {
  return type === widgetRepresentations.BAR_CHART_STACKED.id;
}

function determineIfStacked(graphType) {
  return (
    graphType === widgetRepresentations.AREA_CHART_STACKED.id ||
    graphType === widgetRepresentations.BAR_CHART_STACKED.id
  );
}

function determineIfSpacedByStroke(graphType) {
  return (
    graphType === widgetRepresentations.BAR_CHART.id ||
    graphType === apexChartTypes.BAR
  );
}

function determineStrokeWidth(graphType, lineThickness) {
  switch (graphType) {
    case widgetRepresentations.BAR_CHART.id || apexChartTypes.BAR:
      return 5;
    case widgetRepresentations.BAR_CHART_STACKED.id:
      return 0;
    default:
      return lineThickness ? lineThickness : DEFAULT_LINE_THICKNESS;
  }
}

function determineStrokeDashArray(lineStyle) {
  switch (lineStyle) {
    case apexStrokeTypes.DASHED:
      return [30, 15];
    case apexStrokeTypes.DOTTED:
      return [5, 5];
    default:
      return [0];
  }
}

function formatCalculations(calculations) {
  if (!calculations.length) {
    return 'none';
  } else if (calculations.length === 1) {
    return calculations[0];
  }

  return `${calculations.length} values`;
}

export {
  determineApexChartType,
  determineIfStacked,
  determineIfSpacedByStroke,
  determineStrokeWidth,
  formatCalculations,
  determineStrokeDashArray
};
