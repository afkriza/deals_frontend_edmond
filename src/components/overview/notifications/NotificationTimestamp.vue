<template>
  <span
    v-tooltip.bottom="{ content: timestampFormattedFixed }"
    :class="[$style.timestamp, { [$style.active]: active }]"
  >
    {{ timestampFormattedRelative }}
  </span>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { VTooltip } from 'v-tooltip';
  import { capitalize } from 'lodash';
  import { format, formatDistance } from 'date-fns';

  @Component({
    directives: {
      tooltip: VTooltip
    }
  })
  export default class NotificationTimestamp extends Vue {
    @Prop({
      type: Date
    })
    readonly timestamp;

    @Prop({
      type: Boolean
    })
    readonly active: boolean;

    get timestampFormattedRelative() {
      return capitalize(`${formatDistance(this.timestamp, Date.now())} ago`);
    }

    get timestampFormattedFixed() {
      return format(this.timestamp, 'dd.MM.yyyy hh:mm');
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .timestamp {
    @include row;
    align-items: center;

    width: fit-content;

    line-height: 16px;
    font-size: 12px;

    color: $color-text-main-light;

    &.active {
      font-weight: bold;
      color: $color-text-primary;

      &::before {
        content: '';
        width: 6px;
        height: 6px;
        margin-right: 6px;
        border-radius: 100%;
        background-color: $color-bg-primary;
      }
    }
  }
</style>
