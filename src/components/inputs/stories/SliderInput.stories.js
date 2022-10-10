import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';

import SliderInput from '../SliderInput.vue';

export default {
  title: 'Core/Inputs',
  decorators: [withKnobs]
};
export const sliderInput = () => ({
  components: { SliderInput },
  template:
    '<slider-input @submit:forward="forwardSubmit" @submit:back="backSubmit" v-model="value" />',
  data() {
    return {
      value: ''
    };
  },
  methods: {
    backSubmit: action('backSubmit'),
    forwardSubmit: action('fowradSubmit')
  }
});
