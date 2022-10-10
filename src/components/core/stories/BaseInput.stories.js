import { action } from '@storybook/addon-actions';

import BaseInput from '../BaseInput.vue';

export default {
  title: 'Core/Inputs'
};
export const baseInput = () => ({
  components: { BaseInput },
  template: '<base-input @enter:keypress="buttonEnter" v-model="value" />',
  data() {
    return {
      value: 'default text'
    };
  },
  methods: {
    buttonEnter: action('Enter')
  }
});
