import httpClient from '@/api/http-client';
import serialize from '@/api/json-api/serializer';

const NOTIFICATIONS_ENDPOINT = 'notifications';

type NotificationsFilter = any;

export const fetchNotifications = (
  filters: NotificationsFilter
): Promise<any> => httpClient.get(NOTIFICATIONS_ENDPOINT, { params: filters });

export const markAllNotificationsAsSeen = (propertyId: string) =>
  httpClient.post(
    NOTIFICATIONS_ENDPOINT,
    propertyId &&
      serialize(
        {
          propertyId: parseInt(propertyId)
        },
        {
          resourceType: 'notifications',
          attributes: ['propertyId']
        }
      )
  );
