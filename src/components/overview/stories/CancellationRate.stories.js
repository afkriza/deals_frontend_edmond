import CancellationRate from '@/components/overview/graphs/CancellationRate.vue';
import { object, withKnobs } from '@storybook/addon-knobs';
import { addDays } from 'date-fns';

export default {
  title: 'Overview/Graphs/CancellationRate',
  decorators: [withKnobs]
};

export const Default = () => ({
  template: `
    <CancellationRate
        :date="date"
        :booking-window="bookingWindow"
        :cancellation-rate="cancellationRate"
        :pie-labels="pieLabels"
        :pie-values-current="pieValuesCurrent"
        :pie-values-history="pieValuesHistory"
        show-pie
    />`,
  components: {
    CancellationRate
  },
  props: {
    date: {
      default: object('Date', addDays(new Date(), 40))
    },
    bookingWindow: {
      default: object('Booking window', [0, 10, 20, 30, 40, 50, 60, 70])
    },
    cancellationRate: {
      default: object(
        'Cancellation rate',
        [0.0, 0.2, 0.34, 0.4, 0.45, 0.32, 0.3]
      )
    },
    pieLabels: {
      default: object('Pie labels', ['Cancelled', 'Book'])
    },
    pieValuesHistory: {
      default: object('Pie values history', [30.6, 69.4])
    },
    pieValuesCurrent: {
      default: object('Pie values current', [37, 63])
    }
  }
});
