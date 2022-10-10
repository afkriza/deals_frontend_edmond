import InputSelect from '../new/InputSelect';
import { boolean, object, text, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Inputs/New/InputSelect',
  decorators: [withKnobs]
};

const template = `
  <InputSelect 
    style="margin: 20px; width: 300px"
    :label="label"
    :dark="dark"
    :disabled="disabled"
    :error="error"
    :message="message"
    :placeholder="placeholder"
    v-model="value"
    :options="options"
  />
`;

export const Default = () => ({
  template,
  components: { InputSelect },
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
    searchable: {
      default: () => boolean('Searchable', false)
    },
    message: {
      default: () => text('Message', 'Helper text')
    },
    placeholder: {
      default: () => text('Placeholder', 'Placeholder')
    },
    options: {
      default: () =>
        object('Options', [
          { id: '80', label: 'AC Polari' },
          { id: '81', label: 'AC Valkanela' },
          { id: '82', label: 'AC Veštar' },
          { id: '83', label: 'AC Porto Sole' },
          { id: '84', label: 'Belvedere' }
        ])
    }
  },
  data() {
    return {
      value: null
    };
  }
});
