import PinnedBaseFilter from '../PinnedBaseFilter';

import CalendarIcon from '@/assets/images/icons/calendar.svg';

import './PinnedBaseFilter.styles.scss';
import { text, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Filters/Pinned Filters/Base',
  decorators: [withKnobs],
  parameters: {
    backgrounds: [{ name: 'figma', value: 'rgb(250,250,250)', default: true }]
  }
};

const template = `
  <pinned-base-filter 
    class="filter" 
    :label="label"
    :value="value"
    @filter:open="onFilterOpen"
    @filter:close="onFilterClose"
    >
    <template #icon>
      <CalendarIcon />
    </template>
    <div>
    content
</div>
  </pinned-base-filter>
`;

const generateProps = () => ({
  label: {
    default: text('Label', 'Label')
  },
  value: {
    default: text('Value', 'Value')
  }
});

const generateMethods = () => ({
  onFilterOpen: action('onFilterOpen'),
  onFilterClose: action('onFilterClose')
});

export const Default = () => ({
  components: { PinnedBaseFilter, CalendarIcon },
  template,
  props: generateProps(),
  methods: generateMethods()
});

export const Selected = () => ({
  components: { PinnedBaseFilter, CalendarIcon },
  template,
  props: generateProps(),
  methods: generateMethods()
});
