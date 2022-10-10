import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';

import MaterialInput from '../MaterialInput.vue';

export default {
  title: 'Core/Inputs',
  decorators: [withKnobs]
};
export const materialInput = () => ({
  components: { MaterialInput },
  template:
    '<material-input @enter:keypress="buttonEnter" :placeholder="placeholder" :isInvalid="isInvalid" :isInverted="isInverted" :helperText="helperText" v-model="value" />',
  props: {
    placeholder: {
      type: String,
      default: text('Placeholder', 'e.g. “ACME Inc.”')
    },
    isInvalid: {
      type: Boolean,
      default: boolean('Is invalid', false)
    },
    isInverted: {
      type: Boolean,
      default: boolean('Is Inverted', false)
    },
    helperText: {
      type: String,
      default: text('Helper text', 'Please select a partner')
    }
  },
  data() {
    return {
      value: ''
    };
  },
  methods: {
    buttonEnter: action('Enter')
  }
});
