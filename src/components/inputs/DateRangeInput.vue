<template>
  <div
    :class="[
      $style.container,
      { [$style.dark]: dark, [$style.disabled]: disabled }
    ]"
  >
    <div :class="$style.labelWrapper">
      <label for="from" :class="$style.label">From</label>
      <label for="to" :class="$style.label">To</label>
      <!--   Dummy span to compensate for icon width   -->
      <span v-if="showIcon" :class="$style.dummy"></span>
    </div>
    <div
      :class="[
        $style.inputWrapper,
        {
          [$style.focused]: isFocused,
          [$style.error]: error,
          [$style.disabled]: disabled
        }
      ]"
    >
      <input
        id="from"
        type="text"
        :class="[$style.input, { [$style.disabled]: disabled }]"
        v-model.lazy="fromSynced"
        :placeholder="placeholderFrom"
        @focus="onInputFocus"
        @blur="onInputBlur"
      />
      <input
        id="to"
        type="text"
        :class="[$style.input, { [$style.disabled]: disabled }]"
        v-model.lazy="toSynced"
        :placeholder="placeholderTo"
        @focus="onInputFocus"
        @blur="onInputBlur"
      />
      <span v-if="showIcon" :class="$style.iconWrapper">
        <span :class="$style.rect">
          <IconCalendar @click="onCalendarIconClick" />
        </span>
      </span>
    </div>
    <span :class="[$style.helperText, { [$style.error]: error }]">
      {{ helperText }}
    </span>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, PropSync, Emit } from 'vue-property-decorator';

  import IconCalendar from '@/assets/images/icons/calendar.svg';

  @Component({
    name: 'DateRangeInput',
    components: { IconCalendar }
  })
  export default class DateRangeInput extends Vue {
    @PropSync('from', {
      type: String,
      required: true
    })
    readonly fromSynced: string;

    @PropSync('to', {
      type: String,
      required: true
    })
    readonly toSynced: string;

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
    readonly showIcon: boolean;

    @Prop({
      type: String,
      default: ''
    })
    readonly helperText: string;

    @Prop({
      type: String,
      default: ''
    })
    readonly placeholderFrom: string;

    @Prop({
      type: String,
      default: ''
    })
    readonly placeholderTo: string;

    isFocused = false;

    onInputFocus() {
      this.isFocused = true;
    }

    onInputBlur() {
      this.isFocused = false;
    }

    @Emit('icon:click')
    onCalendarIconClick() {
      return;
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
  $disabled-bg-color-light: #f0f1f2;
  $disabled-color: $color-text-main-light;

  $disabled-bg-color-dark: #444d56;

  $icon-color-light: $color-gray-50;
  $icon-color-hover-light: $color-primary-highlight;

  $icon-color-dark: $color-gray-80;
  $icon-color-hover-dark: $color-white;

  $icon-rect-hover-color-light: $color-bg-primary-light;
  $icon-rect-hover-color-dark: #565d66;

  .dark {
    .label-wrapper {
      color: $label-color-dark;
    }

    .input-wrapper {
      border: 1px solid $border-color-dark;

      &:hover {
        @include hard-shadow($hover-border-color-dark, 3px);
      }

      &.focused {
        border: 2px solid $focus-border-color-dark;
      }

      &.disabled {
        background-color: $disabled-bg-color-dark;
      }
    }

    .input {
      color: $text-color-dark;

      &:first-child {
        border-right: 1px solid $border-color-dark;
      }
    }

    .helper-text {
      color: $helper-text-color-dark;
    }

    .icon-wrapper {
      border-color: $border-color-dark;

      .rect {
        color: $icon-color-dark;

        &:hover {
          color: $icon-color-hover-dark;
          background: $icon-rect-hover-color-dark;
        }
      }
    }
  }

  .container {
    position: relative;

    &.disabled {
      pointer-events: none;
    }
  }

  .input-wrapper {
    @include row;

    border: 1px solid $border-color-light;
    box-sizing: border-box;
    border-radius: 4px;

    height: 36px;

    > *:first-child {
      border-right: 1px solid $border-color-light;
    }

    &:hover {
      @include hard-shadow($hover-border-color-light, 3px);
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
      background-color: $disabled-bg-color-light;
      border-color: transparent;
    }
  }

  .label-wrapper {
    @include row;

    color: $label-color-light;
    margin-bottom: 4px;
    font-size: 12px;
    line-height: 16px;
  }

  .label {
    flex: 1;
  }

  .input {
    @include input;

    flex: 1;

    line-height: 20px;
    padding: 0 16px;

    color: $text-color-light;

    &.disabled {
      color: $disabled-color;
    }
  }

  .helper-text {
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

  .icon-wrapper {
    @include flex-center($is-inline: true, $flex-direction: column);

    width: 40px;
    border-left: 1px solid $border-color-light;

    .rect {
      @include flex-center($is-inline: true);
      border-radius: 2px;
      width: 28px;
      height: 28px;
      color: $icon-color-light;

      &:hover {
        cursor: pointer;
        color: $icon-color-hover-light;
        background: $icon-rect-hover-color-light;
      }
    }
  }

  .dummy {
    flex-basis: 40px;
  }
</style>
