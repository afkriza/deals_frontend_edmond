<template>
  <div :class="$style.item">
    <TextEllipsis :class="$style.name" :text="name" />
    <TextEllipsis
      :class="[$style.description, { [$style.hover]: isHover }]"
      :text="description"
    />
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import TextEllipsis from '@/components/core/TextEllipsis.vue';

  @Component({
    components: { TextEllipsis }
  })
  export default class PartnerListItem extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly name: string;

    @Prop({
      type: String,
      default: ''
    })
    readonly description: string;

    @Prop({
      type: Boolean
    })
    readonly isHover: boolean;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .item {
    @include column;

    padding: 24px 8px;

    line-height: 20px;

    overflow: hidden;
  }

  .name {
    font-weight: bold;
  }

  .description {
    color: $color-text-main-lighter;

    &.hover {
      color: $color-text-main-light;
    }
  }
</style>
