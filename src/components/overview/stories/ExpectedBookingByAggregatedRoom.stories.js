import ExpectedBookingByAggregatedRoom from '@/components/overview/graphs/ExpectedBookingByAggregatedRoom.vue';
import { object, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Overview/Graphs/ExpectedBookingByAggregatedRoom',
  decorators: [withKnobs]
};

export const Default = () => ({
  template: `
    <ExpectedBookingByAggregatedRoom 
        :rooms="rooms"
        :booking-current="bookingCurrent"
        :booking-expected="bookingExpected"
    />`,
  components: {
    ExpectedBookingByAggregatedRoom
  },
  props: {
    rooms: {
      default: object('Rooms', ['AA2', 'AG2', 'HA4P', 'HA4GP', 'HA4AS'])
    },
    bookingCurrent: {
      default: object('Current booking', [
        104.15,
        63.55,
        104.975,
        12.35,
        44.18181818181818
      ])
    },
    bookingExpected: {
      default: object('Expected booking', [
        12.35,
        104.975,
        63.55,
        44.18181818181818,
        104.15
      ])
    }
  }
});
