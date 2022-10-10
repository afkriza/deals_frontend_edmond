import InputDate from '../new/InputDate';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Inputs/New/InputDate',
  decorators: [withKnobs]
};

const template = `
  <InputDate 
    style="margin: 20px 0 0 100px;" 
    :label="label" 
    :dark="dark" 
    :disabled="disabled" 
    :error="error" 
    :message="message" 
    :placeholder="placeholder" 
    v-model="value"
  />
`;

export const Default = () => ({
  template,
  components: { InputDate },
  props: {
    label: {
      default: () => text('Label', 'Label')
    },
    dark: {
      default: () => boolean('Dark', false)
    },
    disabled: {
      default: () => boolean('Disabled', false)
    },
    error: {
      default: () => boolean('Error', false)
    },
    message: {
      default: () => text('Message', 'Helper text')
    },
    placeholder: {
      default: () => text('Placeholder', 'Placeholder')
    }
  },
  data() {
    return {
      value: new Date(2020, 2, 14)
    };
  }
});
