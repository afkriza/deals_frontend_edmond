<template>
  <div
    v-tooltip.bottom-end="{
      content: noDetails
        ? '<b>No data available</b><p>There is no additional data available to show for this day.</p>'
        : null,
      classes: [$style.tooltip]
    }"
    :class="[$style.wrapper, isSelected ? $style.selected : null]"
    @click="onClick"
  >
    <div :class="[$style.card, noDetails ? $style.noDetails : null]">
      <div :class="[$style.main, isEnlarged ? $style.enlarged : null]">
        <ProgressBar
          :class="[$style.progressBar, isEnlarged ? $style.enlarged : null]"
          :percentage="percentage"
          :theme="theme"
          :icon="icon"
          :is-enlarged="isEnlarged"
        >
          <AlertBadge
            v-if="hasNotifications"
            :class="[$style.alertBadge, { [$style.enlarged]: isEnlarged }]"
            :read="areNotificationsSeen"
            :invert="isDataMissing"
          />
        </ProgressBar>
      </div>
      <div :class="[$style.footer, isEnlarged ? $style.enlarged : null]">
        <ProgressRatio :progress="actual" :total="total" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { VTooltip } from 'v-tooltip';
  import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
  import ProgressPercent from '@/components/overview/ProgressPercent.vue';
  import ProgressRatio from '@/components/overview/ProgressRatio.vue';
  import ProgressBar from '@/components/overview/CalendarCardProgressBar.vue';
  import { BAD, CARD_ACTIONS, GOOD, MID, MISSING } from '@/constants/overview';
  import { Unless } from '@/decorators/unless.decorator';
  import AlertBadge from '@/components/overview/notifications/AlertBadge.vue';

  @Component({
    name: 'CalendarCardNew',
    components: {
      AlertBadge,
      ProgressRatio,
      ProgressBar,
      ProgressPercent
    },
    directives: {
      tooltip: VTooltip
    }
  })
  export default class CalendarCardNew extends Vue {
    @Prop({
      type: String,
      validator(value: string): boolean {
        return CARD_ACTIONS.includes(value);
      }
    })
    readonly icon: string;

    @Prop({
      type: Number,
      default: null
    })
    readonly actual: number | null;

    @Prop({
      type: Number,
      default: null
    })
    readonly total: number | null;

    @Prop({
      type: Boolean
    })
    readonly isSelected: boolean;

    @Prop({
      type: Boolean
    })
    readonly isEnlarged: boolean;

    @Prop({
      type: Boolean
    })
    readonly noDetails: boolean;

    @Prop({
      type: Boolean
    })
    readonly hasNotifications: boolean;

    @Prop({
      type: Boolean
    })
    readonly areNotificationsSeen: boolean;

    get percentage() {
      if (this.isDataMissing) {
        return null;
      }

      return Math.round((this.actual / this.total) * 100);
    }

    get isDataMissing() {
      return this.actual === null || this.total === null || this.total === 0;
    }

    get theme() {
      if (this.isDataMissing) {
        return MISSING;
      }

      if (this.percentage < 33) {
        return BAD;
      } else if (this.percentage > 66) {
        return GOOD;
      }

      return MID;
    }

    @Emit('click')
    @Unless('noDetails')
    onClick() {
      return;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .wrapper {
    position: relative;

    padding: 4px;
    border: 2px solid transparent;

    &.selected {
      border: 2px solid $color-border-primary-mid;
      border-radius: 7px;
    }
  }

  .card {
    @include column;
    height: 100%;

    background-color: $color-bg-light;
    border: 1px solid $color-border-main-light;
    border-radius: 4px;
    transition: box-shadow 0.3s ease-in-out;

    &.no-details {
      cursor: not-allowed;
    }

    &:not(.no-details):hover {
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
  }

  .main {
    @include column;
    justify-content: center;
    height: 52px;
    border-radius: 3px 3px 0 0;

    &.enlarged {
      height: 64px;
    }
    &.bad {
      background-color: $color-bad-regular;
    }

    &.mid {
      background-color: $color-mid-regular;
    }

    &.good {
      background-color: $color-good-regular;
    }
  }

  .progress-bar {
    height: 100%;
  }

  .footer {
    @include row;
    align-items: center;
    padding: 6px 12px;
    flex-basis: 35%;

    &.enlarged {
      padding: 10px 24px;
    }
  }

  .tooltip {
    &[x-placement^='bottom'] {
      margin: 8px;
    }

    :global(.tooltip-inner) {
      padding: 12px 16px;
      width: 220px;

      p {
        color: $color-text-main-light;

        margin: 8px 0 0 0;
      }
    }
  }

  .alert-badge {
    --alert-badge-size: 20px;
    position: absolute;

    top: calc(50% - var(--alert-badge-size) / 2);
    right: 16px;

    z-index: 1;

    &.enlarged {
      right: 22px;
    }
  }
</style>
