import PriceBasket from '@/components/overview/graphs/PriceBasket.vue';
import { object, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Overview/Graphs/PriceBasket',
  decorators: [withKnobs]
};

export const Default = () => ({
  template: `
    <PriceBasket
        :scores="scores"
        :score-values="scoreValues"
        :score-breakdown-values="scoreBreakdownValues"
        :score-breakdown-categories="scoreBreakdownCategories"
    />`,
  components: {
    PriceBasket
  },
  props: {
    scores: {
      default: object('Scores', [100, 120, 140, 160, 170])
    },
    scoreBreakdownValues: {
      default: object('Score breakdown values', [
        [10, 10, 0, 0],
        [2, 20, 0, 0],
        [0, 5, 5, 0],
        [3, 0, 2, 0],
        [3, 0, 2, 0]
      ])
    },
    scoreValues: {
      default: object('Score values', [10, 50, 18, 15, 10])
    },
    scoreBreakdownCategories: {
      default: object('Score breakdown categories', [
        'More than 30 days',
        'Last 30 days',
        'Last week',
        'Yesterday'
      ])
    }
  }
});
