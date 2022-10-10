import { withKnobs, select, number, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import ProgressCard from '../ProgressCard.vue';
import CalendarCard from '../CalendarCard.vue';
import CalendarMonthItem from '../CalendarMonthItem.vue';

export default {
  title: 'Overview/Calendar/Month',
  decorators: [withKnobs]
};

const cardType = {
  name: 'Type',
  options: ['none', 'do', 'look', 'done']
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

const cardWrapperLayout = {
  name: 'Layout',
  options: ['card', 'small-card', 'row']
};

export const item = () => ({
  components: { ProgressCard, CalendarCard, CalendarMonthItem },
  template:
    '<div :style="{padding: padding}"><calendar-month-item :layout="layout"><calendar-card :day="day" :date="date" :layout="layout" :theme="cardTheme"><progress-card @card:submit="cardAction" :layout="progressLayout" :progress="progress" :total="total" :type="type" :theme="cardTheme" /></calendar-card></calendar-month-item></div>',
  props: {
    layout: {
      type: String,
      default: select(
        cardWrapperLayout.name,
        cardWrapperLayout.options,
        cardWrapperLayout.options[0]
      )
    },
    cardTheme: {
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
    },
    padding: {
      type: String,
      default: '10px'
    }
  },
  computed: {
    progressLayout() {
      return this.layout === 'row' ? 'row' : 'card';
    }
  },
  methods: {
    cardAction: action('Card clicked')
  }
});
