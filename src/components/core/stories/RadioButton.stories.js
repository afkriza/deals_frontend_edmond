import RadioButton from '../RadioButton.vue';

export default {
  title: 'Core'
};
export const radioButton = () => ({
  components: { RadioButton },
  template: '<RadioButton :value="value" :label="label" :theme="theme" @input=""/>',
  data() {
    return {
      value: true,
      label: 'AC Polari',
      theme: 'primary'
    };
  },
  methods: {
    onInput(value) {
      this.value = value;
    }
  }
});
