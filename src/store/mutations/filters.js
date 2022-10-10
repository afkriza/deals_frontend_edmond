import * as mutationTypes from 'store/mutation-types';

export default {
  /**
   * Mutations called from Vuex filters module when loading filters. Used to indicate the filters are loading.
   *
   * @param state Vuex module's state
   * @param flag indicates whether or not the filters are loading
   */
  [mutationTypes.ARE_FILTERS_LOADING](state, flag) {
    state.areFiltersLoading = flag;
  }
};
