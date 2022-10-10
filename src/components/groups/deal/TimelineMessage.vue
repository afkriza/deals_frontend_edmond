<template>
  <div :class="$style.message">
    <div :class="$style.header">
      <UserAvatar
        :class="$style.userAvatar"
        :initials="messageCreatorInitials"
        :is-current-user="isCurrentUser"
      />
      <div :class="$style.heading">
        <slot name="heading" />
      </div>
      <template v-if="timestamp">
        <span
          v-tooltip.bottom="{ content: timestampFormattedFixed }"
          :class="$style.timestamp"
          >{{ timestampFormattedRelative }}</span
        >
      </template>
    </div>
    <div v-if="$slots.default" :class="$style.card">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { capitalize } from 'lodash';
  import { VTooltip } from 'v-tooltip';
  import { format, formatDistance } from 'date-fns';

  import { abbreviation } from '@/utils/string';

  import UserAvatar from '@/components/groups/deal/UserAvatar.vue';

  const MILLISECONDS_PER_SECOND = 1000;

  @Component({
    components: { UserAvatar },
    directives: {
      tooltip: VTooltip
    }
  })
  export default class TimelineMessage extends Vue {
    @Prop({
      type: Object,
      required: true
    })
    readonly currentUser;

    @Prop({
      type: Object,
      required: true
    })
    readonly messageCreator;

    @Prop({
      type: Date,
      default: null
    })
    readonly timestamp: Date;

    now = Date.now();
    interval = null;

    get isCurrentUser() {
      return this.currentUser.id === this.messageCreator.id;
    }

    get messageCreatorInitials() {
      return abbreviation(this.messageCreator.name);
    }

    get timestampFormattedRelative() {
      return capitalize(`${formatDistance(this.timestamp, this.now)} ago`);
    }

    get timestampFormattedFixed() {
      return format(this.timestamp, 'dd.MM.yyyy HH:mm');
    }

    created() {
      this.interval = setInterval(() => {
        this.now = Date.now();
      }, 60 * MILLISECONDS_PER_SECOND);
    }

    beforeDestroy() {
      clearInterval(this.interval);
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .header {
    @include row;

    align-items: center;
    justify-content: space-between;
  }

  .card {
    margin-left: 48px;

    border-radius: 6px;
    border: 1px solid $color-border-main-light;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
    background-color: $color-bg-light;
  }

  .heading {
    @include row;
    align-items: center;
    flex: 1;

    margin-left: 16px;

    color: $color-text-main-light;
  }

  .timestamp {
    margin-top: 6px;
    margin-left: 8px;

    color: $color-text-main-light;
  }

  .user-avatar,
  .timestamp {
    align-self: flex-start;
  }
</style>
