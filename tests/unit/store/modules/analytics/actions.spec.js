import testAction from 'helpers/action';
import actionsGenerator from 'store/modules/dashboard/actions';
import * as mutationTypes from 'store/mutation-types';

jest.mock('api/services/Dashboards.service');
jest.mock('api/services/Widgets.service');
jest.mock('api/services/WidgetWizard.service');

describe('Actions/analytics', function () {
  let actions;
  const getters = {
    filtersQuery: {},
    dashboard: {
      id: 11
    }
  };

  beforeEach(function () {
    actions = actionsGenerator('analytics');
  });

  it('fetches dashboards', function () {
    return testAction(actions.fetchDashboards, {
      state: {
        dashboards: {
          isLoading: false,
          isLoaded: false,
          data: []
        }
      },
      expectedMutations: [
        {
          type: mutationTypes.DASHBOARDS_REQUEST
        },
        {
          type: mutationTypes.DASHBOARDS_SUCCESS
        }
      ]
    });
  });

  it('creates new dashboard', function () {
    return testAction(actions.createNewDashboard, {
      data: {
        name: 'Ime dashboarda',
        public: false
      },
      state: {
        forms: {
          dashboard: {
            isLoading: false,
            isLoaded: false
          }
        }
      },
      expectedMutations: [
        {
          type: mutationTypes.DASHBOARD_CREATE_REQUEST
        },
        {
          type: mutationTypes.DASHBOARD_CREATE_SUCCESS
        }
      ]
    });
  });

  it('fetches dashboard', function () {
    return testAction(actions.fetchDashboard, {
      state: {
        dashboard: {
          isLoading: false,
          isLoaded: false,
          data: []
        }
      },
      expectedMutations: [
        {
          type: mutationTypes.DASHBOARD_REQUEST
        },
        {
          type: mutationTypes.DASHBOARD_SUCCESS
        }
      ]
    });
  });

  it('deletes dashboard', function () {
    return testAction(actions.deleteDashboard, {
      state: {
        dashboard: {
          isLoading: false,
          isLoaded: true
        }
      },
      getters,
      expectedMutations: [
        {
          type: mutationTypes.DASHBOARD_DELETE_REQUEST
        },
        {
          type: mutationTypes.DASHBOARD_DELETE_SUCCESS
        }
      ]
    });
  });

  it('edits dashboard', function () {
    return testAction(actions.editDashboard, {
      state: {
        dashboard: {
          isLoading: false,
          isLoaded: true
        },
        dashboards: [
          {
            name: 'first name',
            id: 11
          }
        ]
      },
      payload: {
        name: 'test',
        id: 11
      },
      getters,
      expectedMutations: [
        {
          type: mutationTypes.DASHBOARD_EDIT_REQUEST
        },
        {
          type: mutationTypes.DASHBOARD_EDIT_SUCCESS
        }
      ]
    });
  });

  it('fetches widget', function () {
    return testAction(actions.fetchWidget, {
      state: {
        widget: {
          isLoading: false,
          isLoaded: false
        }
      },
      payload: {
        id: 11
      },
      expectedMutations: [
        {
          type: mutationTypes.WIDGET_REQUEST
        },
        {
          type: mutationTypes.WIDGET_SUCCESS
        }
      ]
    });
  });

  it('creates widget', function () {
    return testAction(actions.createWidget, {
      state: {
        widget: {
          isLoading: false,
          isLoaded: false
        }
      },
      payload: {
        id: 11
      },
      expectedMutations: [
        {
          type: mutationTypes.WIDGET_CREATE_REQUEST
        },
        {
          type: mutationTypes.WIDGET_CREATE_SUCCESS
        }
      ]
    });
  });

  it('deletes widget', function () {
    return testAction(actions.deleteWidget, {
      state: {
        widget: {
          isLoading: false,
          isLoaded: false
        }
      },
      payload: {
        id: 11
      },
      expectedMutations: [
        {
          type: mutationTypes.WIDGET_DELETE_REQUEST
        },
        {
          type: mutationTypes.WIDGET_DELETE_SUCCESS
        }
      ]
    });
  });

  it('edits widget', function () {
    return testAction(actions.editWidget, {
      state: {
        widget: {
          isLoading: false,
          isLoaded: false
        }
      },
      payload: {
        name: 'widget',
        width: 11,
        height: 11,
        id: 11
      },
      expectedMutations: [
        {
          type: mutationTypes.WIDGET_EDIT_REQUEST
        },
        {
          type: mutationTypes.WIDGET_EDIT_SUCCESS
        }
      ]
    });
  });

  it('bulk edits widgets', function () {
    return testAction(actions.bulkEditWidgetPlacement, {
      state: {
        widgets: {
          isLoading: false,
          isLoaded: false
        }
      },
      payload: [
        {
          id: 11
        },
        {
          id: 12
        }
      ],
      expectedMutations: [
        {
          type: mutationTypes.WIDGET_BULK_PLACEMENT_EDIT_REQUEST
        },
        {
          type: mutationTypes.WIDGET_BULK_PLACEMENT_EDIT_SUCCESS
        }
      ]
    });
  });

  it('fetches categories', function () {
    return testAction(actions.fetchCategories, {
      state: {
        widgetCategories: {
          isLoading: false,
          isLoaded: false,
          data: []
        }
      },
      expectedMutations: [
        {
          type: mutationTypes.WIDGET_CATEGORIES_REQUEST
        },
        {
          type: mutationTypes.WIDGET_CATEGORIES_SUCCESS
        }
      ]
    });
  });

  it('fetches autogenerated widget name', function () {
    return testAction(actions.fetchWidgetName, {
      state: {
        fetchWidgetName: {
          isLoading: false,
          isLoaded: false,
          data: []
        }
      },
      expectedMutations: [
        {
          type: mutationTypes.WIDGET_NAME_REQUEST
        },
        {
          type: mutationTypes.WIDGET_NAME_SUCCESS
        }
      ]
    });
  });
});
