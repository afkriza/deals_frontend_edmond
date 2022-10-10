/* eslint-disable new-cap */
import { expect } from 'chai';

import * as mutationTypes from 'store/mutation-types';
import mutations from 'store/modules/dashboard/mutations';

describe('Mutations/analytics', function () {
  it(mutationTypes.DASHBOARDS_REQUEST, function () {
    const state = {
      dashboards: {
        isLoading: false
      }
    };

    mutations.DASHBOARDS_REQUEST(state);

    expect(state.dashboards.isLoading).to.equal(true);
  });

  it(mutationTypes.DASHBOARDS_SUCCESS, function () {
    const state = {
      dashboards: {
        isLoading: true,
        isLoaded: false,
        data: []
      }
    };

    const data = [
      {
        name: 'Neki dashboard',
        public: false
      }
    ];

    mutations.DASHBOARDS_SUCCESS(state, data);

    expect(state.dashboards.isLoading).to.equal(false);
    expect(state.dashboards.isLoaded).to.equal(true);
    expect(state.dashboards.data[0].name).to.equal('Neki dashboard');
  });

  it(mutationTypes.DASHBOARDS_FAILURE, function () {
    const state = {
      dashboards: {
        isLoading: true,
        isLoaded: false
      }
    };

    mutations.DASHBOARDS_FAILURE(state);

    expect(state.dashboards.isLoading).to.equal(false);
    expect(state.dashboards.isLoaded).to.equal(false);
  });

  it(mutationTypes.DASHBOARD_CREATE_REQUEST, function () {
    const state = {
      forms: {
        dashboard: {
          isLoading: false
        }
      }
    };

    mutations.DASHBOARD_CREATE_REQUEST(state);

    expect(state.forms.dashboard.isLoading).to.equal(true);
  });

  it(mutationTypes.DASHBOARD_CREATE_SUCCESS, function () {
    const state = {
      forms: {
        dashboard: {
          isLoading: true,
          isLoaded: false
        }
      },

      dashboards: {
        data: [
          {
            name: 'Neki dashboard',
            public: false
          }
        ]
      },

      dashboard: {
        data: {}
      }
    };

    const newDashboard = {
      name: 'Novi dashboard',
      public: false
    };

    mutations.DASHBOARD_CREATE_SUCCESS(state, newDashboard);
    mutations.DASHBOARD_ADD(state, newDashboard);
    expect(state.forms.dashboard.isLoading).to.equal(false);
    expect(state.forms.dashboard.isLoaded).to.equal(true);
    expect(state.dashboards.data[1].name).to.equal('Novi dashboard');
  });

  it(mutationTypes.DASHBOARD_CREATE_FAILURE, function () {
    const state = {
      forms: {
        dashboard: {
          isLoading: true,
          isLoaded: false
        }
      }
    };

    mutations.DASHBOARD_CREATE_FAILURE(state);

    expect(state.forms.dashboard.isLoading).to.equal(false);
    expect(state.forms.dashboard.isLoaded).to.equal(false);
  });

  it(mutationTypes.DASHBOARD_REQUEST, function () {
    const state = {
      dashboard: {
        isLoading: false
      }
    };

    mutations.DASHBOARD_REQUEST(state);

    expect(state.dashboard.isLoading).to.equal(true);
  });

  it(mutationTypes.DASHBOARD_SUCCESS, function () {
    const state = {
      dashboard: {
        isLoading: true,
        isLoaded: false,
        data: {}
      },
      widgets: {
        loadingState: {},
        data: []
      }
    };

    const data = {
      name: 'Neki dashboard',
      public: false,
      widgets: [
        {
          id: 1
        }
      ]
    };

    mutations.DASHBOARD_SUCCESS(state, data);

    expect(state.dashboard.isLoading).to.equal(false);
    expect(state.dashboard.isLoaded).to.equal(true);
    expect(state.dashboard.data.name).to.equal('Neki dashboard');
  });

  it(mutationTypes.DASHBOARD_FAILURE, function () {
    const state = {
      dashboard: {
        isLoading: true,
        isLoaded: false
      },
      widgets: {
        loadingState: {},
        data: []
      }
    };

    mutations.DASHBOARD_FAILURE(state);

    expect(state.dashboard.isLoading).to.equal(false);
    expect(state.dashboard.isLoaded).to.equal(false);
  });
});

/* eslint-enable new-cap */
