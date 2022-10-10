<template>
  <input
    :type="type"
    :class="$style.input"
    @input="$emit('update', $event.target.value)"
    v-on="$listeners"
    v-bind="$attrs"
  />
</template>

<script>
  import { isKey } from 'utils/keyboard-events';
  import { ENTER } from 'constants/keyboard';

  export default {
    name: 'BaseInput',
    inheritAttrs: false,
    model: {
      event: 'update'
    },
    props: {
      type: {
        type: String,
        default: 'text',
        validator(value) {
          return [
            'email',
            'number',
            'password',
            'search',
            'tel',
            'text',
            'url'
          ].includes(value);
        }
      }
    },

    methods: {
      onKeyDown(event) {
        if (isKey(ENTER, event)) {
          this.$emit('enter:keypress');
        }
      }
    },

    created() {
      if (this.$listeners['enter:keypress']) {
        document.addEventListener('keydown', this.onKeyDown);
      }
    },

    destroyed() {
      if (this.$listeners['enter:keypress']) {
        document.removeEventListener('keydown', this.onKeyDown);
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .input {
    padding: 6px 0 0 1px;

    border: none;
    filter: none;
    border-bottom: 1px solid $color-border-main;

    width: 100%;

    font-size: 14px;

    outline: none;

    color: $color-text-main;
    background-color: transparent;

    &[disabled] {
      pointer-events: none;
    }

    /* Chrome, Safari, Edge, Opera */
    /* stylelint-disable property-no-vendor-prefix */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    &[type='number'] {
      -moz-appearance: textfield;
    }
  }
</style>
