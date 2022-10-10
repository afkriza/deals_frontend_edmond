import { withKnobs, select } from '@storybook/addon-knobs';

import CardIcon from '../CardIcon.vue';
import { CARD_ACTIONS } from '@/constants/overview';

export default {
  title: 'Overview/Core',
  decorators: [withKnobs]
};

const cardIconType = {
  name: 'Icon Type',
  options: CARD_ACTIONS
};

export const cardIcon = () => ({
  components: { CardIcon },
  template: '<div class="body"><card-icon :type="type" /></div>',
  props: {
    type: {
      type: String,
      default: select(
        cardIconType.name,
        cardIconType.options,
        cardIconType.options[0]
      )
    }
  }
});
