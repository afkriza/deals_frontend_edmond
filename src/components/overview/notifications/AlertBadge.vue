<template>
  <div
    :class="[$style.badge, { [$style.read]: read, [$style.invert]: invert }]"
  >
    <IconAlert />
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import IconAlert from '@/assets/images/icons/alert.svg';

  @Component({
    components: {
      IconAlert
    }
  })
  export default class AlertBadge extends Vue {
    @Prop({
      type: Boolean
    })
    readonly read: boolean;

    @Prop({
      type: Boolean
    })
    readonly invert: boolean;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .badge {
    @include flex-center;

    background-color: $color-bg-light;
    color: $color-text-main;
    border: 1px solid $color-border-light;

    min-width: 20px;
    min-height: 20px;

    border-radius: 100%;

    &.read {
      animation: pop 0.2s forwards;

      background-color: transparent;
      border-color: rgba(255, 255, 255, 0.5);
      color: rgba(255, 255, 255, 0.8);

      &.invert {
        border-color: rgba(0, 0, 0, 0.15);
        color: rgba(0, 0, 0, 0.35);
      }
    }
  }

  @keyframes pop {
    25% {
      transform: scale(1.1);
    }

    100% {
      transform: scale(1);
    }
  }
</style>
