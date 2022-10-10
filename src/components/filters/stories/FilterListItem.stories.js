import FilterListItem from '../FilterListItem';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Filters/FilterListItem',
  decorators: [withKnobs]
};

const template = `
  <FilterListItem 
    :title="title" 
    :indented="indented" 
    :disabled="disabled"
    :active="active"
  />
`;

export const Default = () => ({
  template,
  components: { FilterListItem },
  props: {
    title: {
      default: text('Title', 'Title')
    },
    indented: {
      default: boolean('Indented', false)
    },
    disabled: {
      default: boolean('Disabled', false)
    },
    active: {
      default: boolean('Active', false)
    }
  }
});
