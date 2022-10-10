import { withKnobs, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import DateSlider from 'components/overview/DateSlider.vue';

export default {
  title: 'Overview/Header',
  decorators: [withKnobs]
};

const type = {
  name: 'Type',
  options: ['month', 'year']
};

export const dateSlider = () => ({
  components: { DateSlider },
  template:
    '<date-slider :type="type" @date:submited="dateSubmitted" @action:submited="actionSubmitted" />',
  props: {
    type: {
      type: String,
      default: select(type.name, type.options, type.options[0])
    }
  },
  methods: {
    dateSubmitted: action('Date updated'),
    actionSubmitted: action('Action submitted')
  }
});
