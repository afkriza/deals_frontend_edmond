<template>
  <label :class="$style.container">
    <span
      :class="[
        $style.label,
        {
          [$style.slideTop]: isFocused || isFilled,
          [$style.isFocused]: isFocused,
          [$style.isInvalid]: isInvalid
        }
      ]"
      >{{ label }}</span
    >
    <div :class="$style.wrapper">
      <base-input
        :class="classOverride"
        :value="value"
        v-bind="$attrs"
        v-on="$listeners"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <slot />
      <span
        :class="[
          $style.border,
          { [$style.isFocused]: isFocused, [$style.isInvalid]: isInvalid }
        ]"
      ></span>
      <span
        v-show="helperText"
        :class="[
          $style.subText,
          { [$style.isFocused]: isFocused, [$style.isInvalid]: isInvalid },
          helperClassOverride
        ]"
        >{{ helperText }}</span
      >
    </div>
  </label>
</template>

<script>
  import BaseInput from 'components/core/BaseInput';

  export default {
    name: 'AnimatedInput',
    inheritAttrs: false,
    components: {
      BaseInput
    },
    model: {
      event: 'update'
    },
    props: {
      label: {
        type: String,
        default: ''
      },
      isInvalid: {
        type: Boolean,
        default: false
      },
      helperText: {
        type: String,
        default: ''
      },
      classOverride: {
        type: [String, Array],
        default: ''
      },
      helperClassOverride: {
        type: [String, Array],
        default: ''
      },
      value: {
        type: String,
        default: ''
      }
    },
    computed: {
      isFilled() {
        return Boolean(this.value);
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
    flex-direction: column;
    width: 100%;
  }

  .wrapper {
    position: relative;
    display: inline-block;
  }

  .border {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 1px;
    background-color: $color-border-primary;

    transition: width 0.2s;

    width: 0;

    &.is-focused {
      width: 100%;
    }

    &.is-invalid {
      width: 100%;
      background-color: $color-border-warning;
    }
  }

  .label {
    position: relative;
    top: 22px;

    font-size: 14px;
    color: $color-text-main-lighter;

    transition: {
      property: top, font-size, color;
      duration: 0.3s;
    }

    will-change: top, font-size, color;

    &.slide-top {
      top: 0;
      font-size: 12px;
    }

    &.is-focused {
      color: $color-text-primary;
    }

    &.is-invalid {
      color: $color-text-warning;
    }
  }

  .sub-text {
    position: absolute;
    padding: 3px 0 0 1px;
    font-size: 12px;
    color: $color-text-main-lighter;
    bottom: -20px;
    left: 0;
    white-space: nowrap;

    transition: {
      property: color;
      duration: 0.3s;
    }

    &.is-focused {
      color: $color-text-primary;
    }

    &.is-invalid {
      color: $color-text-warning;
    }
  }
</style>
