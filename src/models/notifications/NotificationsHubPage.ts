import { Visibility } from '@/enums/Visibility';
import { uniq } from 'lodash';
import { NotificationsHubPageTab } from '@/models/notifications/NotificationsHubPageTab';

export class NotificationsHubPage {
  [Visibility.All]: NotificationsHubPageTab;
  [Visibility.Unseen]: NotificationsHubPageTab;

  private constructor() {
    this[Visibility.All] = NotificationsHubPageTab.create();
    this[Visibility.Unseen] = NotificationsHubPageTab.create();
  }

  get allTab() {
    return this.getTab(Visibility.All);
  }

  get unseenTab() {
    return this.getTab(Visibility.Unseen);
  }

  get notificationIds() {
    return uniq([
      ...this.allTab.notificationIds,
      ...this.unseenTab.notificationIds
    ]);
  }

  getTab(visibility: Visibility) {
    return this[visibility];
  }

  markSeen() {
    this.unseenTab.markAsSeen();
  }

  static create() {
    return new NotificationsHubPage();
  }
}
