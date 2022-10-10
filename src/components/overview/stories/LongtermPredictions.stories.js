import LongtermPredictions from '@/components/overview/graphs/LongtermPredictions.vue';
import { number, object, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Overview/Graphs/LongtermPredictions',
  decorators: [withKnobs]
};

export const Default = () => ({
  template: `
    <LongtermPredictions 
      :years="years" 
      :history-realisations="historyRealisations" 
      :longterm-prediction="longtermPrediction" 
      :current-estimate="currentEstimate" 
    />`,
  components: {
    LongtermPredictions
  },
  props: {
    years: {
      default: object('Years', [2017, 2018, 2019])
    },
    historyRealisations: {
      default: object('History realisations', [0.6, 0.76, null])
    },
    longtermPrediction: {
      default: number('Longterm prediction', 0.83)
    },
    currentEstimate: {
      default: number('Current estimate', 0.79)
    }
  }
});
