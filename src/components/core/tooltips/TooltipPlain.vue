<template>
  <div :class="$style.tooltip">
    <slot />
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';

  @Component
  export default class TooltipPlain extends Vue {}
</script>

<style lang="scss" module>
  @import 'utils';

  .tooltip {
    background: $color-bg-light;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
</style>
