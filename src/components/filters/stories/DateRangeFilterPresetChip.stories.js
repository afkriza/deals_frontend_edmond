import DateRangeFilterPresetChip from '../DateRangeFilterPresetChip';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Filters/DateRangeFilterPresetChip',
  decorators: [withKnobs]
};

const template = `
  <DateRangeFilterPresetChip
    style="margin: 20px;"
    :text="text"
    :active="active"
  />
`;

export const Default = () => ({
  template,
  components: { DateRangeFilterPresetChip },
  props: {
    text: {
      default: text('Title', 'Title')
    },
    active: {
      default: boolean('Active', false)
    }
  }
});
