<template>
  <div
    :class="[$style.base, { [$style.dark]: dark, [$style.disabled]: disabled }]"
  >
    <label v-if="label" :for="id" :class="$style.label">{{ label }}</label>
    <div
      :class="[
        $style.wrapper,
        wrapperClass,
        {
          [$style.focused]: isFocused,
          [$style.error]: error,
          [$style.disabled]: disabled,
          [$style.transparent]: transparent
        }
      ]"
    >
      <slot name="prepend" :is-focused="isFocused"></slot>
      <input
        v-show="!hideInput"
        :id="id"
        ref="input"
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
        v-bind="$attrs"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        autocomplete="off"
        v-on="$listeners"
        @input="$emit('update', $event.target.value)"
        @focus="onInputFocus"
        @blur="onInputBlur"
      />
      <slot name="append"></slot>
    </div>
    <span :class="[$style.message, { [$style.error]: error }]">
      {{ message }}
    </span>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Emit, Ref } from 'vue-property-decorator';
  import { generateRandomHex } from '@/utils/string';

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
    readonly transparent: boolean;

    @Ref('input')
    readonly inputElement: HTMLInputElement;

    isFocused = false;

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

    get id() {
      return generateRandomHex();
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
  $border-color-dark: $color-border-primary-mid;

  $hover-border-color-light: $color-border-primary-light;
  $hover-border-color-dark: $color-border-primary-dark-hover;

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

  .base {
    position: relative;
  }

  .label {
    display: inline-block;
    vertical-align: bottom;

    font-size: 12px;
    line-height: 16px;

    margin-bottom: 4px;

    color: $label-color-light;
  }

  .wrapper {
    @include row;

    border: 1px solid $border-color-light;
    box-sizing: border-box;
    border-radius: 4px;

    min-height: 36px;
    color: $text-color-light;
    background-color: $color-bg-light;

    &:not(.disabled) {
      &:hover {
        @include hard-shadow($hover-border-color-light, 3px);
      }

      &.transparent {
        background-color: transparent;
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

    flex: 1;

    line-height: 20px;
    padding: 0 16px;

    min-width: 0;

    color: $text-color-light;

    &.disabled {
      color: $disabled-color;
    }

    // Compensate for border width increase to prevent content twitch
    &.focused,
    &.error.focused {
      padding: 0 15px;
    }

    &::placeholder {
      color: $color-text-main-lighter;
      opacity: 1;
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
      background-color: $color-bg-primary-darker;

      color: $text-color-dark;
      border: 1px solid $border-color-dark;

      &:not(.disabled) {
        &:hover {
          @include hard-shadow($hover-border-color-dark, 3px);
        }

        &.transparent {
          background-color: transparent;
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
