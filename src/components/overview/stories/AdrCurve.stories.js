import AdrCurve from '@/components/overview/graphs/AdrCurve.vue';
import { object, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Overview/Graphs/AdrCurve',
  decorators: [withKnobs]
};

export const Default = () => ({
  template: `
    <AdrCurve
        :booking-window="bookingWindow"
        :current-cumulative-rate="currentCumulativeRate"
        :current-daily-rate="currentDailyRate"
        :history-cumulative-rate="historyCumulativeRate"
    />`,
  components: {
    AdrCurve
  },
  props: {
    bookingWindow: {
      default: object('Booking window', [
        254,
        236,
        114,
        97,
        94,
        197,
        141,
        128,
        81,
        78,
        63,
        62,
        46,
        37,
        32,
        31,
        24,
        17,
        16,
        15,
        12,
        10,
        7,
        5,
        4,
        1
      ])
    },
    currentDailyRate: {
      default: object('Current ADR', [
        186.16,
        186.15,
        157.3,
        156.924,
        186.2,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ])
    },
    currentCumulativeRate: {
      default: object('Current cumulative ADR', [
        186.16,
        186.155,
        176.53666666666666,
        171.6335,
        174.5468,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ])
    },
    historyCumulativeRate: {
      default: object('Last year cumulative ADR', [
        null,
        null,
        null,
        null,
        null,
        136.576,
        143.51299999999998,
        193.70866666666666,
        190.119,
        182.125,
        182.0525,
        200.3307142857143,
        196.37,
        196.7362962962963,
        205.4626666666667,
        212.57660606060608,
        209.6118888888889,
        205.36789743589745,
        201.41304761904763,
        198.76391111111113,
        194.9578541666667,
        194.98974509803924,
        190.87920370370372,
        188.09608771929825,
        185.34128333333337,
        184.53931746031748
      ])
    }
  }
});
