<template>
  <VPopover trigger="hover" offset="8" :popover-inner-class="null">
    <template #popover>
      <TooltipKeyboardShortcut text="Esc" />
    </template>
    <ButtonFlat :class="$style.button" v-on="$listeners">
      <IconClose />
    </ButtonFlat>
  </VPopover>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import { VTooltip, VPopover } from 'v-tooltip';

  import IconClose from '@/assets/images/icons/close-2px.svg';
  import ButtonFlat from '@/components/buttons/ButtonFlat.vue';
  import TooltipKeyboardShortcut from '@/components/core/tooltips/TooltipKeyboardShortcut.vue';

  @Component({
    components: { TooltipKeyboardShortcut, ButtonFlat, IconClose, VPopover },
    directives: {
      tooltip: VTooltip
    }
  })
  export default class ButtonEsc extends Vue {}
</script>

<style lang="scss" module>
  @import 'utils';

  .button {
    @include flex-center($is-inline: true);
    padding: 0;
    width: 32px;
    height: 32px;

    color: $color-text-main;

    &:hover {
      @include circle(
        32px,
        $color-bg-main-dimmed,
        1px solid $color-border-main-light
      );
    }
  }
</style>
