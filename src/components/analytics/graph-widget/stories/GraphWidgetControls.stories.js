import GraphWidgetControls from '../GraphWidgetControls';
import { object, select, withKnobs } from '@storybook/addon-knobs';
import { BREAKDOWN_TIME_GRANULATIONS, MONTH } from '@/constants/widget';

export default {
  title: 'GraphWidgetControls',
  decorators: [withKnobs]
};

const template = `
  <GraphWidgetControls 
    :selectedXAxis="selectedXAxis"
    :xAxisOptions="xAxisOptions"
    :selectedYAxis="selectedYAxis"
    :yAxisOptions="yAxisOptions"
    :selected-breakdown-category="selectedBreakdownCategory"
    :breakdown-categories="breakdownCategories"
    :selected-breakdown-time-granulation="selectedBreakdownTimeGranulation"
    @x-axis:select="selectedXAxis = $event"
    @y-axis:add="selectedYAxis.push($event)"
    @y-axis:remove="selectedYAxis = selectedYAxis.filter(name => name !== $event)"
    @breakdown-category:select="selectedBreakdownCategory = $event"
    @breakdown-time-granulation:select="selectedBreakdownTimeGranulation = $event"
  />
`;

export const Default = () => ({
  template,
  components: { GraphWidgetControls },
  props: {
    selectedXAxis: {
      default: select('Selected x-axis category', ['a', 'b', 'c'], 'a')
    },
    xAxisOptions: {
      default: object('X-axis categories', ['a', 'b', 'c'])
    },
    selectedYAxis: {
      default: object('Selected y-axis calculations', ['RNT BOOK', 'RNT FRC'])
    },
    yAxisOptions: {
      default: object('Y-axis calculations', [
        'RNT BOOK',
        'RNT FRC',
        'RNT PLN',
        'RNT BOOK 10',
        'RNT FRC 10',
        'RNT PLN 10',
        'RNT PLN 20'
      ])
    },
    selectedBreakdownCategory: {
      default: select(
        'Selected breakdown category',
        ['property', 'room'],
        'property'
      )
    },
    breakdownCategories: {
      default: object('Breakdown categories', [
        'property',
        'room',
        'bookingDate'
      ])
    },
    selectedBreakdownTimeGranulation: {
      default: select('Time granulation', BREAKDOWN_TIME_GRANULATIONS, MONTH)
    }
  }
});
