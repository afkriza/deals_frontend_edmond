import httpClient from '@/api/http-client';
import serialize from '@/api/json-api/serializer';
import { saveAs } from '@/utils/file.js';

import { joinUrlSegments } from '@/api/utils';
import { keys } from 'lodash';

const WIDGETS_ENDPOINT = 'widgets';
const WIDGET_CALCULATIONS_ENDPOINT = joinUrlSegments(
  WIDGETS_ENDPOINT,
  'calculations'
);
const WIDGET_DUPLICATE_ENDPOINT = joinUrlSegments(
  WIDGETS_ENDPOINT,
  'duplicates'
);
const WIDGET_EXPORT_ENDPOINT = joinUrlSegments(WIDGETS_ENDPOINT, 'exports');

// TODO: write Widget types
type Widget = any;

type WidgetCalculationsFilter = {
  filter: {
    startDate?: string;
    endDate?: string;
    snapshotStartDate: string;
    snapshotEndDate: string;
    property?: string[];
    user?: string[];
    unitType?: string[];
    channel?: string[];
    subchannel?: string[];
    bookingStatus?: string[];
    agency?: string[];
  };
};

type WidgetExportFilter = WidgetCalculationsFilter & { format: 'xlsx ' };

export const fetchWidget = (widgetId: string) =>
  httpClient.get(joinUrlSegments(WIDGETS_ENDPOINT, widgetId));

export const createWidget = (widget: Widget) => {
  const payload = serialize(widget, {
    attributes: [
      'configuration',
      'category',
      'name',
      'dashboardId',
      'representation',
      'width',
      'height'
    ]
  });

  return httpClient.post(WIDGETS_ENDPOINT, payload);
};

export const editWidget = (widget: Widget, widgetId: string) => {
  const payload = serialize(widget, {
    attributes: [
      'configuration',
      'category',
      'name',
      'dashboardId',
      'width',
      'height',
      'positionX',
      'positionY',
      'representation'
    ]
  });

  return httpClient.put(joinUrlSegments(WIDGETS_ENDPOINT, widgetId), payload);
};

export const deleteWidget = (widgetId: string) =>
  httpClient.delete(joinUrlSegments(WIDGETS_ENDPOINT, widgetId));

export const fetchWidgetCalculations = (
  widgetId: string,
  filters: WidgetCalculationsFilter
) =>
  httpClient.get(joinUrlSegments(WIDGET_CALCULATIONS_ENDPOINT, widgetId), {
    params: filters
  });

export const duplicateWidget = (widgetId: string) =>
  httpClient.post(joinUrlSegments(WIDGET_DUPLICATE_ENDPOINT, widgetId));

export const exportWidget = async (
  widgetId: string,
  filters: WidgetExportFilter,
  signal: AbortSignal
) => {
  const {
    data,
    headers: { 'content-disposition': filename }
  } = await httpClient.get(joinUrlSegments(WIDGET_EXPORT_ENDPOINT, widgetId), {
    params: filters,
    responseType: 'blob',
    signal,
    transformResponse: data => data, // Disable default JSON:API deserialization,
    unpackData: false // Disable default data unpacking
  });

  return saveAs(filename, data);
};

export const convertWidget = (widgetId: string, representation: string) => {
  const payload = { representation };

  return httpClient.post(
    joinUrlSegments(WIDGETS_ENDPOINT, widgetId, 'converts'),
    serialize(payload, {
      attributes: keys(payload)
    })
  );
};
