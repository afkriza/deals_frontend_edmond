import httpClient from '@/api/http-client';

const WIDGET_WIZARD_ENDPOINT = 'wizard';

export const fetchCategories = (domain: string) =>
  httpClient.get(`${WIDGET_WIZARD_ENDPOINT}/categories`, {
    params: {
      filter: {
        domain
      }
    }
  });

export const fetchMetrics = (domain: string) =>
  httpClient.get(`${WIDGET_WIZARD_ENDPOINT}/metrics`, {
    params: {
      filter: {
        domain
      },
      include: 'contexts'
    }
  });

export const fetchWidgetName = (dashboardId: string) =>
  httpClient.get(`${WIDGET_WIZARD_ENDPOINT}/widget-name/${dashboardId}`);

export const fetchRecentlyUsedVariables = (domain: string) =>
  httpClient.get(`${WIDGET_WIZARD_ENDPOINT}/recent-variables`, {
    params: {
      filter: {
        domain
      }
    }
  });
