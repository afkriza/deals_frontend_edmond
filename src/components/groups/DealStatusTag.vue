<template>
  <div
    :class="[
      $style.dealStatus,
      $style[dealStatus],
      { [$style.filled]: filled }
    ]"
  >
    <component :is="status.icon" />
    <span :class="$style.statusLabel">{{ status.label }}</span>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  import DealOpenIcon from '@/assets/images/icons/Deals/deal-status/deal-open.svg';
  import DealFixedIcon from '@/assets/images/icons/Deals/deal-status/deal-fixed.svg';
  import DealCancelledIcon from '@/assets/images/icons/Deals/deal-status/deal-cancelled.svg';
  import { dealsStatusEnum, ALL_DEAL_STATUSES } from '@/enums/deal-statuses.js';

  @Component({
    name: 'DealStatusTag',
    components: {
      DealOpenIcon,
      DealFixedIcon,
      DealCancelledIcon
    }
  })
  export default class DealStatusTag extends Vue {
    @Prop({
      type: String,
      required: true,
      validator(value) {
        return ALL_DEAL_STATUSES.includes(value);
      }
    })
    readonly dealStatus: string;

    @Prop({
      type: Boolean
    })
    readonly filled: boolean;

    get status() {
      return dealsStatusEnum[this.dealStatus];
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .deal-status {
    display: flex;
    align-items: center;

    &.filled {
      border-radius: 4px;
      padding: 6px 10px 6px 6px;

      &.open {
        background-color: $color-status-blue;
      }

      &.fixed,
      &.canceled {
        color: $color-text-light;

        path {
          fill: currentColor;
        }
      }

      &.fixed {
        background-color: $color-bg-success;
      }

      &.canceled {
        background-color: $color-bg-warning;
      }
    }
  }

  .status-label {
    margin-left: 4px;
    font-weight: bold;
  }
</style>
