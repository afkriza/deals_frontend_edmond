import GraphWidget from '../GraphWidget';
import { boolean, object, select, withKnobs } from '@storybook/addon-knobs';
import { widgetRepresentations } from '@/enums/widget-representations';

export default {
  title: 'GraphWidget',
  decorators: [withKnobs]
};

const template = `
  <GraphWidget
    style="height: 600px;"
    :representation="representation"
    :xAxis="xAxis"
    :calculationValues="calculationValues"
    :calculations="calculations"
    :is-breakdown="isBreakdown"
  />
`;

const widgetRepresentationIds = Object.values(widgetRepresentations).map(
  ({ id }) => id
);

export const Default = () => ({
  template,
  components: { GraphWidget },
  props: {
    representation: {
      default: select(
        'Representation',
        widgetRepresentationIds,
        widgetRepresentationIds[1]
      )
    },
    xAxis: {
      default: object('x-axis', ['a', 'b', 'c', 'd', 'e'])
    },
    calculationValues: {
      default: object('Calculation Values', [
        {
          rootCalculation: 'RNT BOOK',
          name: 'RNT BOOK',
          values: [5, 10, 8, 15, 2]
        },
        {
          rootCalculation: 'RNT PLN',
          name: 'RNT PLN',
          values: [7, 9, 6, 20, 12]
        }
      ])
    },
    calculations: {
      default: object('Calculations', [
        {
          name: 'RNT BOOK',
          formatting: {
            chart: {
              color: '#00FF00'
            }
          },
          seriesSettings: {
            seriesType: 'line'
          }
        },
        {
          name: 'RNT PLN',
          formatting: {
            chart: {
              color: '#917ca3'
            }
          },
          seriesSettings: {
            seriesType: 'bar'
          }
        }
      ])
    },
    isBreakdown: {
      default: boolean('Is breakdown', false)
    }
  }
});

export const Breakdown = () => ({
  template,
  components: { GraphWidget },
  props: {
    representation: {
      default: select(
        'Representation',
        widgetRepresentationIds,
        widgetRepresentationIds[1]
      )
    },
    xAxis: {
      default: object('x-axis', ['a', 'b', 'c', 'd', 'e'])
    },
    calculationValues: {
      default: object('Calculation Values', [
        {
          rootCalculation: 'RNT PLN',
          name: 'RNT PLN - AC Polari',
          values: [3, 7, 3, 14, 0]
        },
        {
          rootCalculation: 'RNT PLN',
          name: 'RNT PLN - AC Veštar',
          values: [4, 2, 3, 6, 12]
        },
        // {
        //   rootCalculation: 'RNT PLN',
        //   name: 'RNT PLN',
        //   values: [null, null, null, null, null]
        // },
        {
          rootCalculation: 'RNT BOOK',
          name: 'RNT BOOK - AC Polari',
          values: [5, 9, 3, 11, 6]
        },
        {
          rootCalculation: 'RNT BOOK',
          name: 'RNT BOOK - AC Veštar',
          values: [4, 12, 8, 5, 6]
        },
        {
          rootCalculation: 'RNT CAP',
          name: 'RNT CAP',
          values: [14, 16, 10, 10, 12]
        }
      ])
    },
    calculations: {
      default: object('Calculations', [
        {
          name: 'RNT BOOK',
          formatting: {
            chart: {
              color: '#FF0000'
            }
          },
          seriesSettings: ''
        },
        {
          name: 'RNT PLN',
          formatting: {
            chart: {
              color: '#00FF00'
            }
          },
          seriesSettings: ''
        },
        {
          name: 'RNT CAP',
          formatting: {
            chart: {
              color: '#0000FF'
            }
          },
          seriesSettings: ''
        }
      ])
    },
    isBreakdown: {
      default: boolean('Is breakdown', true)
    }
  }
});
