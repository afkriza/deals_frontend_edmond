<template>
  <label-wrapper :class="$style.container" :label="label">
    <div
      :class="[
        $style.inputWrapper,
        inputWrapperClass && inputWrapperClass,
        isInverted && $style.isInverted,
        isInvalid && $style.isInvalid,
        isFocused && !isInvalid && $style.isFocused
      ]"
    >
      <base-input
        v-if="!isCustom"
        :class="[$style.input, isInverted && $style.isInverted, classOverride]"
        v-bind="$attrs"
        v-on="$listeners"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <slot name="title"></slot>
      <div v-if="$slots.icon" :class="$style.icon">
        <slot name="icon" />
      </div>
    </div>
    <span
      v-show="helperText"
      :class="[$style.subText, isInvalid && $style.isInvalid]"
      >{{ helperText }}</span
    >
  </label-wrapper>
</template>

<script>
  import BaseInput from 'components/core/BaseInput';
  import LabelWrapper from './LabelWrapper';

  export default {
    name: 'MaterialInput',
    inheritAttrs: false,
    components: {
      LabelWrapper,
      BaseInput
    },
    model: {
      event: 'update'
    },
    props: {
      isCustom: {
        type: Boolean,
        default: false
      },
      isInverted: {
        type: Boolean,
        default: false
      },
      isInvalid: {
        type: Boolean,
        default: false
      },
      helperText: {
        type: String,
        default: ''
      },
      inputWrapperClass: {
        type: String
      },
      classOverride: {
        type: String,
        default: ''
      },
      label: {
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
    display: block;
    position: relative;

    :global .icon--search-path {
      fill: $color-bg-main-darker;
    }
  }

  .input {
    overflow: hidden;
    border: none;
    padding: 0;

    &.is-inverted {
      text-align: right;
    }

    &::placeholder {
      color: $color-text-main-lighter;
    }
  }

  .input-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid $color-border-main-light;
    padding: 5px 14px;
    border-radius: 4px;

    &.is-focused {
      border: 1px solid $color-border-primary-highlight;
      box-shadow: 0 0 0 1px $color-border-primary-highlight inset;
    }

    &.is-invalid {
      border-color: $color-border-warning;
    }

    &.is-inverted {
      flex-direction: row-reverse;
    }
  }

  .icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sub-text {
    position: absolute;
    display: block;
    font-size: 12px;
    line-height: 16px;
    padding-top: 5px;
    color: $color-text-main-light;

    &.is-invalid {
      color: $color-border-warning;
    }
  }
</style>
