<template>
  <div :class="$style.container">
    <template v-for="(_, idx) in numberOfWeeks">
      <div :key="idx" :class="$style.item">
        <slot :idx="idx"></slot>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import SkeletonLoader from '@/components/core/SkeletonLoader.vue';
  @Component({
    components: { SkeletonLoader }
  })
  export default class WeeklyView extends Vue {
    @Prop({
      type: Number,
      default: 52
    })
    readonly numberOfWeeks;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    @include column;
  }

  .item {
    padding: 8px 16px;

    &:nth-child(2n + 1) {
      background-color: $color-bg-light;
    }
  }
</style>
