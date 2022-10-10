<template>
  <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      :class="$style[theme]"
      d="M5.5 14.107l-1 5.242 5.243-1M5.5 14.107l7.485-7.486M5.5 14.107l4.243 4.242m0 0l7.485-7.485m-4.243-4.243L15.107 4.5l4.242 4.243-2.121 2.121m-4.243-4.243l4.243 4.243"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts">
  import { Component } from 'vue-property-decorator';
  import OverviewCardIcon from '@/components/icons/overview/OverviewCardIcon.vue';

  @Component({
    name: 'DoIcon'
  })
  export default class Do extends OverviewCardIcon {}
</script>

<style lang="scss" module>
  @import 'utils';

  .bad,
  .good {
    stroke: $color-bg-light;
  }

  .mid {
    stroke: $color-bg-main-dark;
  }
</style>
