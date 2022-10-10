import * as mutationTypes from 'store/mutation-types';

import CategoryModel from 'components/analytics/models/Category.js';

import { genericApiAction } from 'utils/store';
import { downloadFileFromStream } from 'utils/file';
import {
  createDashboard,
  deleteDashboard,
  editDashboard,
  fetchDashboard,
  fetchDashboards,
  setUserDashboardDensity
} from 'api/services/Dashboards.service';
import {
  convertWidget,
  createWidget,
  deleteWidget,
  duplicateWidget,
  editWidget,
  exportWidget,
  fetchWidget,
  fetchWidgetCalculations
} from 'api/services/Widgets.service';
import {
  fetchCategories,
  fetchMetrics,
  fetchRecentlyUsedVariables,
  fetchWidgetName
} from 'api/services/WidgetWizard.service';

export default function (namespace) {
  const domain = namespace.replace('-', '_');

  return {
    fetchDashboards({ commit }, domain) {
      commit(mutationTypes.DASHBOARDS_REQUEST);
      return fetchDashboards(domain)
        .then(({ data }) => {
          commit(mutationTypes.DASHBOARDS_SUCCESS, data);
        })
        .catch(error => {
          commit(mutationTypes.DASHBOARDS_FAILURE);
          throw error;
        });
    },

    createNewDashboard({ commit }, data) {
      commit(mutationTypes.DASHBOARD_CREATE_REQUEST);
      return createDashboard(data)
        .then(({ data: dashboard }) => {
          commit(mutationTypes.DASHBOARD_CREATE_SUCCESS, dashboard);
          commit(`analytics/${mutationTypes.DASHBOARD_ADD}`, dashboard, {
            root: true
          });
        })
        .catch(error => {
          commit(mutationTypes.DASHBOARD_CREATE_FAILURE);
          throw error;
        });
    },

    fetchDashboard({ commit }, id) {
      commit(mutationTypes.DASHBOARD_REQUEST);
      return fetchDashboard(id)
        .then(({ data }) => {
          commit(mutationTypes.DASHBOARD_SUCCESS, data);
        })
        .catch(error => {
          commit(mutationTypes.DASHBOARD_FAILURE);
          throw error;
        });
    },

    deleteDashboard({ commit, getters }) {
      commit(mutationTypes.DASHBOARD_DELETE_REQUEST);
      return deleteDashboard(getters.dashboard.id)
        .then(({ data: dashboard }) => {
          commit(mutationTypes.DASHBOARD_DELETE_SUCCESS, dashboard);
          commit(`analytics/${mutationTypes.DASHBOARD_DELETE}`, dashboard, {
            root: true
          });
        })
        .catch(error => {
          commit(mutationTypes.DASHBOARD_DELETE_FAILURE);
          throw error;
        });
    },

    editDashboard({ commit, getters }, data) {
      commit(mutationTypes.DASHBOARD_EDIT_REQUEST);
      return editDashboard(data, getters.dashboard.id)
        .then(({ data: dashboard }) => {
          commit(mutationTypes.DASHBOARD_EDIT_SUCCESS, dashboard);
          commit(`analytics/${mutationTypes.DASHBOARD_EDIT}`, dashboard, {
            root: true
          });
        })
        .catch(error => {
          commit(mutationTypes.DASHBOARD_EDIT_FAILURE);
          throw error;
        });
    },

    editTableDisplayDensity({ commit, getters }, data) {
      commit(mutationTypes.TABLE_DISPLAY_DENSITY_REQUEST);
      return setUserDashboardDensity(
        getters.currentUser.id,
        getters.dashboard.id,
        data
      )
        .then(({ data: resData }) => {
          commit(mutationTypes.TABLE_DISPLAY_DENSITY_SUCCESS, resData);
        })
        .catch(error => {
          commit(mutationTypes.TABLE_DISPLAY_DENSITY_FAILURE);
          throw error;
        });
    },

    // Used for fetching widget data on widget page
    fetchWidget({ commit }, id) {
      commit(mutationTypes.WIDGET_REQUEST);
      return fetchWidget(id)
        .then(({ data }) => {
          commit(mutationTypes.WIDGET_SUCCESS, data);

          return data;
        })
        .catch(error => {
          commit(mutationTypes.WIDGET_FAILURE);
          throw error;
        });
    },

    fetchRecentlyUsedVariables({ commit }) {
      commit(mutationTypes.RECENTLY_USED_VARIABLES_REQUEST);
      return fetchRecentlyUsedVariables(domain)
        .then(({ data }) => {
          commit(mutationTypes.RECENTLY_USED_VARIABLES_SUCCESS, data);

          return data;
        })
        .catch(error => {
          commit(mutationTypes.RECENTLY_USED_VARIABLES_FAILURE);
          throw error;
        });
    },

    // Used for fetching widget data on dashboard page
    fetchDashboardWidget({ commit }, id) {
      commit(mutationTypes.DASHBOARD_WIDGET_REQUEST, { id });
      return fetchWidget(id)
        .then(({ data }) => {
          commit(mutationTypes.DASHBOARD_WIDGET_SUCCESS, { id, data });
        })
        .catch(error => {
          commit(mutationTypes.DASHBOARD_WIDGET_FAILURE, { id });
          throw error;
        });
    },

    createWidget({ commit }, data) {
      commit(mutationTypes.WIDGET_CREATE_REQUEST);
      return createWidget(data)
        .then(({ data: resData }) => {
          commit(mutationTypes.WIDGET_CREATE_SUCCESS, resData);
          return resData;
        })
        .catch(error => {
          commit(mutationTypes.WIDGET_CREATE_FAILURE);
          throw error;
        });
    },

    deleteWidget({ commit }, id) {
      commit(mutationTypes.WIDGET_DELETE_REQUEST, id);
      return deleteWidget(id)
        .then(({ data: resData }) => {
          commit(mutationTypes.WIDGET_DELETE_SUCCESS, resData);
          return resData;
        })
        .catch(error => {
          commit(mutationTypes.WIDGET_DELETE_FAILURE, id);
          throw error;
        });
    },

    editWidget({ commit }, data) {
      const { id, ...rest } = data;

      commit(mutationTypes.WIDGET_EDIT_REQUEST, id);
      return editWidget(rest, id)
        .then(({ data: resData }) => {
          commit(mutationTypes.WIDGET_EDIT_SUCCESS, resData);
          return resData;
        })
        .catch(error => {
          commit(mutationTypes.WIDGET_EDIT_FAILURE, id);
          throw error;
        });
    },

    bulkEditWidgetPlacement({ commit }, data) {
      commit(mutationTypes.WIDGET_BULK_PLACEMENT_EDIT_REQUEST, data);
      return Promise.all(data.map(widget => editWidget(widget, widget.id)))
        .then(() => {
          commit(mutationTypes.WIDGET_BULK_PLACEMENT_EDIT_SUCCESS, data);
        })
        .catch(error => {
          commit(mutationTypes.WIDGET_BULK_PLACEMENT_EDIT_FAILURE, data);
          throw error;
        });
    },

    fetchCategories({ commit }) {
      commit(mutationTypes.WIDGET_CATEGORIES_REQUEST);
      return fetchCategories(domain)
        .then(({ data }) => {
          const categoryModels = data.map(CategoryModel.from);

          commit(mutationTypes.WIDGET_CATEGORIES_SUCCESS, categoryModels);
        })
        .catch(error => {
          commit(mutationTypes.WIDGET_CATEGORIES_FAILURE);
          throw error;
        });
    },

    fetchMetrics({ commit }) {
      commit(mutationTypes.WIDGET_METRICS_REQUEST);
      return fetchMetrics(domain)
        .then(({ data }) => {
          commit(mutationTypes.WIDGET_METRICS_SUCCESS, data);
        })
        .catch(error => {
          commit(mutationTypes.WIDGET_METRICS_FAILURE);
          throw error;
        });
    },

    fetchWidgetCalculations(context, { widgetId, filters }) {
      const payload = { filter: filters };

      return fetchWidgetCalculations(widgetId, payload);
    },

    duplicateWidget({ commit }, id) {
      commit(mutationTypes.DUPLICATE_WIDGET_REQUEST, id);
      return duplicateWidget(id)
        .then(({ data }) => {
          commit(mutationTypes.DUPLICATE_WIDGET_SUCCESS, data);
          return data;
        })
        .catch(error => {
          commit(mutationTypes.DUPLICATE_WIDGET_FAILURE, id);
          throw error;
        });
    },

    exportWidget({ getters }, { id, signal }) {
      const filter = getters['filters/filtersQuery'];
      const payload = { filter, format: 'xlsx' };

      return exportWidget(id, payload, signal)
        .then(downloadFileFromStream)
        .catch(error => {
          throw error;
        });
    },

    fetchWidgetName(context, dashboardId) {
      return genericApiAction(
        fetchWidgetName,
        context,
        dashboardId,
        mutationTypes.WIDGET_NAME_REQUEST
      );
    },

    async convertWidget(context, { widgetId, representation }) {
      const { data: convertedWidget } = await convertWidget(
        widgetId,
        representation
      );

      return convertedWidget;
    }
  };
}
