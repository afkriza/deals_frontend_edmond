<template>
  <textarea
    :value="value"
    v-on:input="$emit('input', $event.target.value)"
    :class="[$style.textarea, isInvalid && $style.isInvalid]"
  />
</template>

<script>
  export default {
    name: 'TextareaInput',
    model: {
      event: 'input'
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      isInvalid: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .textarea {
    resize: none;
    display: block;
    width: 100%;
    min-height: 100px;
    padding: 8px 16px;
    background-color: $color-bg-light;
    border-radius: 4px;
    border: 1px solid $color-border-main-light;
    transition: border 0.2s;

    &:focus {
      outline: none;
      border-color: $color-border-primary;
      box-shadow: 0 0 0 1px $color-border-primary;
    }

    &.is-invalid {
      border-color: $color-border-warning;
      box-shadow: 0 0 0 1px $color-border-warning;
    }
  }
</style>
