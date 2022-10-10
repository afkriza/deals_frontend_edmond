import ChannelBreakdown from '@/components/overview/graphs/ChannelBreakdown.vue';
import { array, object, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Overview/Graphs/ChannelBreakdown',
  decorators: [withKnobs]
};

export const Default = () => ({
  template: `<channel-breakdown 
        :channels="channels" 
        :netto-bookings="nettoBookings" 
        :expected-cancellations="expectedCancellations"
    />`,
  components: {
    ChannelBreakdown
  },
  props: {
    channels: {
      default: array('channels', ['B2B', 'Ind', 'Alo Channel', 'Ost'])
    },
    nettoBookings: {
      default: object('netto bookings', [55, 48, 30, 25])
    },
    expectedCancellations: {
      default: object('expected cancellations', [40, 20, 10, 0])
    }
  }
});
