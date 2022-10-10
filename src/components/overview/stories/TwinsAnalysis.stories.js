import TwinsAnalysis from '@/components/overview/graphs/TwinsAnalysis.vue';
import { withKnobs, array, object } from '@storybook/addon-knobs';

export default {
  title: 'Overview/Graphs/TwinsAnalysis',
  decorators: [withKnobs]
};

export const Default = () => ({
  template: '<twins-analysis :dates="dates" :number-of-rooms="numberOfRooms" />',
  components: {
    TwinsAnalysis
  },
  props: {
    dates: {
      default: object('dates', [
        '-14',
        '-7',
        '-2',
        '-1',
        'Current date',
        '+1',
        '+2',
        '+7',
        '+14'
      ])
    },
    numberOfRooms: {
      default: object('number of rooms', [
        250,
        238,
        235,
        232,
        220,
        230,
        237,
        244,
        250
      ])
    }
  }
});
