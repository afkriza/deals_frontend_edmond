<template>
  <div :class="[$style.container, isFocused && $style.isFocused]">
    <div @click="$emit('submit:back')" :class="$style.back" />
    <base-input
      :class="[$style.input, isFocused && $style.isFocused, classOverride]"
      v-bind="$attrs"
      v-on="$listeners"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
    <div @click="$emit('submit:forward')" :class="$style.forward" />
  </div>
</template>

<script>
  import BaseInput from 'components/core/BaseInput';

  export default {
    name: 'SliderInput',
    components: {
      BaseInput
    },
    inheritAttrs: false,
    model: {
      event: 'update'
    },
    props: {
      classOverride: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        isFocused: false
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    display: flex;
    width: 100%;
    border: 1px solid $color-border-main-light;
    border-radius: 4px;
    min-height: 36px;
  }

  .input {
    overflow: hidden;
    padding: 8px;
    border-style: solid;
    border-width: 0 1px;
    text-align: center;
    border-color: $color-border-main-light;
  }

  .back,
  .forward {
    cursor: pointer;
    width: 40px;
    min-width: 40px;
    position: relative;
  }

  .forward::before,
  .forward::after,
  .back::before {
    content: '';
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 2px;
    width: 10px;
    background-color: $color-border-main-dark;
    border-radius: 2px;
  }

  .forward::after {
    transform: translate(-50%, -50%) rotate(90deg);
  }

  .is-focused {
    border-color: $color-bg-primary-highlight;
  }
</style>
