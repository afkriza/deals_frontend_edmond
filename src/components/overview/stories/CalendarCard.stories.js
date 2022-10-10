import { withKnobs, select, number } from '@storybook/addon-knobs';

import ProgressCard from '../ProgressCard.vue';
import CalendarCard from '../CalendarCard.vue';

export default {
  title: 'Overview/Calendar/Month',
  decorators: [withKnobs]
};

const cardType = {
  name: 'Type',
  options: ['none', 'do', 'look', 'done']
};

const cardLayout = {
  name: 'Layout',
  options: ['card', 'row']
};

const cardTheme = {
  name: 'Theme',
  options: ['normal', 'active']
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

export const card = () => ({
  components: { ProgressCard, CalendarCard },
  template:
    '<calendar-card :day="day" :date="date" :layout="layout" :theme="theme" ><progress-card :layout="layout" :progress="progress" :total="total" :type="type" :theme="theme" /></calendar-card>',
  props: {
    layout: {
      type: String,
      default: select(
        cardLayout.name,
        cardLayout.options,
        cardLayout.options[0]
      )
    },
    theme: {
      type: String,
      default: select(cardTheme.name, cardTheme.options, cardTheme.options[0])
    },
    type: {
      type: String,
      default: select(cardType.name, cardType.options, cardType.options[0])
    },
    day: {
      type: String,
      default: select(daySelect.name, daySelect.options, daySelect.options[0])
    },
    date: {
      type: Number,
      default: number('Date', 1)
    },
    progress: {
      type: Number,
      default: number('Progress', 240)
    },
    total: {
      type: Number,
      default: number('Total', 300)
    }
  }
});
