import DateRange from '../DateRange.vue';

export default {
  title: 'Core'
};
export const dateRange = () => ({
  components: { DateRange },
  template:
    '<date-range :startDate="startDate" :endDate="endDate" @end-date:update="updateEndDate" @start-date:update="updateStartDate" />',
  data() {
    return {
      startDate: new Date(2020, 3, 10),
      endDate: new Date(2020, 3, 25)
    };
  },
  methods: {
    updateStartDate(date) {
      this.startDate = date;
    },
    updateEndDate(date) {
      this.endDate = date;
    }
  }
});
