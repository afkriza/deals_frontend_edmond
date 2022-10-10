import { withKnobs, select, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import DatePicker from 'components/overview/DatePicker.vue';

export default {
  title: 'Overview/Header',
  decorators: [withKnobs]
};

const type = {
  name: 'Type',
  options: ['month', 'year']
};

export const datePicker = () => ({
  components: { DatePicker },
  template:
    '<date-picker :type="type" @item:submited="submit" :activeItem="activeItem" />',
  props: {
    type: {
      type: String,
      default: select(type.name, type.options, type.options[0])
    }
  },
  data() {
    return {
      activeItem: {
        year: 2018,
        month: 'February'
      }
    };
  },
  methods: {
    submit(data) {
      this.activeItem = data;
    }
  }
});
