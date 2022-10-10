import InputCurrency from '../new/InputCurrency';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Inputs/New/InputCurrency',
  decorators: [withKnobs]
};

const template = `
  <InputCurrency style="margin: 20px;" :label="label" :dark="dark" :disabled="disabled" :error="error" :message="message" :placeholder="placeholder" v-model="value" :decimal="decimal" />
`;

export const Default = () => ({
  template,
  components: { InputCurrency },
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
    decimal: {
      default: () => boolean('Decimal', false)
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
