import { initState } from 'utils/store';

export default () => {
  const agencies = initState();
  const dashboards = initState();
  const widgetCategories = initState();
  const widgetMetrics = initState();

  const variables = {
    data: []
  };

  const values = {
    data: []
  };

  const dashboard = {
    isLoading: false,
    isLoaded: false,
    data: {}
  };

  const forms = {
    dashboard: {
      isLoading: false,
      isLoaded: false
    }
  };

  const widgetCalculations = {
    loadingState: {},
    data: {}
  };

  const widget = {
    isLoaded: false,
    isLoading: false,
    data: {}
  };

  const widgets = {
    loadingState: {},
    data: []
  };

  const fetchWidgetName = {
    isLoaded: false,
    isLoading: false,
    data: {}
  };

  const fetchRecentlyUsedVariables = {
    isLoaded: false,
    isLoading: false,
    data: {}
  };

  return {
    agencies,
    dashboards,
    dashboard,
    forms,
    values,
    variables,
    widget,
    widgets,
    widgetCalculations,
    widgetCategories,
    widgetMetrics,
    fetchWidgetName,
    fetchRecentlyUsedVariables
  };
};
