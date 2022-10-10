import Vue from 'vue';

import * as mutationTypes from 'store/mutation-types';

import { cloneDeep, reject } from 'lodash';

export default {
  [mutationTypes.DASHBOARD_FILTERS_RESET](state) {
    state.filters.data.forEach(filter => filter.reset());
  },

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
    state.dashboard.data = data;
  },

  [mutationTypes.DASHBOARD_CREATE_FAILURE](state) {
    state.forms.dashboard.isLoading = false;
  },

  [mutationTypes.DASHBOARD_REQUEST](state) {
    state.dashboard.isLoading = true;
  },

  [mutationTypes.DASHBOARD_SUCCESS](state, data) {
    state.dashboard.isLoaded = true;
    state.dashboard.isLoading = false;
    state.dashboard.data = data;

    const widgetLoadingData = {
      isLoading: false,
      isLoaded: true,
      isError: false
    };

    state.widgets.data = data.widgets;

    data.widgets.forEach(widget => {
      Vue.set(state.widgets.loadingState, widget.id, widgetLoadingData);
    });
  },

  [mutationTypes.DASHBOARD_FAILURE](state) {
    state.dashboard.isLoading = false;
    state.widgets.loadingState = Object.values(state.widgets.loadingState).map(
      loadingState => {
        return {
          isLoading: false,
          isLoaded: loadingState.isLoaded || false,
          isError: true
        };
      }
    );
  },

  [mutationTypes.DASHBOARD_DELETE_REQUEST](state) {
    state.dashboard.isLoading = true;
    state.dashboard.isLoaded = false;
  },

  [mutationTypes.DASHBOARD_DELETE_SUCCESS](state) {
    state.dashboard.isLoading = false;
    state.dashboard.isLoaded = true;
  },

  [mutationTypes.DASHBOARD_DELETE_FAILURE](state) {
    state.dashboard.isLoading = false;
  },

  [mutationTypes.DASHBOARD_EDIT_REQUEST](state) {
    state.dashboard.isLoading = true;
    state.dashboard.isLoaded = false;
  },

  [mutationTypes.DASHBOARD_EDIT_SUCCESS](state, data) {
    state.dashboard.isLoading = false;
    state.dashboard.isLoaded = true;
    state.dashboard.data = data;
  },

  [mutationTypes.DASHBOARD_EDIT_FAILURE](state) {
    state.dashboard.isLoading = false;
  },

  [mutationTypes.WIDGET_CREATE_REQUEST](state) {
    state.dashboard.isLoading = true;
    state.dashboard.isLoaded = false;
  },

  [mutationTypes.WIDGET_CREATE_SUCCESS](state, data) {
    const loadingData = {
      isLoading: false,
      isLoaded: true
    };

    state.widgets.loadingState[data.id] = loadingData;

    // Add to dashboard only in case it's creating a widget in the present dashboard
    if (data.dashboard.id === state.dashboard.data.id) {
      state.widgets.data.push(data);
    }

    state.dashboard.isLoading = false;
    state.dashboard.isLoaded = true;
  },

  [mutationTypes.WIDGET_CREATE_FAILURE](state) {
    // We don't want the dashboard to be stuck because of a single widget
    state.dashboard.isLoading = false;
    state.dashboard.isLoaded = true;
  },

  [mutationTypes.WIDGET_DELETE_REQUEST](state, id) {
    const loadingData = {
      isLoading: true,
      isLoaded: false
    };

    Vue.set(state.widgets.loadingState, id, loadingData);
  },

  [mutationTypes.WIDGET_DELETE_SUCCESS](state, data) {
    const loadingData = {
      isLoading: false,
      isLoaded: true
    };

    const index = state.widgets.data.findIndex(({ id }) => id === data.id);
    Vue.set(state.widgets.loadingState, data.id, loadingData);
    state.widgets.data.splice(index, 1);
  },

  [mutationTypes.WIDGET_DELETE_FAILURE](state, id) {
    const loadingData = {
      isLoading: false,
      isLoaded: state.widgets.loadingState[id].isLoaded
    };

    Vue.set(state.widgets.loadingState, id, loadingData);
  },

  [mutationTypes.WIDGET_EDIT_REQUEST](state, id) {
    const loadingData = {
      isLoading: true,
      isLoaded: false
    };

    Vue.set(state.widgets.loadingState, id, loadingData);
  },

  [mutationTypes.WIDGET_EDIT_SUCCESS](state, data) {
    const loadingData = {
      isLoading: false,
      isLoaded: true
    };

    const index = state.widgets.data.findIndex(({ id }) => data.id === id);
    Vue.set(state.widgets.loadingState, data.id, loadingData);
    state.widgets.data[index] = data;
  },

  [mutationTypes.WIDGET_EDIT_FAILURE](state, id) {
    const loadingData = {
      isLoading: false,
      isLoaded: state.widgets.loadingState[id].isLoaded
    };

    Vue.set(state.widgets.loadingState, id, loadingData);
  },

  [mutationTypes.WIDGET_BULK_PLACEMENT_EDIT_REQUEST](state, data) {
    const loadingData = {
      isLoading: true,
      isLoaded: false
    };

    data.forEach(({ id }) => {
      Vue.set(state.widgets.loadingState, id, loadingData);
    });
  },

  [mutationTypes.WIDGET_BULK_PLACEMENT_EDIT_SUCCESS](state, data) {
    const loadingData = {
      isLoading: false,
      isLoaded: true
    };

    const newWidgets = data.map(widget => {
      const { id, height, width, positionX, positionY } = widget;
      const placementAttributes = { height, width, positionX, positionY };
      const index = state.widgets.data.findIndex(
        oldWidget => oldWidget.id === id
      );

      Vue.set(state.widgets.loadingState, id, loadingData); // Consider moving this side effect somewhere else

      return { ...state.widgets.data[index], ...placementAttributes };
    });

    state.widgets.data = newWidgets;
  },

  [mutationTypes.WIDGET_BULK_PLACEMENT_EDIT_FAILURE](state, data) {
    data.forEach(({ id }) => {
      const loadingData = {
        isLoading: false,
        isLoaded: state.widgets.loadingState[id].isLoaded
      };

      Vue.set(state.widgets.loadingState, id, loadingData);
    });
  },

  [mutationTypes.WIDGET_CATEGORIES_REQUEST](state) {
    state.widgetCategories.isLoading = true;
    state.widgetCategories.isLoaded = false;
  },

  [mutationTypes.WIDGET_CATEGORIES_SUCCESS](state, data) {
    state.widgetCategories.isLoading = false;
    state.widgetCategories.isLoaded = true;
    state.widgetCategories.data = data;
  },

  [mutationTypes.WIDGET_CATEGORIES_FAILURE](state) {
    state.widgetCategories.isLoading = false;
  },

  [mutationTypes.WIDGET_METRICS_REQUEST](state) {
    state.widgetMetrics.isLoading = true;
    state.widgetMetrics.isLoaded = false;
  },

  [mutationTypes.WIDGET_METRICS_SUCCESS](state, data) {
    state.widgetMetrics.isLoading = false;
    state.widgetMetrics.isLoaded = true;
    state.widgetMetrics.data = data;
  },

  [mutationTypes.WIDGET_METRICS_FAILURE](state) {
    state.widgetMetrics.isLoading = false;
  },

  [mutationTypes.WIDGET_REQUEST](state) {
    state.widget.isLoading = true;
  },

  [mutationTypes.WIDGET_SUCCESS](state, data) {
    state.widget.isLoaded = true;
    state.widget.isLoading = false;
    state.widget.data = data;
  },

  [mutationTypes.WIDGET_RESET](state) {
    state.widget.isLoaded = false;
    state.widget.isLoading = false;
    state.widget.data = [];
  },

  [mutationTypes.WIDGET_FAILURE](state) {
    state.widget.isLoading = false;
  },

  [mutationTypes.RECENTLY_USED_VARIABLES_REQUEST](state) {
    state.fetchRecentlyUsedVariables.isLoading = true;
    state.fetchRecentlyUsedVariables.isLoaded = false;
  },

  [mutationTypes.RECENTLY_USED_VARIABLES_SUCCESS](state, data) {
    state.fetchRecentlyUsedVariables.isLoading = false;
    state.fetchRecentlyUsedVariables.isLoaded = true;
    state.fetchRecentlyUsedVariables.data = data;
  },

  [mutationTypes.RECENTLY_USED_VARIABLES_FAILURE](state) {
    state.fetchRecentlyUsedVariables.isLoading = false;
    state.fetchRecentlyUsedVariables.isLoaded = false;
  },

  [mutationTypes.WIDGET_VARIABLE_CREATE](state, data) {
    state.variables.data.push(data);
  },

  [mutationTypes.WIDGET_VARIABLES_BULK_CREATE](state, data) {
    state.variables.data = data;
  },

  [mutationTypes.WIDGET_VARIABLES_RESET](state) {
    state.variables.data = [];
  },

  [mutationTypes.WIDGET_VARIABLE_EDIT](state, data) {
    const variableIndex = state.variables.data.findIndex(
      ({ variableId }) => variableId === data.variableId
    );

    state.variables.data.splice(variableIndex, 1, data);
  },

  [mutationTypes.WIDGET_VARIABLE_DELETE](state, data) {
    const variableIndex = state.variables.data.findIndex(
      ({ variableId }) => variableId === data.variableId
    );

    state.variables.data.splice(variableIndex, 1);
  },

  [mutationTypes.WIDGET_VALUE_CREATE](state, data) {
    state.values.data.push(data);
  },

  [mutationTypes.WIDGET_VALUE_EDIT](state, data) {
    const valueIndex = state.values.data.findIndex(({ id }) => id === data.id);

    state.values.data.splice(valueIndex, 1, data);
  },

  [mutationTypes.WIDGET_VALUE_DELETE](state, data) {
    const valueIndex = state.values.data.findIndex(({ id }) => id === data.id);

    state.values.data.splice(valueIndex, 1);
  },

  [mutationTypes.WIDGET_VALUE_VARIABLE_EDIT](state, { value, data }) {
    const variables = value.values.filter(
      ({ variableId }) => variableId === data.variableId
    );
    const valueIndex = state.values.data.indexOf(value);

    variables.forEach(variable => {
      const variableIndex = value.values.indexOf(variable);
      const newValue = { ...variable, ...data };

      state.values.data[valueIndex].values.splice(variableIndex, 1, newValue);
    });
  },

  [mutationTypes.WIDGET_VALUES_UPDATE](state, data) {
    state.values.data = cloneDeep(data);
  },

  [mutationTypes.WIDGET_VALUES_RESET](state) {
    state.values.data = [];
  },

  [mutationTypes.WIDGET_VALUES_BULK_CREATE](state, data) {
    state.values.data = data;
  },

  [mutationTypes.WIDGET_CALCULATIONS_REQUEST](state, { id }) {
    const loadingData = {
      isLoading: true,
      isLoaded: false
    };

    Vue.set(state.widgetCalculations.loadingState, id, loadingData);
  },

  [mutationTypes.WIDGET_CALCULATIONS_SUCCESS](state, { id, data, meta }) {
    const loadingData = {
      isLoading: false,
      isLoaded: true
    };

    Vue.set(state.widgetCalculations.loadingState, id, loadingData);
    Vue.set(state.widgetCalculations.data, id, { data, meta });
  },

  [mutationTypes.WIDGET_CALCULATIONS_FAILURE](state, { id }) {
    const loadingData = {
      isLoading: false,
      isLoaded: state.widgetCalculations[id]
        ? state.widgetCalculations[id].isLoaded
        : false,
      isError: true
    };

    Vue.set(state.widgetCalculations.loadingState, id, loadingData);
  },

  [mutationTypes.RESET_WIDGET_CALCULATION_STATE](state, id) {
    const loadingData = {
      isLoading: false,
      isLoaded: false
    };

    Vue.set(state.widgetCalculations.loadingState, id, loadingData);
  },

  [mutationTypes.DASHBOARD_WIDGET_REQUEST](state, { id }) {
    const loadingData = {
      isLoading: true,
      isLoaded: false
    };

    Vue.set(state.widgets.loadingState, id, loadingData);
  },

  [mutationTypes.DASHBOARD_WIDGET_SUCCESS](state, { id, data }) {
    const loadingData = {
      isLoading: false,
      isLoaded: true
    };

    Vue.set(state.widgets.loadingState, id, loadingData);
    const index = state.widgets.data.findIndex(widget => widget.id === id);
    Vue.set(state.widgets.data, index, data);
  },

  [mutationTypes.DASHBOARD_WIDGET_FAILURE](state, { id }) {
    const loadingData = {
      isLoading: false,
      isLoaded: state.widgets[id] ? state.widgets[id].isLoaded : false,
      isError: true
    };

    Vue.set(state.widgets.loadingState, id, loadingData);
  },

  [mutationTypes.DUPLICATE_WIDGET_REQUEST](state) {
    state.dashboard.isLoaded = false;
    state.dashboard.isLoading = true;
  },

  [mutationTypes.DUPLICATE_WIDGET_SUCCESS](state, data) {
    const loadingData = {
      isLoading: false,
      isLoaded: true
    };

    Vue.set(state.widgets.loadingState, data.id, loadingData);
    state.widgets.data.push(data);

    // We don't want the dashboard to be stuck because of a single widget
    state.dashboard.isLoaded = true;
    state.dashboard.isLoading = false;
  },

  [mutationTypes.DUPLICATE_WIDGET_FAILURE](state, id) {
    const loadingData = {
      isLoading: false,
      isLoaded: false
    };

    Vue.set(state.widgets.loadingState, id, loadingData);

    state.dashboard.isLoaded = true;
    state.dashboard.isLoading = false;
  },

  [mutationTypes.TABLE_DISPLAY_DENSITY_REQUEST](state) {
    state.dashboard.isLoading = true;
    state.dashboard.isLoaded = false;
  },

  [mutationTypes.TABLE_DISPLAY_DENSITY_SUCCESS](state, { displayDensity }) {
    state.dashboard.isLoading = false;
    state.dashboard.isLoaded = true;

    state.dashboard.data = { ...state.dashboard.data, displayDensity };
  },

  [mutationTypes.TABLE_DISPLAY_DENSITY_FAILURE](state) {
    state.dashboard.isLoading = false;
    state.dashboard.isLoaded = false;
  },

  [mutationTypes.WIDGET_NAME_REQUEST](state) {
    state.fetchWidgetName.isLoading = true;
  },

  [mutationTypes.WIDGET_NAME_SUCCESS](state, { data }) {
    state.fetchWidgetName.isLoading = false;
    state.fetchWidgetName.isLoaded = true;
    state.fetchWidgetName.data = data;
  },

  [mutationTypes.WIDGET_NAME_FAILURE](state) {
    state.fetchWidgetName.isLoading = false;
  },

  [mutationTypes.DASHBOARD_ADD](state, dashboard) {
    state.dashboards.data.push(dashboard);
  },

  [mutationTypes.DASHBOARD_DELETE](state, dashboard) {
    state.dashboards.data = reject(state.dashboards.data, ['id', dashboard.id]);
  },

  [mutationTypes.DASHBOARD_EDIT](state, dashboard) {
    const foundDashboard = state.dashboards.data.find(
      ({ id }) => id === dashboard.id
    );

    Object.assign(foundDashboard, dashboard);
  }
};
