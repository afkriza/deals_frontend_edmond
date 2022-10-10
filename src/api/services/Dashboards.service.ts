import httpClient from '@/api/http-client';
import serialize from '@/api/json-api/serializer';

const DASHBOARDS_ENDPOINT = 'dashboards';
const USER_DASHBOARD_DENSITY_ENDPOINT = 'user-dashboard-density';

type Dashboard = {
  id?: string;
  name: string;
  public: boolean;
  domain: string;
  tableDisplayDensity?: string;
};

export const fetchDashboards = (domain?: string) =>
  httpClient.get(DASHBOARDS_ENDPOINT, {
    params: domain ?? { filter: { domain } }
  });

export const fetchDashboard = (dashboardId: string) =>
  httpClient.get(`${DASHBOARDS_ENDPOINT}/${dashboardId}`, {
    params: {
      include: 'widgets'
    }
  });

export const createDashboard = (dashboard: Dashboard) => {
  const payload = serialize(dashboard, {
    attributes: ['name', 'public', 'domain']
  });

  return httpClient.post(DASHBOARDS_ENDPOINT, payload);
};

export const editDashboard = (dashboard: Dashboard, id: Dashboard['id']) => {
  const payload = serialize(dashboard, {
    attributes: ['name', 'public', 'default', 'tableDisplayDensity']
  });

  return httpClient.put(`${DASHBOARDS_ENDPOINT}/${id}`, payload);
};

export const deleteDashboard = (dashboardId: Dashboard['id']) => {
  return httpClient.delete(`${DASHBOARDS_ENDPOINT}/${dashboardId}`);
};

export const setUserDashboardDensity = (
  userId: string,
  dashboardId: string,
  displayDensity: string
) => {
  const payload = serialize(
    {
      userId,
      dashboardId,
      displayDensity
    },
    {
      attributes: ['userId', 'dashboardId', 'displayDensity']
    }
  );

  return httpClient.put(USER_DASHBOARD_DENSITY_ENDPOINT, payload);
};
