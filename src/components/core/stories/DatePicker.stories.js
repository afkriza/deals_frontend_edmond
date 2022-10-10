import DatePicker from '../DatePicker.vue';

export default {
  title: 'Core'
};
export const datePicker = () => ({
  components: { DatePicker },
  template: '<date-picker :date="date" @date:update="updateDate" />',
  data() {
    return {
      date: new Date()
    };
  },
  methods: {
    updateDate(date) {
      this.date = date;
    }
  }
});
