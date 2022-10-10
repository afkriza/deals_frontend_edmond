import MeasureFilter from '../PinnedMeasureFilter';
import MeasureFilterModel from '../../../classes/filters/MeasureFilter';
import FilterModel from '../../../classes/filters/Filter';

import './PinnedBaseFilter.styles.scss';
import { boolean } from '@storybook/addon-knobs';

export default {
  title: 'Filters/Pinned Filters/Measure Filter'
};

const template = `
  <measure-filter
   class="filter"
   v-bind.sync="filter"
   />
`;

const options = [
  { id: 'roomnight_booking', name: 'Roomnight Booking', available: true },
  { id: 'roomnight_plan', name: 'Roomnight Plan', available: true },
  { id: 'roomnight_forecast', name: 'Roomnight Forecast', available: true },
  {
    id: 'roomnight_realization',
    name: 'Roomnight Realization',
    available: true
  }
];
const filter = new FilterModel({
  id: 'measure',
  name: 'Measure',
  type: 'correlation',
  prefix: null,
  required: true,
  placeholder: null,
  pinned: true,
  defaultValue: null,
  options
});

export const Default = () => ({
  template,
  components: { MeasureFilter },
  data() {
    return {
      filter: new MeasureFilterModel({
        numerator: options[0],
        denominator: options[0],
        ...filter
      })
    };
  }
});
