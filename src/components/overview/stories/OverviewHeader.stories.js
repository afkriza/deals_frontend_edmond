import { withKnobs, number } from '@storybook/addon-knobs';

import OverviewHeader from '../OverviewHeader.vue';

export default {
  title: 'Overview/Header',
  decorators: [withKnobs]
};

export const header = () => ({
  components: { OverviewHeader },
  template:
    '<overview-header :progress="progress" :total="total" @date:submitted="dateSubmitted" :type="type" :activeDate="activeDate" />',
  props: {
    progress: {
      type: Number,
      default: number('progress', 240)
    },
    total: {
      type: Number,
      default: number('total', 300)
    }
  },
  data() {
    return {
      activeItem: {
        type: 'month',
        year: 2018,
        month: 'January'
      }
    };
  },
  computed: {
    type() {
      return this.activeItem.type;
    },
    activeDate() {
      return {
        year: this.activeItem.year,
        month: this.activeItem.month
      };
    }
  },
  methods: {
    dateSubmitted(date) {
      this.activeItem = date;
    }
  }
});
