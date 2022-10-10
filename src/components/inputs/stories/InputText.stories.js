import InputText from '../new/InputText';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Inputs/New/InputText',
  decorators: [withKnobs]
};

const template = `
  <InputText style="margin: 20px;" :label="label" :dark="dark" :disabled="disabled" :error="error" :message="message" :placeholder="placeholder" v-model="value" />
`;

export const Default = () => ({
  template,
  components: { InputText },
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
      value: ''
    };
  }
});

export const Dark = () => ({
  template: `
    <div style="background-color: #2A3139; padding: 20px;">
      ${template}
    </div>
  `,
  components: { InputText },
  props: {
    label: {
      default: () => text('Label', 'Label')
    },
    dark: {
      default: () => boolean('Dark', true)
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
      value: ''
    };
  }
});
