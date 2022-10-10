import OccupancyGraph from '@/components/groups/graphs/OccupancyGraph';
import { array, number, object, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'OccupancyGraph',
  decorators: [withKnobs]
};

const template = `
<div style="width: 600px;">
  <OccupancyGraph
      :bookings="bookings"
      :forecasts="forecasts"
      :groups="groups"
      :displacements="displacements"
      :capacity="capacity"
      :x-axis-labels="xAxisLabels"
   />
</div>
`;

export const Single = () => ({
  template,
  components: { OccupancyGraph },
  props: {
    capacity: { default: () => number('booking', 200) },
    forecasts: { default: () => array('forecasts', [40]) },
    bookings: { default: () => array('bookings', [31]) },
    groups: { default: () => array('groups', [75]) },
    displacements: { default: () => array('displacements', [20]) },
    displacementOffsets: {
      default: () => array('Displacement Offsets', [180])
    },
    xAxisLabels: {
      default: null
    }
  }
});

export const Multi = () => ({
  template,
  components: { OccupancyGraph },
  props: {
    forecasts: { default: () => array('forecasts', [40, 45, 40, 45]) },
    bookings: { default: () => array('bookings', [21, 25, 21, 25]) },
    groups: { default: () => array('groups', [75, 80, 75, 80]) },
    displacements: { default: () => array('displacements', [20, 25, 20, 25]) },
    displacementOffsets: {
      default: () => array('Displacement Offsets', [130, 160, 130, 160])
    },
    xAxisLabels: {
      default: () => object('Labels', ['19.02', '20.02', '21.02', '22.02'])
    }
  }
});
