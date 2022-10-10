<template>
  <span
    v-if="track"
    v-resize:throttle="calculateIsTextEllipsis"
    v-tooltip.bottom="{
      content: isTextEllipsis ? text : null,
      delay: { show: 500 }
    }"
    :class="$style.ellipsis"
    >{{ text }}</span
  >
  <span
    v-else
    v-tooltip.bottom="{
      content: isTextEllipsis ? text : null,
      delay: { show: 500 }
    }"
    :class="$style.ellipsis"
    >{{ text }}</span
  >
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { VTooltip } from 'v-tooltip';
  import resize from 'vue-resize-directive';

  @Component({
    name: 'TextEllipsis',
    directives: {
      resize,
      tooltip: VTooltip
    }
  })
  export default class TextEllipsis extends Vue {
    @Prop({
      type: String,
      default: ''
    })
    readonly text: string;

    @Prop({
      type: Boolean,
      default: false
    })
    readonly track: boolean;

    isTextEllipsis = false;

    isOverflown({ scrollWidth, clientWidth }: Element) {
      return scrollWidth > clientWidth;
    }

    calculateIsTextEllipsis() {
      this.isTextEllipsis = this.isOverflown(this.$el);
    }

    updated() {
      this.calculateIsTextEllipsis();
    }

    mounted() {
      this.calculateIsTextEllipsis();
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .ellipsis {
    @include text-ellipsis;
  }
</style>
