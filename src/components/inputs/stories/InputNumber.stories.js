import InputNumber from '../new/InputNumber';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Inputs/New/InputNumber',
  decorators: [withKnobs]
};

const template = `
  <InputNumber style="margin: 20px;" :label="label" :dark="dark" :disabled="disabled" :error="error" :message="message" :placeholder="placeholder" v-model="value" />
`;

export const Default = () => ({
  template,
  components: { InputNumber },
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
      value: null
    };
  }
});
