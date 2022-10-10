import ExpandedViewProgressBar from '../ExpandedViewProgressBar';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Overview/ExpandedView/ExpandedViewProgressBar'
};

const template = `
  <ExpandedViewProgressBar style="margin: 20px" :actual="actual" :total="total" />
`;

export const Default = () => ({
  template,
  components: { ExpandedViewProgressBar },
  props: {
    actual: {
      default: number('Actual', 67)
    },
    total: {
      default: number('Total', 300)
    }
  }
});
