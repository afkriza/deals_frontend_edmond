<template>
  <div :class="[{ [$style.isInvalid]: isInvalid }, $style.wrapper]">
    <label v-if="label" :class="[labelClass, $style.label, labelOverrideClass]">
      {{ label }}
    </label>
    <input
      :class="[
        themeClass,
        $style[this.size],
        $style.input,
        { [$style.hasError]: error }
      ]"
      :type="type"
      :value="inputValue"
      :maxlength="maxLength"
      :readonly="disabled"
      :placeholder="placeholder"
      ref="input"
      @input="onInput"
      @blur="onBlur"
      @focus="onFocus"
    />

    <div :class="$style.error" v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
  import { isKey } from 'utils/keyboard-events';
  import { ENTER } from 'constants/keyboard';

  export default {
    props: {
      label: {
        type: String
      },
      error: {
        type: String
      },
      placeholder: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'text'
      },
      size: {
        type: String,
        default: 'normal'
      },
      state: {
        type: String,
        default: 'input'
      },
      theme: {
        type: [String, Array],
        default: 'primary'
      },
      isInvalid: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      labelStyle: {
        type: [String, Array]
      },
      labelOverrideClass: {
        type: [String, Array]
      },
      value: {},
      maxLength: {}
    },
    computed: {
      labelClass() {
        if (!this.labelStyle) {
          return null;
        }

        if (typeof this.labelStyle === 'string') {
          return this.$style[this.labelStyle];
        }

        return this.labelStyle.map(style => {
          return this.$style[style];
        });
      },

      themeClass() {
        if (typeof this.theme === 'string') {
          return this.$style[this.theme];
        }

        return this.theme.map(theme => {
          return this.$style[theme];
        });
      }
    },
    watch: {
      value() {
        this.inputValue = this.value;
      }
    },
    methods: {
      focus() {
        this.$refs.input.focus();
      },

      onKeyDown(event) {
        if (isKey(ENTER, event)) {
          this.$emit('enter:keypress');
        }
      },

      onInput(event) {
        if (this.state === 'input') {
          this.$emit('input', event.target.value);
        }
      },
      onBlur(event) {
        if (this.state === 'blur') {
          this.$emit('input', event.target.value);
        }
      },
      onFocus(event) {
        this.$emit('focus');
      }
    },
    data() {
      return {
        inputValue: ''
      };
    },

    created() {
      this.inputValue = this.value;
      document.addEventListener('keydown', this.onKeyDown);
    },

    destroyed() {
      document.removeEventListener('keydown', this.onKeyDown);
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .wrapper {
    position: relative;

    &.is-invalid {
      .input {
        border-bottom: 2px solid $color-border-warning;

        background-image: url('~input-error.png');
        background-size: 24px 24px;
        background-position: center right;
        background-repeat: no-repeat;

        @include media(retina) {
          background-image: url('~input-error@2x.png');
        }
      }

      .label {
        color: $color-text-warning;
      }
    }
  }

  .label {
    font-size: 12px;
    color: $color-text-main;
    text-transform: uppercase;
    display: block;

    &.normalcase {
      text-transform: none;
    }

    &.mild {
      color: $color-text-main-mild-light;
    }

    &.primary {
      color: $color-text-primary;
    }

    &.white {
      color: $color-text-light;
    }
  }

  .input {
    padding: 6px 0;

    border: {
      top: 0;
      right: 0;
      bottom: 2px solid $color-border-main;
      left: 0;
    }

    width: 100%;

    display: block;

    font-size: 14px;
    font-weight: 500;

    color: $color-text-main-lighter;
    background-color: transparent;

    &.primary {
      color: $color-text-main;
    }

    &.secondary {
      color: $color-text-primary;
      border-bottom: 1px solid currentColor;
    }

    &.light {
      font-weight: normal;
      color: $color-text-main;
      border-bottom: 1px solid $color-border-main;
      padding-bottom: 5px;

      &.has-error {
        border-bottom-width: 2px;
        border-color: $color-border-warning;
      }
    }

    &.white {
      color: $color-text-light;
      border-color: $color-border-light;
    }

    &.date {
      padding: 2px 0;
      color: $color-text-light;
      border-bottom: 1px solid $color-border-light;
    }

    &:focus {
      outline: 0;
    }

    &[type='checkbox'] {
      box-shadow: none;
    }

    &.big {
      font-size: 16px;
    }

    &.huge {
      font-size: 24px;
    }

    &.bold {
      font-weight: bold;
    }

    &.no-top-padding {
      padding-top: 0;
    }

    &::placeholder {
      color: $color-text-main-lighter;
    }
  }

  .error {
    position: absolute;

    font-size: 12px;
    letter-spacing: 0.2px;

    margin-top: 4px;

    color: $color-text-warning;
  }
</style>
