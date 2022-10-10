import { withKnobs, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import MiniSlider from 'components/overview/MiniSlider.vue';

export default {
  title: 'Overview/Core',
  decorators: [withKnobs]
};

export const miniSlider = () => ({
  components: { MiniSlider },
  template:
    '<div class="body"><mini-slider :title="slideTitle" @slideAction:click="slideAction" @navigationBack:click="navigationBack" @navigationForward:click="navigationForward" /></div>',
  props: {
    slideTitle: {
      type: String,
      default: text('Slide Title', 'September 2020')
    }
  },
  methods: {
    slideAction: action('Slide action clicked'),
    navigationBack: action('Navigation Back clicked'),
    navigationForward: action('Navigation Forward clicked')
  }
});
