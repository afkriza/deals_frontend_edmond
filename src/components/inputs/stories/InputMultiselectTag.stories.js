import InputMultiselectTag from '../new/InputMultiselectTag';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'tags/InputMultiselectTag'
};

const template = `
   <InputMultiselectTag style="margin: 20px" :text="text" />
`;

export const Default = () => ({
  template,
  components: { InputMultiselectTag },
  props: {
    text: {
      default: () => text('Text', 'Text')
    }
  }
});
