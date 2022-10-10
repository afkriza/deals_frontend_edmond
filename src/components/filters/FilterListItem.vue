<template>
  <div
    :class="[
      $style.item,
      {
        [$style.indented]: indented,
        [$style.disabled]: disabled,
        [$style.active]: active
      }
    ]"
    v-on="$listeners"
  >
    <slot name="prepend" />
    <text-ellipsis v-if="isOpen" :text="title" />
    <slot name="append" />
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import Checkbox from '@/components/core/Checkbox.vue';
  import RotationSwitch from '@/components/core/RotationSwitch.vue';
  import IconChevronDown from '@/assets/images/icons/chevron-down-light.svg';
  import TextEllipsis from '@/components/core/TextEllipsis.vue';

  @Component({
    name: 'FilterListItem',
    components: { RotationSwitch, Checkbox, IconChevronDown, TextEllipsis }
  })
  export default class FilterListItem extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly title: string;

    @Prop({
      type: Boolean
    })
    readonly disabled: boolean;

    @Prop({
      type: Boolean
    })
    readonly active: boolean;

    @Prop({
      type: Boolean
    })
    readonly indented: boolean;

    @Prop({
      type: Boolean,
      default: true
    })
    readonly isOpen: boolean;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .item {
    @include row;

    align-items: center;

    height: 32px;
    padding: 0 16px;
    line-height: 20px;

    color: $color-text-light;
    background-color: $color-bg-primary-darker;

    transition: background-color 0.1s linear;

    cursor: pointer;

    &:not(.disabled):hover {
      background-color: $color-bg-primary-mid;
    }

    &.active {
      font-weight: bold;
    }

    &.disabled {
      pointer-events: none;
      color: $color-bg-main-darker;
    }
  }

  .indented {
    padding-left: 50px;
  }
</style>
