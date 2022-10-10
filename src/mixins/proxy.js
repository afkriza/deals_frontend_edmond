export default {
  methods: {
    proxy(eventName, eventData) {
      this.$emit(eventName, eventData);
    }
  }
};
