<template>
  <div
    :class="$style.skeleton"
    :style="{
      '--bg-color': '#444D56',
      '--gradient':
        'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.13) 66.4%, rgba(255, 255, 255, 0) 100%)'
    }"
  ></div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';

  @Component
  export default class SkeletonLoader extends Vue {}
</script>

<style lang="scss" module>
  @import 'utils';

  .skeleton {
    @include skeleton(var(--bg-color), var(--gradient));
    display: inline-block;
    height: 1em;
  }
</style>
