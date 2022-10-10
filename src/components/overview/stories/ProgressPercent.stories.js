import { withKnobs, number, select } from '@storybook/addon-knobs';

import ProgressPercent from '../ProgressPercent.vue';

export default {
  title: 'Overview/Core',
  decorators: [withKnobs]
};

const progressPercentTheme = {
  name: 'Theme',
  options: ['primary', 'secondary']
};

export const progressPercent = () => ({
  components: { ProgressPercent },
  template:
    '<div class="body"><progress-percent :progress="progress" :theme="theme" /></div>',
  props: {
    progress: {
      type: Number,
      default: number('progress', 50)
    },
    theme: {
      type: String,
      default: select(
        progressPercentTheme.name,
        progressPercentTheme.options,
        progressPercentTheme.options[0]
      )
    }
  }
});
