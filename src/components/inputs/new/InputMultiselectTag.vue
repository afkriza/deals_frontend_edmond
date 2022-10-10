<template>
  <div :class="$style.tag">
    <span>{{ text }}</span>
    <IconClose @click="onRemoveClick" />
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
  import IconClose from '@/assets/images/icons/Navigation/Close/ic-16-close-2px.svg';

  @Component({
    components: { IconClose }
  })
  export default class InputMultiselectTag extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly text: string;

    @Emit('remove')
    onRemoveClick() {
      return;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .tag {
    @include flex-center($is-inline: true);

    padding: 4px 8px;

    border-radius: 4px;

    background-color: $color-bg-primary-dimmed;
    color: $color-primary;
    font-weight: bold;
    font-size: 12px;
    line-height: 16px;

    > * + * {
      margin-left: 4px;
    }
  }
</style>
