import ExpectedBookingByChannel from '@/components/overview/graphs/ExpectedBookingByChannel.vue';
import { object, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Overview/Graphs/ExpectedBookingByChannel',
  decorators: [withKnobs]
};

export const Default = () => ({
  template: `
    <ExpectedBookingByChannel 
        :channels="channels"
        :median="median"
        :q1="q1"
        :q3="q3"
        :min="min"
        :max="max"
        :booking="booking"
    />`,
  components: {
    ExpectedBookingByChannel
  },
  props: {
    channels: {
      default: object('Channels', [
        'Alotman',
        'B2B',
        'Grupe',
        'Individualci',
        'Mice',
        'Ostalo',
        'Total'
      ])
    },
    median: {
      default: object('Median values', [
        104.15,
        63.55,
        104.975,
        12.35,
        44.18181818181818,
        2.8333333333333335,
        332.0401515151515
      ])
    },
    q1: {
      default: object('Q1 values', [
        0.0,
        0.0,
        0.0,
        4.582377945615468,
        0.0,
        0.0,
        48.318630277312806
      ])
    },
    q3: {
      default: object('Q3 values', [
        55.19951531968895,
        41.13242494584023,
        59.853101054336214,
        13.417622054384532,
        37.79523294097555,
        3.5449494589721118,
        53.681369722687194
      ])
    },
    min: {
      default: object('Min values', [
        0.0,
        0.0,
        0.0,
        0.1647558912309357,
        0.0,
        0.0,
        45.63726055462561
      ])
    },
    max: {
      default: object('Max values', [
        104.3990306393779,
        69.26484989168046,
        98.70620210867243,
        17.835244108769064,
        73.5904658819511,
        7.0898989179442236,
        56.36273944537439
      ])
    },
    booking: {
      default: object('Current booking values', [
        6.0,
        13.0,
        21.0,
        9.0,
        2.0,
        0.0,
        51.0
      ])
    }
  }
});
