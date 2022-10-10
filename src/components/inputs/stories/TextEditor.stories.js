import TextEditor from '../../pdf/TextEditor.vue';
import { withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'TextEditor',
  decorators: [withKnobs]
};

const template = `
  <div style="padding:40px;">
    <TextEditor />
  </div>
`;

export const Default = () => ({
  template,
  components: { TextEditor },
  data() {
    return {
      value: null
    };
  }
});
