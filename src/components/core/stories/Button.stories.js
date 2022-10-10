import { action } from '@storybook/addon-actions';

import Button from 'components/core/Button.vue';

export default {
  title: 'Core'
};

export const baseButton = () => ({
  components: { Button },
  template: '<Button @click="buttonAction">Hello Button</Button>',
  methods: { buttonAction: action('Button clicked') }
});
