export default {
  data() {
    const routeSplit = this.$route.path.split('/');

    if (routeSplit.length < 2) {
      return {};
    }

    return {
      namespace: routeSplit[1]
    };
  }
};
