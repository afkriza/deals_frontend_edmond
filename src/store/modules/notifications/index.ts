import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import {
  NotificationsHub,
  Scope
} from '@/models/notifications/NotificationsHub';
import {
  fetchNotifications,
  markAllNotificationsAsSeen
} from '@/api/services/Notifications.service';

const NUMBER_OF_NOTIFICATIONS_PER_PAGE = 50;

@Module({
  name: 'notifications',
  namespaced: true
})
export default class NotificationsModule extends VuexModule {
  notificationsHub: NotificationsHub = NotificationsHub.create();

  get selectedScope() {
    return this.notificationsHub.scope;
  }

  get selectedVisibility() {
    return this.notificationsHub.visibility;
  }

  get currentTabNotifications() {
    return this.notificationsHub.currentTabNotifications;
  }

  get totalUnseenNotificationsCount() {
    return this.notificationsHub.totalUnseenNotificationsCount;
  }

  get allNotificationsCount() {
    return this.notificationsHub.currentPageAllNotificationsCount;
  }

  get unseenNotificationsCount() {
    return this.notificationsHub.currentPageUnseenNotificationsCount;
  }

  get isCurrentTabLoaded() {
    return this.notificationsHub.isCurrentTabLoaded;
  }

  get filter() {
    return {
      filter: {
        property: this.notificationsHub.scope
      },
      visibility: this.notificationsHub.visibility,
      page: this.notificationsHub.currentTabPageNumber,
      per_page: NUMBER_OF_NOTIFICATIONS_PER_PAGE,
      include: 'property'
    };
  }

  @Mutation
  SET_SELECTED_SCOPE(scope: Scope) {
    this.notificationsHub.scope = scope;
  }

  @Mutation
  SET_SELECTED_VISIBILITY(visibility) {
    this.notificationsHub.visibility = visibility;
  }

  @Mutation
  SET_TOTAL_UNSEEN_NOTIFICATIONS_COUNT(count) {
    this.notificationsHub.totalUnseenNotificationsCount = count;
  }

  @Mutation
  SET_PAGE_NOTIFICATIONS_COUNT({ scope, allCount, unseenCount }) {
    this.notificationsHub.setPageNotificationsCount(
      scope,
      allCount,
      unseenCount
    );
  }

  @Mutation
  SET_CURRENT_PAGE_NOTIFICATIONS_COUNT({ allCount, unseenCount }) {
    this.notificationsHub.setCurrentPageNotificationsCount(
      allCount,
      unseenCount
    );
  }

  @Mutation
  SET_CURRENT_TAB_LOADING(isLoading) {
    this.notificationsHub.setCurrentTabLoading(isLoading);
  }

  @Mutation
  MARK_NOTIFICATION_SEEN(notification) {
    this.notificationsHub.markNotificationSeen(notification);
  }

  @Mutation
  MARK_CURRENT_PAGE_SEEN() {
    this.notificationsHub.markCurrentPageSeen();
  }

  @Mutation
  LOAD_NOTIFICATIONS(notifications) {
    this.notificationsHub.loadNotifications(notifications);
  }

  @Action
  markNotificationSeen(notification: Notification) {
    this.context.commit('MARK_NOTIFICATION_SEEN', notification);
  }

  @Action({ rawError: true })
  markCurrentPageSeen() {
    this.context.commit('MARK_CURRENT_PAGE_SEEN');

    return markAllNotificationsAsSeen(this.notificationsHub.scope);
  }

  @Action({ rawError: true })
  async fetchNotifications() {
    if (
      this.notificationsHub.isCurrentTabLoaded ||
      this.notificationsHub.isCurrentTabLoading
    ) {
      return;
    }

    // Should remember the target scope in case it is changed before the request is resolved
    const targetScope = this.notificationsHub.scope;
    const targetVisibility = this.notificationsHub.visibility;

    this.context.commit('SET_CURRENT_TAB_LOADING', true);

    const { data: notifications, meta } = await fetchNotifications(this.filter);

    const currentScope = this.notificationsHub.scope;
    const currentVisibility = this.notificationsHub.visibility;

    this.context.commit('SET_SELECTED_SCOPE', targetScope);
    this.context.commit('SET_SELECTED_VISIBILITY', targetVisibility);

    this.context.commit('LOAD_NOTIFICATIONS', notifications);
    this.context.commit(
      'SET_TOTAL_UNSEEN_NOTIFICATIONS_COUNT',
      meta.totalUnseenNotificationsCount
    );
    this.context.commit('SET_CURRENT_PAGE_NOTIFICATIONS_COUNT', {
      allCount: meta.allNotificationsCount,
      unseenCount: meta.unseenNotificationsCount
    });
    this.context.commit('SET_CURRENT_TAB_LOADING', false);

    this.context.commit('SET_SELECTED_SCOPE', currentScope);
    this.context.commit('SET_SELECTED_VISIBILITY', currentVisibility);

    return notifications;
  }
}
