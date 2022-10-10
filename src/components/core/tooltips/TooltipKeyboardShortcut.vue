<template>
  <div :class="$style.key">{{ text }}</div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';

  @Component
  export default class TooltipKeyboardShortcut extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly text: string;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  $keyboard-shortcut-bg-color: #f0f0f0;
  $keyboard-shortcut-box-shadow-color: #b3b3b3;

  .key {
    background-color: $keyboard-shortcut-bg-color;
    box-shadow: 0 2px 0 $keyboard-shortcut-box-shadow-color;
    border-radius: 2px;
    padding: 2px 6px;
    line-height: 20px;
    font-weight: bold;
  }
</style>
