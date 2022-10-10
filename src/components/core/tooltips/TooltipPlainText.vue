<template>
  <TooltipPlain :class="$style.tooltip">
    <span :class="$style.text">{{ text }}</span>
  </TooltipPlain>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import TooltipPlain from '@/components/core/tooltips/TooltipPlain.vue';

  @Component({
    components: { TooltipPlain }
  })
  export default class TooltipPlainText extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly text: string;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .tooltip {
    @include flex-center;
    padding: 4px 16px;
  }

  .text {
    line-height: 20px;
  }
</style>
