<template>
  <base-toolbar :class="$style.toolbar">
    <div :class="$style.content">
      <slot />
    </div>
    <component
      :is="secondaryButtonType"
      :class="[$style.button, buttonClass]"
      :isInverted="isSecondaryButtonInverted"
      :theme="secondaryButtonTheme"
      @click="onSecondaryButtonClick"
    >
      {{ secondaryButtonText }}
    </component>
    <component
      :is="primaryButtonType"
      :class="[$style.button, buttonClass]"
      :isInverted="isPrimaryButtonInverted"
      :isLoading="isLoading"
      :disabled="isDisabled || isLoading"
      @click="onPrimaryButtonClick"
    >
      {{ primaryButtonText }}
    </component>
  </base-toolbar>
</template>

<script>
  import { PRIMARY, TERTIARY } from 'constants/button';

  import BaseToolbar from 'components/core/BaseToolbar';
  import ButtonOutline from 'components/buttons/ButtonOutline';
  import ButtonRegular from 'components/buttons/ButtonRegular';

  export default {
    components: {
      BaseToolbar,
      ButtonOutline,
      ButtonRegular
    },

    props: {
      primaryButtonType: {
        type: [String, Object],
        default() {
          return ButtonRegular;
        }
      },

      secondaryButtonType: {
        type: [String, Object],
        default() {
          return ButtonOutline;
        }
      },

      isPrimaryButtonInverted: {
        type: Boolean,
        default: true
      },

      isSecondaryButtonInverted: {
        type: Boolean,
        default: true
      },

      buttonClass: {
        type: String,
        default: null
      },

      isLoading: {
        type: Boolean,
        default: false
      },

      isDisabled: {
        type: Boolean,
        default: false
      },

      primaryButtonText: {
        type: String,
        required: true
      },

      secondaryButtonText: {
        type: String,
        required: true
      }
    },

    computed: {
      secondaryButtonTheme() {
        return this.secondaryButtonType === ButtonOutline ? TERTIARY : PRIMARY;
      },

      primaryButtonAttrs() {
        return {
          class: [this.$style.button, this.buttonClass],
          isInverted: this.isPrimaryButtonInverted,
          isLoading: this.isLoading,
          disabled: this.isDisabled || this.isLoading
        };
      },

      primaryButtonEvents() {
        return {
          click: this.onPrimaryButtonClick
        };
      }
    },

    methods: {
      onPrimaryButtonClick() {
        this.$emit('click:primary');
      },

      onSecondaryButtonClick() {
        this.$emit('click:secondary');
      }
    },

    data() {
      return {
        TERTIARY
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .toolbar {
    display: flex;
    align-items: center;

    padding-right: 40px;
  }

  .content {
    display: flex;
    justify-content: flex-end;
    flex: 1;
    height: 100%;
  }

  .button {
    width: 176px;
    height: 48px;

    margin-right: 8px;
  }
</style>
