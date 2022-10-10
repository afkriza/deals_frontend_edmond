<template>
  <VPopover
    :open.sync="openSynced"
    :container="false"
    :popover-class="$style.popover"
    placement="bottom-start"
  >
    <div :class="[$style.trigger, { [$style.active]: openSynced }]">
      <span
        v-show="totalUnseenNotificationsCount && !openSynced"
        :class="$style.badge"
      >
        {{ totalUnseenNotificationsCount }}
      </span>
      <IconExclamation />
    </div>

    <template #popover>
      <div :class="$style.hub">
        <header :class="$style.header">
          <SegmentControl
            v-model="selectedVisibility"
            :options="visibilityOptions"
          />
          <InputSelect
            v-model="selectedPropertyOption"
            :options="propertyOptions"
            search-by="name"
            searchable
          />
        </header>
        <div ref="content" :class="$style.content">
          <template v-if="isLoading && !hasNotifications">
            <AppLoader
              :class="$style.loader"
              loading-text="Loading alerts..."
            />
          </template>
          <template v-else>
            <template v-if="hasNotifications">
              <NotificationMessageHub
                v-for="notification in currentTabNotifications"
                :key="notification.id"
                :class="$style.notification"
                :notification="notification"
                @click.native="onNotificationClick(notification)"
              />
              <IntersectionEmitter
                :key="selectedPropertyOption.id + selectedVisibility"
                :options="{ root: contentElement, rootMargin: '100px' }"
                @intersect="fetchNextPage"
              />
              <div v-show="!isCurrentTabLoaded" :class="$style.spinner">
                <BounceSpinner />
              </div>
            </template>
            <AppEmptyState
              v-else
              :class="$style.emptyState"
              :description="emptyStateDescription"
              :empty-state-icon="EmptyStateIllustration"
            />
          </template>
        </div>
        <footer :class="$style.footer">
          <span v-if="allNotificationsCount"
            >{{ allNotificationsCount }} alerts</span
          >
          <template v-if="unseenNotificationsCount">
            <span>•</span>
            <span>{{ unseenNotificationsCount }} unread</span>
            <ButtonGhost text="MARK ALL AS READ" @click="markAllAsRead" />
          </template>
        </footer>
      </div>
    </template>
  </VPopover>
</template>

<script lang="ts">
  import {
    Component,
    Emit,
    PropSync,
    Ref,
    Vue,
    Watch
  } from 'vue-property-decorator';
  import { VPopover } from 'v-tooltip';
  import { keyBy, size, sortBy } from 'lodash';
  import InputSelect from '@/components/inputs/new/InputSelect.vue';
  import NotificationMessage from '@/components/overview/notifications/NotificationMessage.vue';
  import AppEmptyState from '@/components/core/AppEmptyState.vue';
  import EmptyUnreadNotificationsIllustration from '@/assets/images/icons/emptystate-analytics.svg';
  import EmptyNotificationsIllustration from '@/assets/images/icons/emptystate-widget.svg';

  import IconExclamation from '@/assets/images/icons/exclamation.svg';
  import NotificationMessageHub from '@/components/overview/notifications/NotificationMessageHub.vue';
  import SegmentControl from '@/components/inputs/SegmentControl.vue';
  import IntersectionEmitter from '@/components/core/IntersectionEmitter.vue';

  import { notificationsModule, propertiesModule } from '@/store';
  import AppLoader from '@/components/app/AppLoader.vue';
  import ButtonFlat from '@/components/buttons/ButtonFlat.vue';
  import ButtonGhost from '@/components/buttons/ButtonGhost.vue';
  import BounceSpinner from '@/components/core/BounceSpinner.vue';

  const ALL_PROPERTIES_OPTION = {
    name: 'All properties',
    id: 'all'
  };

  const VISIBILITY_OPTIONS = [
    { id: 'all', label: 'All alerts' },
    { id: 'unseen', label: 'Unread' }
  ];

  @Component({
    components: {
      BounceSpinner,
      ButtonGhost,
      ButtonFlat,
      AppLoader,
      IntersectionEmitter,
      SegmentControl,
      NotificationMessageHub,
      AppEmptyState,
      NotificationMessage,
      InputSelect,
      VPopover,
      IconExclamation
    }
  })
  export default class NotificationsHub extends Vue {
    @PropSync('open', {
      type: Boolean
    })
    openSynced: boolean;

    @Ref('content')
    readonly contentElement: HTMLDivElement;

    isLoading = false;

    get selectedPropertyOption() {
      return this.propertyOptionsById[notificationsModule.selectedScope];
    }

    set selectedPropertyOption(option) {
      notificationsModule.SET_SELECTED_SCOPE(option.id);
    }

    get selectedVisibility() {
      return notificationsModule.selectedVisibility;
    }

    set selectedVisibility(option) {
      notificationsModule.SET_SELECTED_VISIBILITY(option);
    }

    get filter() {
      return {
        propertyOptionId: this.selectedPropertyOption.id,
        visibilityOption: this.selectedVisibility
      };
    }

    get properties() {
      return propertiesModule.properties;
    }

    get currentTabNotifications() {
      return notificationsModule.currentTabNotifications;
    }

    get currentTabNotificationsSize() {
      return size(this.currentTabNotifications);
    }

    get hasNotifications() {
      return Boolean(this.currentTabNotificationsSize);
    }

    get totalUnseenNotificationsCount() {
      return notificationsModule.totalUnseenNotificationsCount;
    }

    get allNotificationsCount() {
      return notificationsModule.allNotificationsCount;
    }

    get unseenNotificationsCount() {
      return notificationsModule.unseenNotificationsCount;
    }

    get EmptyStateIllustration() {
      return this.selectedVisibility === 'all'
        ? EmptyNotificationsIllustration
        : EmptyUnreadNotificationsIllustration;
    }

    get propertiesSorted() {
      return sortBy(this.properties, 'name');
    }

    get propertyOptions() {
      return [ALL_PROPERTIES_OPTION, ...this.propertiesSorted];
    }

    get propertyOptionsById() {
      return keyBy(this.propertyOptions, 'id');
    }

    get visibilityOptions() {
      return VISIBILITY_OPTIONS;
    }

    get emptyStateDescription() {
      if (this.selectedVisibility === 'all') {
        return 'No alerts';
      }

      return 'No unread alerts';
    }

    get isCurrentTabLoaded() {
      return notificationsModule.isCurrentTabLoaded;
    }

    @Watch('filter')
    onFilterChange() {
      if (this.hasNotifications) {
        return;
      }

      this.fetchNextPage();
    }

    async fetchNextPage() {
      this.isLoading = true;

      try {
        await notificationsModule.fetchNotifications();
      } finally {
        this.isLoading = false;
      }
    }

    @Emit('seen-all')
    markAllAsRead() {
      notificationsModule.markCurrentPageSeen();
    }

    @Emit('notification:click')
    onNotificationClick(notification) {
      notificationsModule.markNotificationSeen(notification);

      return notification;
    }

    async created() {
      await Promise.all([propertiesModule.loadProperties()]);
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .popover[x-placement^='bottom'] {
    margin-top: 10px;
  }

  .trigger {
    @include flex-center;
    position: relative;

    margin-left: 16px;

    border-radius: 100%;

    cursor: pointer;

    width: 32px;
    height: 32px;

    background-color: $color-bg-primary-mid;

    color: $color-text-light;

    border: 2px solid transparent;

    transition: background-color 0.2s;

    &:hover {
      border: 2px solid $color-border-main-dark;
    }

    &:active,
    &.active {
      color: $color-text-primary;
      background-color: $color-bg-light;
      border-color: transparent;
    }
  }

  .badge {
    position: absolute;
    top: -5px;
    left: 16px;

    color: $color-text-light;
    background-color: $color-bg-secondary;
    font-weight: bold;
    border-radius: 9px;
    font-size: 10px;
    line-height: 14px;

    padding: 1px 5px;
  }

  .hub {
    display: flex;
    flex-direction: column;
    min-height: 0;
    flex: 1;

    border-radius: 4px;

    background-color: $color-bg-light;

    height: calc(100vh - 68px);
    width: 392px;
  }

  .header {
    position: sticky;
    top: 0;

    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-column-gap: 16px;

    background-color: $color-bg-light;
    border-bottom: 1px solid $color-border-main-light;

    border-radius: 4px 4px 0 0;

    padding: 12px 16px;
  }

  .notification {
    padding: 10px 16px;

    border-radius: 6px;

    cursor: pointer;

    &:hover {
      background-color: $color-bg-primary-dimmed;
    }
  }

  .content {
    @include column;

    padding-top: 6px;

    overflow-y: auto;
  }

  .spinner {
    @include flex-center;

    padding: 12px 0;
  }

  .footer {
    @include row;
    align-items: center;

    position: sticky;
    bottom: 0;

    background-color: $color-bg-light;

    padding: 14px 16px;
    height: 50px;

    margin-top: auto;

    border-top: 1px solid $color-border-main-light;

    > span {
      color: $color-text-main-light;

      line-height: 20px;
    }

    > span + span {
      margin-left: 8px;
    }

    button {
      margin-left: auto;
    }
  }

  .loader {
    margin-top: 264px;
  }

  .empty-state {
    margin: 34px 10px;
  }
</style>
