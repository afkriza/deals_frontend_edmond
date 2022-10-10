import TimeGranulationDropdownList from '../TimeGranulationDropdownList';

import { action } from '@storybook/addon-actions';

export default {
  title: 'Overview/TimeGranulationDropdownList',
  excludeStories: /.*Data$/
};

export const listItemsData = [
  { name: 'Month', abbr: 'M' },
  { name: 'Year', abbr: 'Y' }
];

export const actionsData = {
  onItemSelect: action('onItemSelect')
};

const dropdownListTemplate =
  '<time-granulation-dropdown-list style="width: 128px; margin: 20px 0 0 20px" :items="items" @select="onItemSelect" />';

export const Default = () => ({
  components: { TimeGranulationDropdownList },
  template: dropdownListTemplate,
  props: {
    items: {
      default: () => listItemsData
    }
  },
  methods: actionsData
});
