import { withKnobs, select, boolean } from '@storybook/addon-knobs';

import CalendarMonth from '../CalendarMonth.vue';

export default {
  title: 'Overview/Calendar/Month',
  decorators: [withKnobs]
};

const cardType = {
  name: 'Type',
  options: ['none', 'do', 'look', 'done']
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

const numberOfDays = {
  name: 'Days',
  options: [28, 29, 30, 31]
};

export const grid = () => ({
  components: { CalendarMonth },
  template:
    '<calendar-month @card:submitted="cardAction" :showHeader="showHeader" :items="items" />',
  props: {
    showHeader: {
      type: Boolean,
      default: boolean('Header', true)
    },
    firstDay: {
      type: String,
      default: select(daySelect.name, daySelect.options, daySelect.options[5])
    },
    days: {
      type: Number,
      default: select(
        numberOfDays.name,
        numberOfDays.options,
        numberOfDays.options[3]
      )
    }
  },
  data() {
    return {
      activeId: 1,
      items: [...Array(this.days)].map((key, id) => {
        return {
          date: id + 1,
          day: this.getDay(id),
          id: id + 1,
          active: false,
          progress: this.getRandomInt(0, 240),
          total: this.getRandomInt(241, 301),
          type: cardType.options[this.getRandomInt(0, cardType.options.length)]
        };
      })
    };
  },
  watch: {
    firstDay() {
      this.items.forEach((item, id) => {
        item.day = this.getDay(id);
      });
    },
    days() {
      this.items = [...Array(this.days)].map((key, id) => {
        return {
          date: id + 1,
          day: this.getDay(id),
          id: id + 1,
          active: this.activeId === id,
          progress: this.getRandomInt(0, 240),
          total: this.getRandomInt(241, 301),
          type: cardType.options[this.getRandomInt(0, cardType.options.length)]
        };
      });
    },
    activeId() {
      this.items.forEach(item => {
        if (item.id === this.activeId) {
          item.active = true;
        } else {
          item.active = false;
        }
      });
    }
  },
  methods: {
    cardAction(id) {
      this.activeId = id;
    },
    getDay(id) {
      return daySelect.options[
        (id + daySelect.options.indexOf(this.firstDay)) %
          daySelect.options.length
      ];
    },
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
  }
});
