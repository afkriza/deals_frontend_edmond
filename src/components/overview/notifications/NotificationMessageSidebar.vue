<template>
  <NotificationMessage
    :message="notification.message"
    :type="notification.notificationType"
    :positive="notification.isPositive"
    :seen="notification.seen"
  >
    <template #footer>
      <NotificationTimestamp v-if="timestamp" :timestamp="timestamp" />
    </template>
  </NotificationMessage>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  import { hasProperties } from '@/utils/validation';

  import IconPace from '@/assets/images/icons/pace.svg';
  import IconBooking from '@/assets/images/icons/booking.svg';
  import IconRevenue from '@/assets/images/icons/revenue.svg';
  import NotificationMessage from '@/components/overview/notifications/NotificationMessage.vue';
  import { parseISO } from 'date-fns';
  import NotificationTimestamp from '@/components/overview/notifications/NotificationTimestamp.vue';

  @Component({
    components: {
      NotificationTimestamp,
      NotificationMessage,
      IconPace,
      IconBooking,
      IconRevenue
    }
  })
  export default class NotificationMessageHub extends Vue {
    @Prop({
      type: Object,
      required: true,
      validator(value): boolean {
        return hasProperties(
          value,
          'message',
          'stateDate',
          'notificationType',
          'isPositive'
        );
      }
    })
    readonly notification;

    get timestamp() {
      if (!this.notification.stateDate) {
        return null;
      }

      return parseISO(this.notification.stateDate);
    }
  }
</script>
