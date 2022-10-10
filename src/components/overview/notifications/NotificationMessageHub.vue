<template>
  <NotificationMessage
    :class="$style.notification"
    :message="notification.message"
    :type="notification.notificationType"
    :positive="notification.isPositive"
    :seen="notification.seen"
  >
    <template #header>
      <div :class="$style.header">
        <div :class="$style.period">
          <b :class="$style.bookingPeriod">{{ bookingPeriodFormatted }}</b>
          <span v-show="!notification.seen" :class="$style.alert"> </span>
        </div>
        <b :class="[{ [$style.seen]: notification.seen }]">{{
          notification.property.name
        }}</b>
      </div>
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
  import { format, parseISO } from 'date-fns';
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

    get bookingPeriod() {
      return parseISO(this.notification.bookingPeriod);
    }

    get bookingPeriodFormatted() {
      const bookingPeriod = this.notification.bookingPeriod;

      if (/w/i.test(bookingPeriod)) {
        return format(this.bookingPeriod, "'W'w yyyy");
      } else if (/^\d{4}-\d{1,2}$/.test(bookingPeriod)) {
        return format(this.bookingPeriod, 'MMMM yyyy');
      } else {
        return format(this.bookingPeriod, 'd.M.yyyy');
      }
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .seen {
    color: $color-text-main-light;
  }

  .header {
    @include column;

    margin-bottom: 6px;

    > * + * {
      margin-top: 4px;
    }
  }

  .period {
    @include row;

    align-items: center;
    justify-content: space-between;
  }

  .booking-period {
    font-size: 12px;

    color: $color-text-main-light;
    text-transform: uppercase;
  }

  .alert::before {
    --size: 8px;

    display: block;
    content: '';
    width: var(--size);
    height: var(--size);
    margin-right: 6px;
    border-radius: 100%;
    background-color: $color-bg-primary;
  }
</style>
