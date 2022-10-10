<template>
  <div :class="$style.card">
    <div :class="[$style.iconWrapper, { [$style.positive]: positive }]">
      <Component :is="icon" />
    </div>
    <div :class="$style.content">
      <slot name="header" />
      <p :class="[$style.text, { [$style.seen]: seen }]" v-html="message" />
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { includes, values } from 'lodash';

  import IconPace from '@/assets/images/icons/pace.svg';
  import IconBooking from '@/assets/images/icons/booking.svg';
  import IconRevenue from '@/assets/images/icons/revenue.svg';

  export const NotificationType = {
    Booking: 'BOOKING',
    Pace: 'PACE',
    Revenue: 'REVENUE'
  };

  @Component({
    components: { IconPace, IconBooking, IconRevenue }
  })
  export default class NotificationMessage extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly message;

    @Prop({
      type: Date
    })
    readonly timestamp;

    @Prop({
      type: String,
      required: true,
      validator(value: string): boolean {
        return includes(values(NotificationType), value);
      }
    })
    readonly type;

    @Prop({
      type: Boolean
    })
    readonly positive;

    @Prop({
      type: Boolean
    })
    readonly seen;

    get iconsByNotificationType() {
      return {
        [NotificationType.Booking]: IconBooking,
        [NotificationType.Pace]: IconPace,
        [NotificationType.Revenue]: IconRevenue
      };
    }

    get icon() {
      return this.iconsByNotificationType[this.type];
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .card {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;

    border-radius: 6px;
    background-color: $color-bg-light;
  }

  .icon-wrapper {
    @include flex-center;

    --size: 48px;
    --color: #{$color-text-warning};
    --color-bg: #{$color-bg-warning-light};

    align-self: start;

    width: var(--size);
    height: var(--size);

    border-radius: 100%;

    margin-right: 12px;

    color: var(--color);
    background-color: var(--color-bg);

    &.positive {
      --color: #{$color-text-success};
      --color-bg: #{$color-bg-success-dimmed};
    }
  }

  .text {
    margin: 0;
    line-height: 20px;
  }

  .seen {
    color: $color-text-main-light;
  }

  .content {
    @include column;
  }
</style>
