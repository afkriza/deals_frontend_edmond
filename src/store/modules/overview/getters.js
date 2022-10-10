export default {
  filters(state) {
    return state.filters.data;
  },

  filtersQuery(state, getters) {
    return getters.filters.reduce((accumulator, filter) => {
      return Object.assign(accumulator, filter.value);
    }, {});
  },

  areFiltersLoaded(state) {
    return state.filters.isLoaded;
  }
};
