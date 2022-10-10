import { expect } from 'chai';

import getters from 'store/modules/dashboard/getters';

it('returns dashboards', function () {
  const dashboard = {
    name: 'Novi dashboard',
    public: false
  };

  const state = {
    dashboards: {
      data: [dashboard]
    }
  };

  expect(getters.dashboards(state)[0]).to.equal(dashboard);
});

it('returns if dashboards are loaded', () => {
  const state = {
    dashboards: {
      isLoaded: true
    }
  };

  const isDashboardsLoaded = getters.isDashboardsLoaded(state);
  expect(isDashboardsLoaded).to.equal(true);
});

it('returns if dashboards are saving', () => {
  const state = {
    forms: {
      dashboard: {
        isLoading: true
      }
    }
  };

  const isSavingDashboard = getters.isSavingDashboard(state);
  expect(isSavingDashboard).to.equal(true);
});
