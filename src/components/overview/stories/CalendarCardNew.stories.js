import { boolean, number, select, withKnobs } from '@storybook/addon-knobs';

import CalendarCardNew from '../CalendarCardNew.vue';
import { CARD_ACTIONS } from '@/constants/overview';

export default {
  title: 'Overview/Calendar/Card/Month',
  decorators: [withKnobs]
};

const cardType = {
  name: 'Type',
  options: CARD_ACTIONS
};

export const card = () => ({
  components: { CalendarCardNew },
  template:
    '<calendar-card-new style="width: 175px; height: 104px;" :is-selected="isSelected" :icon="type" :actual="progress" :total="total" />',
  props: {
    type: {
      type: String,
      default: select(cardType.name, cardType.options, cardType.options[0])
    },
    progress: {
      type: Number,
      default: number('Progress', 190)
    },
    total: {
      type: Number,
      default: number('Total', 300)
    },
    isSelected: {
      type: Boolean,
      default: boolean('Selected', false)
    }
  }
});
