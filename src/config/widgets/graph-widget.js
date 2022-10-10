import {
  determineIfSpacedByStroke,
  determineStrokeDashArray,
  determineStrokeWidth,
  isStackedBarChart
} from 'utils/widgets/graph';

import {
  formatPriceNumber,
  formatWithCurrency,
  formatWithDecimal,
  formatWithPercentage
} from 'utils/format';
import { currenciesFormat } from 'enums/currencies';
import { numericFormattingTypesEnum } from 'enums/numeric-formatting-types';
import { isBarChart } from '@/utils/widgets/graph';
import { AREA } from 'constants/series-types';

import { some } from 'lodash';

const markerDiameter = 8;
const textColorDark = '#ADADAD';
const textColorLight = '#4A4A4A';

const seriesColors = ['#8687E3', '#01B0CD', '#FFA1AD'];

function formatNumber(number, options = {}) {
  const dividerOptions = currenciesFormat.ENGLAND;

  let outputNumber = formatPriceNumber(number);

  if (options.decimalPlaces > 0) {
    outputNumber = formatWithDecimal(
      outputNumber,
      options.decimalPlaces,
      dividerOptions.decimal
    );
  }

  switch (options.type) {
    case numericFormattingTypesEnum.CURRENCY:
      outputNumber = formatWithCurrency(outputNumber);
      break;
    case numericFormattingTypesEnum.PERCENTAGE:
      outputNumber = formatWithPercentage(outputNumber);
      break;
  }

  return outputNumber;
}

const defaultYAxisOptions = {
  labels: {
    style: {
      color: textColorDark,
      fontFamily: 'Lato, sans-serif'
    },
    formatter(value) {
      return formatPriceNumber(value);
    }
  }
};

const customTooltip = isSingle => ({
  series,
  seriesIndex,
  dataPointIndex,
  w
}) => {
  if (isSingle) {
    return `<div class="aphex-tooltip-container">
        <span class="aphex-tooltip-label" style="color: ${
          w.config.colors[seriesIndex]
        };">
          ${w.config.series[seriesIndex].name}
        </span>
        <span class="aphex-tooltip-value">
          ${
            series[seriesIndex][dataPointIndex]
              ? formatNumber(
                  series[seriesIndex][dataPointIndex],
                  w.config.series[seriesIndex].numericFormatting
                )
              : '—'
          }
        </span>
      </div>`;
  }

  return series
    .map(
      (serie, i) =>
        `<div class="aphex-tooltip-container">
        <span class="aphex-tooltip-category">
          ${w.config.tooltip.categories[dataPointIndex]}
        </span>
        <span class="aphex-tooltip-label" style="color: ${w.config.colors[i]};">
          ${w.config.series[i].name}
        </span>
        <span class="aphex-tooltip-value">
          ${
            serie[dataPointIndex]
              ? formatNumber(
                  serie[dataPointIndex],
                  w.config.series[i].numericFormatting
                )
              : '—'
          }
        </span>
      </div>`
    )
    .join(' ');
};

const generateSerieYAxisOptions = () => {
  let isMainYAxisDrawn = false;
  let isOppositeYAxisDrawn = false;

  let firstMainYAxisCalculationName = null;
  let firstOppositeYAxisCalculationName = null;

  return serie => {
    const isSeparatedAxis = serie.seriesSettings.opposite;

    if (!firstMainYAxisCalculationName && !isSeparatedAxis) {
      firstMainYAxisCalculationName = serie.name;
    }

    if (!firstOppositeYAxisCalculationName && isSeparatedAxis) {
      firstOppositeYAxisCalculationName = serie.name;
    }

    const options = {
      seriesName: isSeparatedAxis
        ? firstOppositeYAxisCalculationName
        : firstMainYAxisCalculationName,
      show:
        (!isSeparatedAxis && !isMainYAxisDrawn) ||
        (isSeparatedAxis && !isOppositeYAxisDrawn),
      opposite: isSeparatedAxis,
      ...defaultYAxisOptions
    };

    if (!isSeparatedAxis) {
      isMainYAxisDrawn = true;
    }

    if (isSeparatedAxis) {
      isOppositeYAxisDrawn = true;
    }

    return options;
  };
};

const getSeriesColor = index => seriesColors[index % seriesColors.length];

const generateColor = ({ color }, index) => color || getSeriesColor(index);

const getStrokeColor = (index, color) => color || getSeriesColor[index];

const generateMixedStrokeColors = ({ type, color }, index) => {
  return determineIfSpacedByStroke(type)
    ? 'transparent'
    : getStrokeColor(index, color); // eslint-disable-line no-undefined
};

const generateMixedStrokeStyle = ({ type, lineStyle }) => {
  return determineIfSpacedByStroke(type)
    ? 0
    : determineStrokeDashArray(lineStyle); // eslint-disable-line no-undefined
};

const generateStrokeWidthsByCalculation = ({ type, lineThickness }) => {
  return determineStrokeWidth(type, lineThickness);
};

const generateStrokeColors = hasTransparentStroke => {
  return hasTransparentStroke ? ['transparent'] : undefined; // eslint-disable-line no-undefined
};

const getFillType = series => {
  return series.map(s => {
    if (s.seriesSettings.seriesType === AREA) {
      return 'gradient';
    } else {
      return 'solid';
    }
  });
};

export const generateOptions = (
  categories,
  isMixed,
  isStacked,
  hasTransparentStroke,
  series,
  seriesSettings,
  isBreakdown,
  type
) => {
  const options = {
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1
    },
    stroke: {
      curve: 'smooth', // For line charts
      width: series.map(generateStrokeWidthsByCalculation),
      colors: isMixed
        ? series.map(generateMixedStrokeColors)
        : generateStrokeColors(hasTransparentStroke),
      dashArray: !hasTransparentStroke
        ? series.map(generateMixedStrokeStyle)
        : generateMixedStrokeStyle(hasTransparentStroke)
    },
    colors: series.map(generateColor),
    xaxis: {
      categories,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: textColorDark,
          cssClass: 'graph-widget-labels',
          fontFamily: 'Lato, sans-serif'
        },
        trim: true,
        rotate: -45,
        hideOverlappingLabels: false,
        maxHeight: 80,
        formatter(value) {
          // check if value is day granulated date
          if (/\d{2}\.\d{2}\.\d{4}/.test(value)) {
            return value.substring(0, 6);
          }

          return value;
        }
      },
      tooltip: false
    },
    markers: {
      // setting marker size to something really small but greater than 0
      // 1 to work around a bug in the tooltip marker colors
      // which seems to randomly sort the marker colors
      // https://github.com/apexcharts/apexcharts.js/issues/1427
      // setting to 0 triggers the bug in this chart
      size: 0.001
    },
    legend: {
      showForSingleSeries: true,
      labels: {
        colors: [textColorLight]
      },
      fontFamily: 'Lato, sans-serif',
      markers: {
        width: markerDiameter,
        height: markerDiameter,
        radius: markerDiameter / 2
      }
    },
    tooltip: {
      custom: customTooltip(
        isBarChart(type) || isStackedBarChart(type) || isBreakdown
      ),
      categories,
      x: {
        show: false
      },
      marker: {
        show: false
      },
      shared: !(isBarChart(type) || isStackedBarChart(type) || isBreakdown)
    },
    chart: {
      stacked: isStacked,
      animations: {
        enabled: false
      },
      toolbar: {
        show: false,
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false
        }
      }
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
          value: 0.01
        }
      }
    }
  };

  options.yaxis = defaultYAxisOptions;

  if (some(series, 'seriesSettings.opposite')) {
    options.yaxis = series.map(generateSerieYAxisOptions());
  }

  if (isMixed) {
    options.fill.type = getFillType(series);
    options.fill.gradient = {
      shade: 'light',
      type: 'vertical',
      opacityFrom: 0.8,
      opacityTo: 0.45,
      stops: [0, 70, 100]
    };
  }

  const hasBarSeries = isMixed && some(series, ['type', 'bar']);
  if (hasBarSeries || isBarChart(type)) {
    options.xaxis.tickPlacement = 'between';
  }

  return options;
};
