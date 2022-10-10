<template>
  <div>
    <label v-if="label" :class="$style.label">
      {{ label }}
    </label>
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'LabelWrapper',
    props: {
      label: {
        type: String,
        default: ''
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .label {
    display: block;
    font-size: 12px;
    line-height: 16px;
    color: $color-text-main-light;
    padding-bottom: 5px;
  }
</style>
