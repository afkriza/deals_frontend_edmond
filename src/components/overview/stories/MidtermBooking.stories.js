import MidtermBooking from '@/components/overview/graphs/MidtermBooking.vue';
import { withKnobs, object, number } from '@storybook/addon-knobs';

export default {
  title: 'Overview/Graphs/MidtermBooking',
  decorators: [withKnobs]
};

export const Default = () => ({
  template: '<midterm-booking :booking="booking" :mean="mean" :std="std" />',
  components: {
    MidtermBooking
  },
  props: {
    booking: {
      default: number('booking rooms', 150)
    },
    mean: {
      default: number('booking rooms mean', 80)
    },
    std: {
      default: number('booking rooms std', 15)
    }
  }
});
