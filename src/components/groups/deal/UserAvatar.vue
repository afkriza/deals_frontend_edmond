<template>
  <div
    :class="[$style.circle, isCurrentUser ? $style.primary : $style.secondary]"
  >
    <span>{{ initials }}</span>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';

  @Component
  export default class AvatarIcon extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly initials: string;

    @Prop({
      type: Boolean
    })
    readonly isCurrentUser: boolean;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .circle {
    @include flex-center;

    width: 32px;
    height: 32px;
    border-radius: 100%;

    font-weight: bold;

    color: $color-text-light;
  }

  .primary {
    background-color: $color-status-signal-blue;
  }

  .secondary {
    background-color: $color-bg-primary-mid;
  }
</style>
