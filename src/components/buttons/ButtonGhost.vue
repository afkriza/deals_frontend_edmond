<template>
  <Button
    v-tooltip="{
      content: tooltipText,
      placement: tooltipPosition,
      classes: [$style.tooltip]
    }"
    :class="{ [$style.oval]: oval, [$style.dark]: dark }"
    :button-style-override="$style"
    :theme="theme"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <div :class="$style.wrapper">
      <span v-if="$slots.icon" :class="$style.icon"><slot name="icon" /></span>
      <span v-if="text">{{ text }}</span>
    </div>
  </Button>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { VTooltip } from 'v-tooltip';
  import buttonMixin from '@/mixins/button';
  import { PRIMARY, SECONDARY } from '@/constants/button';

  @Component({
    mixins: [buttonMixin],
    directives: { tooltip: VTooltip }
  })
  export default class ButtonGhost extends Vue {
    @Prop({
      type: String,
      default: ''
    })
    readonly text: string;

    @Prop({
      type: String,
      default: null
    })
    readonly tooltipText: string;

    @Prop({
      type: String,
      default: 'bottom'
    })
    readonly tooltipPosition: string;

    @Prop({
      type: Boolean
    })
    readonly oval: boolean;

    @Prop({
      type: Boolean
    })
    readonly active: boolean;

    @Prop({
      type: Boolean
    })
    readonly destructive: boolean;

    @Prop({
      type: Boolean
    })
    readonly dark: boolean;

    get theme() {
      return !this.destructive ? PRIMARY : SECONDARY;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .tooltip {
    z-index: 99999;
  }

  %button {
    @include flex-center;
    text-transform: none;
    border: solid 1px transparent;
    background-color: transparent;
    padding: 7px;
    border-radius: 4px;

    transition: background-color 70ms ease-out;

    &:disabled {
      color: $color-text-main-lighter;

      .spinner {
        border: 3px solid $color-border-main;
      }
    }
  }
  .dark {
    &.primary {
      color: $color-text-light;

      &:hover {
        color: $color-text-primary-light;
        background-color: $color-bg-primary-dark-hover;
        border: 1px solid transparent;
      }

      &:active {
        background-color: $color-bg-primary;
        border: 1px solid transparent;
      }
    }
  }

  .oval {
    border-radius: 50%;
  }

  .primary {
    @extend %button;

    color: $color-text-primary;

    &.inverted {
      color: $color-text-light;
    }
    &:hover,
    &.active {
      color: $color-text-primary-highlight;
      background-color: $color-bg-primary-dimmed;
      border: 1px solid $color-border-primary-light;
    }

    &:active {
      background-color: $color-bg-primary-light;
      border: 1px solid transparent;
    }
    .spinner {
      border: 3px solid $color-border-primary;
    }
  }

  .secondary {
    @extend %button;

    color: $color-text-warning;

    &:hover,
    &.active {
      color: $color-text-warning;
      background-color: $color-bg-warning-light;
      border: 1px solid $color-border-warning-light;
    }

    &:active {
      color: $color-text-light;
      background-color: $color-bg-warning-dark;
      border: 1px solid transparent;
    }

    .spinner {
      border: 3px solid $color-border-secondary;
    }
  }

  .icon {
    display: inline-flex;
  }

  .wrapper {
    @include flex-center;

    > * + * {
      margin-left: 8px;
    }
  }
</style>
