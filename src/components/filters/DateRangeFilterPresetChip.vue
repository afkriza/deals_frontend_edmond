<template>
  <span :class="[$style.chip, { [$style.active]: active }]" v-on="$listeners">
    {{ text }}
  </span>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component({
    name: 'DateRangeFilterPresetChip'
  })
  export default class DateRangeFilterPresetChip extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly text: string;

    @Prop({
      type: Boolean
    })
    readonly active: boolean;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .chip {
    @include flex-center($is-inline: true);

    cursor: pointer;

    color: $color-text-light;
    background-color: $color-bg-primary-darker;

    border: 1px solid $color-border-main-dark;
    border-radius: 16px;

    font-weight: bold;
    font-size: 12px;
    line-height: 16px;

    padding: 5px 11px;

    &:hover {
      border-color: $color-border-light;
      background-color: $color-bg-primary-mid;
    }
  }

  .active {
    pointer-events: none;

    color: $color-text-primary;
    background-color: $color-bg-light;
  }
</style>
