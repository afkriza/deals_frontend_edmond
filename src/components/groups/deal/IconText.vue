<template>
  <div :class="$style.box">
    <component :is="icon" :class="$style.icon"></component>
    <TextEllipsis :text="text" />
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import TextEllipsis from '@/components/core/TextEllipsis.vue';

  @Component({
    components: { TextEllipsis }
  })
  export default class IconText extends Vue {
    @Prop({
      type: Object,
      required: true
    })
    readonly icon;

    @Prop({
      type: String,
      required: true
    })
    readonly text: string;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .box {
    @include flex-center;

    span {
      margin-left: 8px;
    }
  }

  .icon {
    flex-shrink: 0;
  }
</style>
