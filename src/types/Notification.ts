import { Property } from '@/types/Property';

type NotificationType = 'BOOKING' | 'PACE' | 'REVENUE';

export type NotificationId = string;

export type Notification = {
  id: NotificationId;
  type: string;
  notificationId: number;
  bookingPeriod: string;
  stateDate: string;
  message: string;
  notificationType: NotificationType;
  isPositive: boolean;
  seen: boolean;
  property: Property;
};
