import { ANALYTICS, RATE_SHOPPER } from 'constants/namespaces';

export default {
  dashboard(state) {
    return state.dashboard.data;
  },

  dashboards(state) {
    return state.dashboards.data;
  },

  widgets(state) {
    return state.widgets.data;
  },

  getWidgetById(state, { widgets }) {
    return id => widgets.find(widget => widget.id === id);
  },

  widgetsLoadingStates(state) {
    return state.widgets.loadingState;
  },

  widgetCalculations(state) {
    return state.widgetCalculations.data;
  },

  widgetCalculationLoadingStates(state) {
    return state.widgetCalculations.loadingState;
  },

  widgetIDs(state) {
    return state.widgets.data.map(({ id }) => id);
  },

  isLoadingDashboard(state) {
    return state.dashboard.isLoading;
  },

  isDashboardsLoaded(state) {
    return state.dashboards.isLoaded;
  },

  isSavingDashboard(state) {
    return state.forms.dashboard.isLoading;
  },

  isWidgetCategoriesLoaded(state) {
    return state.widgetCategories.isLoaded;
  },

  isWidgetMetricsLoaded(state) {
    return state.widgetMetrics.isLoaded;
  },

  isWidgetLoaded(state) {
    return state.widget.isLoaded;
  },

  values(state) {
    return state.values.data;
  },

  variables(state) {
    return state.variables.data;
  },

  widgetData(state) {
    return state.widget.data;
  },

  recentlyUsedVariables(state) {
    return state.fetchRecentlyUsedVariables.data;
  },

  widgetCategories(state) {
    return state.widgetCategories.data;
  },

  widgetMetrics(state) {
    return state.widgetMetrics.data;
  },

  currentUser(state, getters, rootState, rootGetters) {
    return rootGetters.currentUser;
  },

  widgetNameGenerated(state) {
    return state.fetchWidgetName.data.name;
  },

  dashboardsAnalytics(state, getters) {
    return getters.dashboards.filter(({ domain }) => domain === ANALYTICS);
  },

  dashboardsRateShopper(state, getters) {
    return getters.dashboards.filter(
      ({ domain }) => domain === RATE_SHOPPER.replace('-', '_')
    );
  }
};
