import PropertyFilter from '../PinnedPropertyFilter';
import PropertyFilterModel from '../../../classes/filters/PropertyFilter';
import FilterModel from '../../../classes/filters/Filter';

import './PinnedBaseFilter.styles.scss';
import { boolean } from '@storybook/addon-knobs';

export default {
  title: 'Filters/Pinned Filters/Property Filter'
};

const template = `
  <property-filter
   class="filter"
   v-bind.sync="filter"
   />
`;

const options = JSON.parse(
  '[{"name":"AC Polari","available":true,"id":"82","resourceType":"property"},{"name":"AC Porto Sole","available":true,"id":"83","resourceType":"property"},{"name":"AC Valkanela","available":true,"id":"84","resourceType":"property"},{"name":"AC Veštar","available":true,"id":"85","resourceType":"property"},{"name":"Belvedere","available":true,"id":"51","resourceType":"property"},{"name":"Funtana","available":true,"id":"22","resourceType":"property"},{"name":"Grand Park Hotel Rovinj","available":true,"id":"27","resourceType":"property"},{"name":"Hotel Adriatic","available":true,"id":"20","resourceType":"property"},{"name":"Hotel Amarin","available":true,"id":"38","resourceType":"property"},{"name":"Hotel Eden","available":true,"id":"21","resourceType":"property"},{"name":"Hotel Istra","available":true,"id":"23","resourceType":"property"},{"name":"Hotel Katarina","available":true,"id":"33","resourceType":"property"},{"name":"Hotel Lone","available":true,"id":"29","resourceType":"property"},{"name":"Hotel Monte Mulini","available":true,"id":"30","resourceType":"property"},{"name":"Hotel Pineta","available":true,"id":"28","resourceType":"property"},{"name":"International","available":false,"id":"1000","resourceType":"property"},{"name":"International","available":false,"id":"10040","resourceType":"property"},{"name":"Koversada  Apartmani","available":true,"id":"52","resourceType":"property"},{"name":"Koversada Villas","available":true,"id":"55","resourceType":"property"},{"name":"Petalon","available":true,"id":"53","resourceType":"property"},{"name":"Riva","available":true,"id":"54","resourceType":"property"},{"name":"TN Amarin","available":true,"id":"50","resourceType":"property"},{"name":"TN Villas Rubin","available":true,"id":"56","resourceType":"property"}]'
);

const filter = new FilterModel({
  id: 'property',
  name: 'Property',
  type: 'correlation',
  prefix: null,
  required: true,
  placeholder: null,
  pinned: true,
  defaultValue: 82,
  options
});

export const Default = () => ({
  template,
  components: { PropertyFilter },
  data() {
    return {
      filter: new PropertyFilterModel({
        ...filter
      })
    };
  }
});
