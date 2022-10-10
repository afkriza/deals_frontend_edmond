import * as mutationTypes from 'store/mutation-types';

export default {
  [mutationTypes.DASHBOARDS_REQUEST](state) {
    state.dashboards.isLoading = true;
    state.dashboards.isLoaded = false;
  },

  [mutationTypes.DASHBOARDS_SUCCESS](state, data) {
    state.dashboards.isLoading = false;
    state.dashboards.isLoaded = true;
    state.dashboards.data = data;
  },

  [mutationTypes.DASHBOARDS_FAILURE](state) {
    state.dashboards.isLoading = false;
  },

  [mutationTypes.DASHBOARD_CREATE_REQUEST](state) {
    state.forms.dashboard.isLoading = true;
    state.forms.dashboard.isLoaded = false;
  },

  [mutationTypes.DASHBOARD_CREATE_SUCCESS](state, data) {
    state.forms.dashboard.isLoading = false;
    state.forms.dashboard.isLoaded = true;
    state.dashboards.data.push(data);
  },

  [mutationTypes.DASHBOARD_CREATE_FAILURE](state) {
    state.forms.dashboard.isLoading = false;
  }
};
