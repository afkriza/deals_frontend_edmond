import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';

import AnimatedInput from '../AnimatedInput.vue';

export default {
  title: 'Core/Inputs',
  decorators: [withKnobs]
};
export const animatedInput = () => ({
  components: { AnimatedInput },
  template:
    '<animated-input @enter:keypress="buttonEnter" :label="label" :isInvalid="isInvalid"  :helperText="helperText" v-model="value" />',
  props: {
    label: {
      type: String,
      default: text('Label', '')
    },
    isInvalid: {
      type: Boolean,
      default: boolean('Is invalid', false)
    },
    helperText: {
      type: String,
      default: text('Helper text', '')
    }
  },
  data() {
    return {
      value: 'default text'
    };
  },
  methods: {
    buttonEnter: action('Enter')
  }
});
