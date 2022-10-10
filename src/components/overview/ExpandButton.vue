<template>
  <IconButton
    v-tooltip.bottom="{
      content: 'Expand',
      delay: { show: 500 }
    }"
    :class="$style.button"
    :content-class="$style.content"
    v-on="$listeners"
  >
    <IconExpand slot="icon" />
  </IconButton>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { VTooltip } from 'v-tooltip';

  import IconButton from '@/components/buttons/IconButton.vue';
  import IconExpand from '@/assets/images/icons/expand.svg';

  @Component({
    components: { IconButton, IconExpand },
    directives: {
      tooltip: VTooltip
    }
  })
  export default class ExpandButton extends Vue {}
</script>

<style lang="scss" module>
  @import 'utils';

  .button {
    @include flex-center;

    width: 20px;
    height: 20px;

    padding: 0;
    background-color: $color-bg-light;
    border: 1px solid $color-border-main-light;

    &:hover {
      border-color: transparent;
      background-color: $color-bg-main-light;
    }
  }

  .content {
    width: auto;
  }
</style>
