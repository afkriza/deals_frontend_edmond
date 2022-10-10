import { withKnobs, select, boolean } from '@storybook/addon-knobs';

import CalendarHeaderItem from '../CalendarHeaderItem.vue';

export default {
  title: 'Overview/Calendar/Header',
  decorators: [withKnobs]
};

const daySelect = {
  name: 'Day',
  options: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ]
};

export const item = () => ({
  components: { CalendarHeaderItem },
  template: '<calendar-header-item :day="day" :empty="empty" />',
  props: {
    day: {
      type: String,
      default: select(daySelect.name, daySelect.options, daySelect.options[0])
    },
    empty: {
      type: Boolean,
      default: boolean('Empty', false)
    }
  }
});
