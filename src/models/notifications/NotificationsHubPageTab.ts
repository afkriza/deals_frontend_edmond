import { difference, map, without } from 'lodash';
import { Notification, NotificationId } from '@/types/Notification';

export class NotificationsHubPageTab {
  loaded: boolean;
  loading: boolean;
  pageNumber: number;
  notificationIds: string[];
  count: number;

  private constructor() {
    this.loaded = false;
    this.loading = false;
    this.pageNumber = 1;
    this.notificationIds = [];
    this.count = null;
  }

  addNotifications(notifications: Notification[]) {
    this.notificationIds = [
      ...this.notificationIds,
      ...map(notifications, 'id')
    ];
  }

  remove(...notificationIds: NotificationId[]) {
    this.notificationIds = difference(this.notificationIds, notificationIds);
  }

  removeAll() {
    this.notificationIds = [];
  }

  markAsSeen() {
    this.notificationIds = [];
    this.loaded = true;
    this.pageNumber = 1;
    this.count = 0;
  }

  static create() {
    return new NotificationsHubPageTab();
  }
}
