<template>
  <div
    :class="[$style.bar, isOverflow ? $style.overflow : null, $style[theme]]"
    :style="{
      '--progressWidth': `${progressWidth}%`
    }"
  >
    <div :class="[$style.row, isEnlarged ? $style.enlarged : null]">
      <span v-if="!isMissing" :class="[$style.percentage, $style[theme]]">
        {{ percentage }}
      </span>
      <CardIcon v-if="icon" :class="$style.icon" :theme="theme" :type="icon" />
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import CardIcon from '@/components/overview/CardIcon.vue';
  import { CARD_ACTIONS, CARD_STATUSES, MISSING } from '@/constants/overview';

  @Component({
    name: 'CalendarCardProgressBar',
    components: {
      CardIcon
    }
  })
  export default class CalendarCardProgressBar extends Vue {
    @Prop({
      type: Number,
      default: 0
    })
    readonly percentage: number;

    @Prop({
      type: String,
      required: true,
      validator(theme) {
        return CARD_STATUSES.includes(theme);
      }
    })
    readonly theme: string;

    @Prop({
      type: Boolean
    })
    readonly isEnlarged: boolean;

    @Prop({
      type: String,
      validator(value: string): boolean {
        return CARD_ACTIONS.includes(value);
      }
    })
    readonly icon: string;

    get isMissing() {
      return this.theme === MISSING;
    }

    get progressWidth() {
      if (this.isMissing) {
        return 0;
      }

      return Math.min(this.percentage, 100);
    }

    get isOverflow() {
      if (this.isMissing) {
        return false;
      }

      return this.percentage >= 100;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .bar {
    position: relative;
    min-height: 4px;
    border-radius: 4px 4px 0 0;

    &.missing {
      background-color: $color-bg-main-light;

      &::before {
        background-color: $color-bg-main-light;
      }
    }

    &.bad {
      background-color: $color-bad-darker;
    }

    &.mid {
      background-color: $color-mid-darker;
    }

    &.good {
      background-color: $color-good-darker;
    }

    &.bad::before {
      background-color: $color-bad-regular;
    }

    &.mid::before {
      background-color: $color-mid-regular;
    }

    &.good::before {
      background-color: $color-good-regular;
    }

    &::before {
      position: absolute;
      display: block;
      content: '';
      left: 0;
      top: 0;
      bottom: 0;
      width: var(--progressWidth);
    }

    &.overflow {
      background-color: rgba(0, 0, 0, 0);

      &::before {
        border-radius: 3px 3px 0 0;
      }

      &::after {
        position: absolute;
        display: block;
        width: 8%; // 100% - 92%
        height: 100%;
        content: '';
        right: 0;
        background: linear-gradient(
          270deg,
          $progress-bar-shadow 0%,
          $color-good-regular 100%
        );
        border-radius: 0px 3px 0px 0px;
        width: 25px;
      }
    }

    .percentage {
      height: 32px;
      font-weight: bold;
      font-size: 24px;
      line-height: 32px;
      color: $color-text-light;
      z-index: 1;

      &.bad,
      &.good {
        color: $color-text-light;
      }

      &.mid {
        color: $color-text-main;
      }

      &::after {
        position: relative;
        right: 5px;
        content: '%';
        font-size: 14px;
      }
    }

    .row {
      @include row;
      align-items: center;
      justify-content: space-between;
      position: absolute;
      top: 8px;
      left: 10px;
      right: 10px;

      &.enlarged {
        top: 16px;
        left: 24px;
      }
    }
  }

  .icon {
    z-index: 1;
  }
</style>
