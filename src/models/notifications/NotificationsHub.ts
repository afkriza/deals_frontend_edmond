import { forEach, get, map, size, values } from 'lodash';
import { Notification, NotificationId } from '@/types/Notification';
import { Visibility } from '@/enums/Visibility';
import { NotificationsCollection } from '@/models/notifications/NotificationsCollection';
import { NotificationsHubPage } from '@/models/notifications/NotificationsHubPage';
import { PropertyId } from '@/types/Property';

export type Scope = PropertyId | 'all';

export class NotificationsHub {
  visibility: Visibility;
  scope: Scope;

  private notificationsHubPageMap: { [scope in Scope]: NotificationsHubPage } =
    {};
  private notificationsCollection: NotificationsCollection;

  private constructor() {
    this.scope = 'all';
    this.visibility = Visibility.All;

    this.notificationsHubPageMap[this.scope] = NotificationsHubPage.create();
    this.notificationsCollection = NotificationsCollection.create();
  }

  get totalUnseenNotificationsCount() {
    return this.notificationsHubPageMap.all.unseenTab.count;
  }

  set totalUnseenNotificationsCount(count: number) {
    this.notificationsHubPageMap.all.unseenTab.count = count;
  }

  get currentPageAllNotificationsCount() {
    return this.currentPage.allTab.count;
  }

  get currentPageUnseenNotificationsCount() {
    return this.currentPage.unseenTab.count;
  }

  get currentPage() {
    return this.getPage(this.scope);
  }

  private getPage(scope: Scope) {
    return get(
      this.notificationsHubPageMap,
      scope,
      NotificationsHubPage.create()
    );
  }

  get allPage() {
    return this.getPage('all');
  }

  get pages() {
    return values(this.notificationsHubPageMap);
  }

  get currentTab() {
    return this.currentPage.getTab(this.visibility);
  }

  get isCurrentTabLoaded() {
    return this.currentTab.loaded;
  }

  get isCurrentTabLoading() {
    return this.currentTab.loading;
  }

  get currentTabPageNumber() {
    return this.currentTab.pageNumber;
  }

  get currentTabNotificationIds() {
    return this.currentTab.notificationIds;
  }

  get currentTabNotifications() {
    return map(this.currentTabNotificationIds, id =>
      this.notificationsCollection.getById(id)
    );
  }

  setCurrentTabLoading(isLoading: boolean) {
    this.currentTab.loading = isLoading;
  }

  loadNotifications(notifications: Notification[]) {
    this.addPageIfNotExists(this.scope);

    this.loadNotificationsToCurrentTab(notifications);
  }

  private addPageIfNotExists(scope: Scope) {
    if (this.pageExists(scope)) {
      return;
    }

    this.addPage(scope);
  }

  private pageExists(scope: Scope) {
    return Boolean(this.notificationsHubPageMap[scope]);
  }

  private addPage(scope: Scope) {
    this.notificationsHubPageMap = {
      ...this.notificationsHubPageMap,
      [scope]: NotificationsHubPage.create()
    };
  }

  loadNotificationsToCurrentTab(notifications: Notification[]) {
    if (!size(notifications)) {
      this.markCurrentTabAsLoaded();
    } else {
      this.loadNotificationsToCollection(notifications);
      this.addNotificationsToCurrentTab(notifications);
      this.incrementPageNumberForCurrentTab();
    }
  }

  private markCurrentTabAsLoaded() {
    this.currentTab.loaded = true;
  }

  private loadNotificationsToCollection(notifications: Notification[]) {
    this.notificationsCollection.load(notifications);
  }

  private addNotificationsToCurrentTab(notifications: Notification[]) {
    this.currentTab.addNotifications(notifications);
  }

  private incrementPageNumberForCurrentTab() {
    this.currentTab.pageNumber++;
  }

  setPageNotificationsCount(
    scope: Scope,
    allCount: number,
    unseenCount: number
  ) {
    const page = this.getPage(scope);

    page.allTab.count = allCount;
    page.unseenTab.count = unseenCount;
  }

  setCurrentPageNotificationsCount(allCount: number, unseenCount: number) {
    this.setPageNotificationsCount(this.scope, allCount, unseenCount);
  }

  markNotificationSeen(notification: Notification) {
    const notificationId = notification.id;
    if (!this.notificationsCollection.hasNotification(notificationId)) {
      return;
    }

    if (!this.notificationsCollection.isNotificationSeen(notificationId)) {
      if (this.scope !== 'all') {
        this.currentPage.unseenTab.count--;
      }
      this.allPage.unseenTab.count--;
    }

    this.notificationsCollection.markSeen(notificationId);

    this.removeNotificationFromPagesUnseenTab(
      notification.property.id,
      notificationId
    );
    this.removeNotificationFromPagesUnseenTab('all', notificationId);
  }

  private removeNotificationFromPagesUnseenTab(
    scope: Scope,
    notificationId: NotificationId
  ) {
    this.getPage(scope).unseenTab.remove(notificationId);
  }

  markCurrentPageSeen() {
    if (this.scope === 'all') {
      this.notificationsCollection.markAllSeen();
      this.markAllPagesSeen();
    } else {
      this.notificationsCollection.markSeen(
        ...this.currentPage.notificationIds
      );
      this.allPage.unseenTab.count =
        this.allPage.unseenTab.count - this.currentPage.unseenTab.count;

      this.allPage.unseenTab.remove(...this.currentPage.notificationIds);

      this.currentPage.markSeen();
    }
  }

  private markAllPagesSeen() {
    forEach(this.pages, page => page.markSeen());
  }

  static create() {
    return new NotificationsHub();
  }
}
