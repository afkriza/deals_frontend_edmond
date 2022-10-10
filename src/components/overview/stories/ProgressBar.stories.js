import { withKnobs, number } from '@storybook/addon-knobs';

import ProgressBar from '../ProgressBar.vue';

export default {
  title: 'Overview/Core',
  decorators: [withKnobs]
};

export const progressBar = () => ({
  components: { ProgressBar },
  template:
    '<div style="margin: 20px; width: 200px;"><progress-bar :progress="progress" /></div>',
  props: {
    progress: {
      type: Number,
      default: number('progress', 50)
    }
  }
});
