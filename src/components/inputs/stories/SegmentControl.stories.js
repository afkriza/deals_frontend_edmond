import SegmentControl from '../SegmentControl';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Inputs/SegmentControl',
  decorators: [withKnobs]
};

const template = `
  <SegmentControl style="margin: 20px; width: 324px;" v-model="selectedOption" :options="options" :dark="dark" />
`;

export const Default = () => ({
  template,
  components: { SegmentControl },
  props: {
    options: {
      default: object('Options', [
        { id: '1', label: 'Option 1' },
        { id: '2', label: 'Option 2' },
        { id: '3', label: 'Option 3' }
      ])
    },
    dark: {
      default: boolean('Dark', false)
    }
  },
  data() {
    return {
      selectedOption: '1'
    };
  }
});
