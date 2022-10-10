<template>
  <div :class="[$style.control, { [$style.dark]: dark }]">
    <template v-for="option in options">
      <button
        :key="option[trackBy]"
        :class="[
          $style.tab,
          {
            [$style.active]: value === option[trackBy],
            [$style.compact]: compact
          }
        ]"
        @click="onUpdate(option[trackBy])"
      >
        <slot :option="option">
          {{ option.label }}
        </slot>
      </button>
    </template>
  </div>
</template>

<script lang="ts">
  import { Component, Emit, Model, Prop, Vue } from 'vue-property-decorator';
  import Button from '@/components/core/Button.vue';

  interface Option {
    id: string;
    label: string;
  }

  @Component({
    name: 'SegmentControl',
    components: { Button }
  })
  export default class SegmentControl extends Vue {
    @Model('update', {
      type: String,
      required: true
    })
    readonly value: string;

    @Prop({
      type: String,
      default: 'id'
    })
    readonly trackBy: string;

    @Prop({
      type: Array,
      required: true
    })
    readonly options: Option[];

    @Prop({
      type: Boolean
    })
    readonly dark: boolean;

    @Prop({
      type: Boolean
    })
    readonly compact: boolean;

    @Emit('update')
    onUpdate(optionId: string) {
      return optionId;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .dark {
    &.control {
      background-color: $color-bg-primary-dark;
    }

    .tab {
      color: $color-text-main-lighter;

      &.active {
        color: $color-text-light;
        background-color: $color-bg-primary-mid;
      }

      &:hover:not(.active) {
        color: $color-text-light;
        background-color: $color-bg-primary-hover-dark;
      }
    }
  }

  .control {
    @include row;

    background-color: $color-bg-main-light;
    border-radius: 6px;
    font-weight: bold;
    padding: 2px;
  }

  .tab {
    @include button;
    @include flex-center;

    flex: 1;
    cursor: pointer;
    border-radius: 4px;
    line-height: 20px;
    color: $color-text-main;
    font-weight: bold;

    &.compact {
      padding: 2px 8px;
    }

    &.active {
      pointer-events: none;
      background-color: $color-bg-light;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    }

    &:hover:not(.active) {
      background-color: $color-bg-primary-light;
      color: $color-text-primary;
    }

    &:not(:first-child) {
      margin-left: 4px;
    }
  }
</style>
