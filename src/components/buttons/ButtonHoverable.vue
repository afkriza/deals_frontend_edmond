<template>
  <VPopover trigger="hover" offset="8" :popover-inner-class="null">
    <template #popover>
      <slot name="tooltip"></slot>
    </template>
    <ButtonFlat
      :class="[$style.button, buttonClass, { [$style.oval]: oval }]"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <slot></slot>
    </ButtonFlat>
  </VPopover>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { VTooltip, VPopover } from 'v-tooltip';

  import ButtonFlat from '@/components/buttons/ButtonFlat.vue';
  @Component({
    components: { VPopover, ButtonFlat },
    inheritAttrs: false,
    directives: {
      tooltip: VTooltip
    }
  })
  export default class ButtonHoverable extends Vue {
    @Prop({
      type: String,
      default: null
    })
    readonly buttonClass: string;

    @Prop({
      type: Boolean
    })
    readonly oval: boolean;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .button {
    @include flex-center;

    color: $color-text-main;

    border: 1px solid $color-border-main-light;
    border-radius: 14px;

    &:hover {
      background-color: $color-bg-main-dimmed;
    }

    &.oval {
      padding: 0;
      width: 32px;
      height: 32px;
      background-color: transparent;
      border: 1px solid transparent;

      &:hover {
        @include circle(
          32px,
          $color-bg-main-dimmed,
          1px solid $color-border-main-light
        );
      }
    }
  }
</style>
