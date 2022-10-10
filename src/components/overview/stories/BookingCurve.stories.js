import BookingCurve from '@/components/overview/graphs/BookingCurve.vue';
import { object, withKnobs } from '@storybook/addon-knobs';
import { bookingCurve } from './fixtures';
import { deserialize } from '@/models/overview/Graph';

export default {
  title: 'Overview/Graphs/BookingCurve',
  decorators: [withKnobs]
};

export const Default = () => ({
  template: `
    <BookingCurve
        v-bind="graph.props"
    />`,
  components: {
    BookingCurve
  },
  data() {
    return {
      graph: deserialize({ ...bookingCurve, date: '2021-03-08' })
    };
  }
});
