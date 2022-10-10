import { withKnobs, number } from '@storybook/addon-knobs';

import ProgressInfo from 'components/overview/ProgressInfo.vue';

export default {
  title: 'Overview/Header',
  decorators: [withKnobs]
};

export const progressInfo = () => ({
  components: { ProgressInfo },
  template: '<progress-info :progress="progress" :total="total" />',
  props: {
    progress: {
      type: Number,
      default: number('progress', 240)
    },
    total: {
      type: Number,
      default: number('total', 300)
    }
  }
});
