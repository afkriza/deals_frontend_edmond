import WeeklyViewItem from '../WeeklyViewItem';
import { boolean, date, number, object } from '@storybook/addon-knobs';

export default {
  title: 'WeeklyViewItem'
};

const template = `
  <WeeklyViewItem 
    :week="week" 
    :start-date="startDate" 
    :end-date="endDate" 
    :actual="actual" 
    :expected="expected" 
    :selected="selected"
  />
`;

export const Default = () => ({
  template,
  components: { WeeklyViewItem },
  props: {
    week: {
      default: number('Week', 6)
    },
    startDate: {
      default: object('Start date', new Date(2021, 2, 7))
    },
    endDate: {
      default: object('End date', new Date(2021, 2, 14))
    },
    actual: {
      default: number('Actual', 140)
    },
    expected: {
      default: number('Expected', 160)
    },
    selected: {
      default: boolean('Selected', false)
    }
  }
});
