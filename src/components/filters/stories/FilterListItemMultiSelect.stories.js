import FilterListItemMultiSelect from '../FilterListItemMultiSelect';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Filters/FilterListItemMultiSelect',
  decorators: [withKnobs]
};

const template = `
  <FilterListItemMultiSelect 
    v-model="checked" 
    :title="title" 
    :indented="indented" 
    :disabled="disabled"
    :has-sub-options="hasSubOptions" 
    :is-sub-menu-open="isSubMenuOpen"
    :is-sub-menu-disabled="isSubMenuDisabled"
  />
`;

export const Default = () => ({
  template,
  components: { FilterListItemMultiSelect },
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
    hasSubOptions: {
      default: boolean('Has sub-options', false)
    },
    isSubMenuOpen: {
      default: boolean('Is sub-menu open', false)
    },
    isSubMenuDisabled: {
      default: boolean('Is sub-menu disabled', false)
    }
  },
  data() {
    return {
      checked: false
    };
  }
});
