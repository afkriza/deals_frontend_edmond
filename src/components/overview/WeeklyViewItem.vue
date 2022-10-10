<template>
  <div
    v-tooltip.bottom="{
      content: noDetails
        ? '<b>No data available</b><p>There is no additional data available to show for this day.</p>'
        : null,
      classes: [$style.tooltip]
    }"
    :class="[
      $style.item,
      { [$style.selected]: selected, [$style.noDetails]: noDetails }
    ]"
    @click="onClick"
  >
    <div :class="$style.left">
      <div :class="$style.wrapper">
        <b :class="{ [$style.tag]: isThisWeek }">W{{ week }}</b>
      </div>
      <span :class="$style.dateRange">{{ dateRange }}</span>
      <ExpandButton
        v-if="!noDetails"
        :class="$style.expandBtn"
        @click="onExpand"
      />
    </div>
    <div :class="$style.right">
      <ProgressRatio :progress="actual" :total="expected" />
      <ProgressBarNew :class="$style.bar" :actual="actual" :expected="expected">
        <AlertBadge
          v-if="hasNotifications"
          :class="$style.alertBadge"
          :read="areNotificationsSeen"
          :invert="isDataMissing"
        />
      </ProgressBarNew>
    </div>
  </div>
</template>

<script lang="ts">
  import { VTooltip } from 'v-tooltip';
  import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
  import { format, isThisWeek } from 'date-fns';

  import ProgressRatio from '@/components/overview/ProgressRatio.vue';
  import ExpandedViewProgressBar from '@/components/overview/ExpandedViewProgressBar.vue';
  import ProgressBarNew from '@/components/overview/ProgressBarNew.vue';
  import { Unless } from '@/decorators/unless.decorator';
  import ExpandButton from '@/components/overview/ExpandButton.vue';
  import AlertBadge from '@/components/overview/notifications/AlertBadge.vue';

  @Component({
    components: {
      AlertBadge,
      ExpandButton,
      ProgressBarNew,
      ExpandedViewProgressBar,
      ProgressRatio
    },
    directives: {
      tooltip: VTooltip
    }
  })
  export default class WeeklyViewItem extends Vue {
    @Prop({
      type: Number,
      required: true
    })
    readonly week: number;

    @Prop({
      type: Date,
      required: true
    })
    readonly startDate: Date;

    @Prop({
      type: Date,
      required: true
    })
    readonly endDate: Date;

    @Prop({
      type: Number
    })
    readonly actual: number;

    @Prop({
      type: Number
    })
    readonly expected: number;

    @Prop({
      type: Boolean
    })
    readonly selected: boolean;

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

    get dateRange() {
      return `${format(this.startDate, 'dd.MM')} - ${format(
        this.endDate,
        'dd.MM'
      )}`;
    }

    get isThisWeek() {
      return isThisWeek(this.startDate, { weekStartsOn: 1 });
    }

    get isDataMissing() {
      return (
        this.actual === null || this.expected === null || this.expected === 0
      );
    }

    @Emit('click')
    @Unless('noDetails')
    onClick() {
      return;
    }

    @Emit('expand')
    onExpand() {
      return;
    }

    mounted() {
      if (this.isThisWeek) {
        this.$el.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .item {
    @include row;
    align-items: center;
    justify-content: space-between;

    padding: 6px 8px;
    border-radius: 4px;

    cursor: pointer;

    border: 2px solid transparent;

    &.no-details {
      cursor: not-allowed;
    }

    &:hover {
      background-color: $color-bg-primary-dimmed;

      .expand-btn {
        visibility: visible;
      }
    }

    &.selected {
      border-color: $color-border-primary-mid;
      border-radius: 4px;
    }
  }

  .wrapper {
    display: flex;
    flex-basis: 51px;
    justify-content: flex-end;
    margin-right: 22px;
    flex-shrink: 0;
  }

  .tag {
    color: $color-text-primary;
    background-color: $color-bg-primary-light;
    border-radius: 100px;
  }

  .left {
    @include row;
    align-items: center;

    b {
      padding: 4px 10px;
    }
  }

  .date-range {
    flex-shrink: 0;
  }

  .right {
    @include row;
    align-items: center;

    & > * + * {
      margin-left: 40px;
    }
  }

  .bar {
    width: 200px;
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

  .expand-btn {
    visibility: hidden;
    margin-left: 22px;
  }

  .alert-badge {
    --alert-badge-size: 20px;
    position: absolute;

    top: calc(50% - var(--alert-badge-size) / 2);
    right: 10px;

    z-index: 1;
  }
</style>
