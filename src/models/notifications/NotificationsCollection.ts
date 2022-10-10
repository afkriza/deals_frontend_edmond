import { forEach, keyBy, map } from 'lodash';
import { Notification, NotificationId } from '@/types/Notification';

export class NotificationsCollection {
  notificationsById: { [key in NotificationId]: Notification };
  notificationIds: string[];

  private constructor() {
    this.notificationsById = {};
    this.notificationIds = [];
  }

  get notifications() {
    return map(this.notificationIds, id => this.getById(id));
  }

  getById(notificationId: NotificationId) {
    return this.notificationsById[notificationId];
  }

  hasNotification(notificationId: NotificationId) {
    return Boolean(this.getById(notificationId));
  }

  isNotificationSeen(notificationId: NotificationId) {
    return this.getById(notificationId)?.seen;
  }

  load(notifications: Notification[]) {
    const notificationIds = map(notifications, 'id');
    const notificationsById = keyBy(notifications, 'id');

    this.notificationIds = [...this.notificationIds, ...notificationIds];
    this.notificationsById = {
      ...this.notificationsById,
      ...notificationsById
    };
  }

  markSeen(...notificationIds: NotificationId[]) {
    forEach(notificationIds, id => (this.getById(id).seen = true));
  }

  markAllSeen() {
    forEach(this.notifications, notification => (notification.seen = true));
  }

  static create() {
    return new NotificationsCollection();
  }
}
