import FilterListItemSingleSelect from '../FilterListItemSingleSelect';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Filters/FilterListItemSingleSelect',
  decorators: [withKnobs]
};

const template = `
  <FilterListItemSingleSelect 
    v-model="checked" 
    :title="title" 
    :indented="indented" 
    :disabled="disabled"
  />
`;

export const Default = () => ({
  template,
  components: { FilterListItemSingleSelect },
  props: {
    title: {
      default: text('Title', 'Title')
    },
    indented: {
      default: boolean('Indented', false)
    },
    disabled: {
      default: boolean('Disabled', false)
    }
  },
  data() {
    return {
      checked: false
    };
  }
});
