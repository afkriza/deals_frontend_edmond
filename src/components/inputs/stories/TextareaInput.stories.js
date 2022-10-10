import { withKnobs, boolean } from '@storybook/addon-knobs';

import TextareaInput from '../TextareaInput.vue';

export default {
  title: 'Core/Inputs',
  decorators: [withKnobs]
};
export const textareaInput = () => ({
  components: { TextareaInput },
  template: '<textarea-input :isInvalid="isInvalid" v-model="value" />',
  props: {
    isInvalid: {
      type: Boolean,
      default: boolean('Is invalid', false)
    }
  },
  data() {
    return {
      value: ''
    };
  }
});
