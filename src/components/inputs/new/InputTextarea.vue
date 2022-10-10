<template>
  <div
    :class="{ [$style.dark]: dark, [$style.disabled]: disabled }"
    :style="style"
  >
    <label v-if="label" :for="id" :class="$style.label">{{ label }}</label>
    <div
      :class="[
        $style.wrapper,
        wrapperClass,
        {
          [$style.focused]: isFocused,
          [$style.error]: error,
          [$style.disabled]: disabled
        }
      ]"
    >
      <textarea
        :id="id"
        ref="input"
        v-show="!hideInput"
        :type="type"
        :class="[
          $style.input,
          inputClass,
          {
            [$style.disabled]: disabled,
            [$style.focused]: isFocused,
            [$style.error]: error
          }
        ]"
        :value="value"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        autocomplete="off"
        @input="$emit('update', $event.target.value)"
        @focus="onInputFocus"
        @blur="onInputBlur"
      />
    </div>
    <span :class="[$style.message, { [$style.error]: error }]">
      {{ message }}
    </span>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Emit, Ref } from 'vue-property-decorator';
  import { generateRandomHex } from '@/utils/string';
  import { size, split } from 'lodash';

  @Component({
    inheritAttrs: false,
    model: {
      event: 'update'
    }
  })
  export default class InputBase extends Vue {
    @Prop({
      type: String,
      default: 'text'
    })
    readonly type: string;

    @Prop({
      type: Boolean
    })
    readonly dark: boolean;

    @Prop({
      type: Boolean
    })
    readonly error: boolean;

    @Prop({
      type: Boolean
    })
    readonly disabled: boolean;

    @Prop({
      type: Boolean
    })
    readonly readonly: boolean;

    @Prop({
      type: Boolean
    })
    readonly hideInput: boolean;

    @Prop({
      type: String,
      default: ''
    })
    readonly message: string;

    @Prop({
      type: String,
      default: ''
    })
    readonly label: string;

    @Prop({
      type: String,
      default: ''
    })
    readonly placeholder: string;

    @Prop({
      type: [String, Array]
    })
    readonly inputClass: string | string[];

    @Prop({
      type: [String, Array]
    })
    readonly wrapperClass: string | string[];

    @Prop({
      type: Boolean
    })
    readonly autosize: boolean;

    @Prop({
      type: String,
      required: true
    })
    readonly value: string;

    @Ref('input')
    readonly inputElement: HTMLInputElement;

    isFocused = false;

    get id() {
      return generateRandomHex();
    }

    get style() {
      if (!this.autosize) {
        return null;
      }

      return {
        height: `${size(split(this.value, '\n')) * 20 + 16}px`
      };
    }

    @Emit('focus')
    onInputFocus() {
      this.isFocused = true;

      return true;
    }

    @Emit('blur')
    onInputBlur() {
      this.isFocused = false;

      return true;
    }

    async $focus() {
      await this.$nextTick();
      this.inputElement.focus();
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  $label-color-light: $color-text-main-light;
  $label-color-dark: $color-text-main-lighter;

  $helper-text-color-light: $color-text-main-light;
  $helper-text-color-dark: $color-text-main-lighter;

  $border-color-light: $color-border-main-light;
  $border-color-dark: $color-border-main-dark;

  $hover-border-color-light: $color-border-primary-light;
  $hover-border-color-dark: #565d66;

  $focus-border-color-light: #2367ba;
  $focus-border-color-dark: $color-border-light;

  $text-color-light: $color-text-main;
  $text-color-dark: $color-border-light;

  $error-color: $color-warning;
  $disabled-bg-color-light: $color-bg-main-light;
  $disabled-color: $color-text-main-light;

  $disabled-bg-color-dark: #444d56;

  $icon-color-light: $color-gray-50;
  $icon-color-hover-light: $color-primary-highlight;

  $icon-color-dark: $color-gray-80;
  $icon-color-hover-dark: $color-white;

  .label {
    display: inline-block;

    font-size: 12px;
    line-height: 16px;

    margin-bottom: 4px;

    color: $label-color-light;
  }

  .wrapper {
    @include row;

    background-color: $color-bg-light;

    border: 1px solid $border-color-light;
    box-sizing: border-box;
    border-radius: 4px;

    flex: 1;
    min-height: 36px;
    color: $text-color-light;

    &:not(.disabled) {
      &:hover {
        @include hard-shadow($hover-border-color-light, 3px);
      }
    }

    &.focused {
      border: 2px solid $focus-border-color-light;
    }

    &.error {
      border: 1px solid $error-color;
    }

    &.error.focused {
      border: 2px solid $error-color;
    }

    &.disabled {
      pointer-events: none;
      background-color: $disabled-bg-color-light;
      border-color: transparent;
    }
  }

  .input {
    @include input;

    resize: none;

    flex: 1;

    line-height: 20px;
    padding: 6px 16px;

    color: $text-color-light;

    &.disabled {
      color: $disabled-color;
    }

    // Compensate for border width increase to prevent content twitch
    &.focused,
    &.error.focused {
      padding: 5px 15px;
    }
  }

  .message {
    position: absolute;
    display: block;
    margin-top: 2px;
    font-size: 12px;
    line-height: 16px;

    color: $helper-text-color-light;

    &.error {
      color: $error-color;
    }
  }

  .dark {
    .label {
      color: $label-color-dark;
    }

    .wrapper {
      color: $text-color-dark;
      border: 1px solid $border-color-dark;

      &:not(.disabled) {
        &:hover {
          @include hard-shadow($hover-border-color-dark, 3px);
        }
      }

      &.focused {
        border: 2px solid $focus-border-color-dark;
      }

      &.disabled {
        background-color: $disabled-bg-color-dark;
      }

      &.error {
        border: 1px solid $error-color;
      }

      &.error.focused {
        border: 2px solid $error-color;
      }
    }

    .input {
      color: $text-color-dark;
    }

    .message {
      color: $helper-text-color-dark;

      &.error {
        color: $error-color;
      }
    }
  }
</style>
