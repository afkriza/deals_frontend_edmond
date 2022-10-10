import RoomBreakdown from '@/components/overview/graphs/RoomBreakdown.vue';
import { withKnobs, array, object } from '@storybook/addon-knobs';

export default {
  title: 'Overview/Graphs/RoomBreakdown',
  decorators: [withKnobs]
};

export const Default = () => ({
  template: '<room-breakdown :rooms="rooms" :bookings="bookings" />',
  components: {
    RoomBreakdown
  },
  props: {
    rooms: {
      default: array('rooms', ['A2', 'CC2', 'FA2', 'G2', 'J2', 'HA3G', 'HA42L'])
    },
    bookings: {
      default: object('bookings', [65, 28, 16, 20, 10, 8, 0])
    }
  }
});
