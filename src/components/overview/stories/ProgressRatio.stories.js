import { withKnobs, number, select } from '@storybook/addon-knobs';

import ProgressRatio from '../ProgressRatio.vue';

export default {
  title: 'Overview/Core',
  decorators: [withKnobs]
};

const progressRatioTheme = {
  name: 'Theme',
  options: ['primary', 'featured']
};

export const progressRatio = () => ({
  components: { ProgressRatio },
  template:
    '<div style="margin: 20px; width: 100px;"><progress-ratio :progress="progress" :total="total" :theme="theme" /></div>',
  props: {
    progress: {
      type: Number,
      default: number('progress', 245)
    },
    total: {
      type: Number,
      default: number('total', 300)
    },
    theme: {
      type: String,
      default: select(
        progressRatioTheme.name,
        progressRatioTheme.options,
        progressRatioTheme.options[1]
      )
    }
  }
});
