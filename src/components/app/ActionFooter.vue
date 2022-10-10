<template>
  <footer :class="[$style.footer, { [$style.centered]: centered }]">
    <component
      v-if="hasAdditionalButton"
      :is="secondaryButtonType"
      :class="[$style.button, $style.action, $style.secondary]"
      :theme="secondaryActionButtonTheme"
      :disabled="additionalButtonDisabled"
      @click="onSecondaryActionClick"
    >
      {{ additionalButtonLabel }}
    </component>

    <button-regular
      v-if="isMultiStateButton"
      type="submit"
      :class="[
        $style.button,
        {
          [$style.done]: done
        }
      ]"
      :disabled="disabled"
      :isLoading="loading"
      @click="onPrimaryActionClick"
    >
      <span v-if="done">
        <!-- @svg("checkmark") -->
        Done
      </span>
      <span v-else>{{ label }}</span>
    </button-regular>

    <button-regular
      v-else
      :class="[$style.button, $style.action]"
      :disabled="disabled"
      @click="onPrimaryActionClick"
    >
      {{ label }}
    </button-regular>
  </footer>
</template>

<script>
  import Spinner from 'components/core/Spinner';
  import ButtonFlat from 'components/buttons/ButtonFlat';
  import ButtonRegular from 'components/buttons/ButtonRegular';
  import ButtonOutline from 'components/buttons/ButtonOutline';

  import { PRIMARY, SECONDARY } from 'constants/button';

  export default {
    components: {
      ButtonFlat,
      ButtonOutline,
      ButtonRegular,
      Spinner
    },

    props: {
      label: {
        type: String,
        required: true
      },

      secondaryButtonType: {
        type: [String, Object],
        default() {
          return ButtonOutline;
        }
      },

      disabled: {
        type: Boolean,
        default: false
      },

      additionalButtonDisabled: {
        type: Boolean,
        default: false
      },

      isMultiStateButton: {
        type: Boolean,
        default: false
      },

      done: {
        type: Boolean,
        default: false
      },

      loading: {
        type: Boolean,
        default: false
      },

      active: {
        type: Boolean,
        default: true
      },

      hasAdditionalButton: {
        type: Boolean,
        default: false
      },

      additionalButtonLabel: {
        type: String
      },

      isAdditionalWarningButton: {
        type: Boolean,
        default: false
      },

      centered: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      secondaryActionButtonTheme() {
        return this.isAdditionalWarningButton ? SECONDARY : PRIMARY;
      }
    },

    methods: {
      onPrimaryActionClick() {
        this.$emit('primaryAction:click');
      },

      onSecondaryActionClick() {
        this.$emit('secondaryAction:click');
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  $label-width: 210px;

  .footer {
    position: fixed;
    z-index: $z-toolbar;
    bottom: 20px;
    display: flex;
    align-items: center;
    right: 5%;

    &.centered {
      @include horizontal-center;
    }
  }

  .action {
    min-width: 170px;

    &:not(:last-child) {
      margin-right: 20px;
    }
  }

  .button {
    @include center-svg-icon;

    min-width: 170px;
    min-height: 40px;

    // TODO: Adjust ButtonFlat component
    &.secondary {
      background-color: $color-bg-light;
    }
  }

  .done {
    background-color: $color-bg-success;
  }
</style>
