<template>
  <button
    :class="[
      $style.button,
      buttonThemeOverride,
      {
        [buttonInvertedOverride]: isInverted,
        [buttonLoadingOverride]: isLoading
      }
    ]"
    v-on="$listeners"
  >
    <Spinner v-if="isLoading" :class="[$style.spinner, spinnerOverride]" />
    <slot v-else />
  </button>
</template>

<script>
  import Spinner from 'components/core/Spinner';

  import { themes } from 'enums/button';
  import { PRIMARY } from 'constants/button';

  export default {
    components: {
      Spinner
    },
    props: {
      buttonStyleOverride: {
        type: Object,
        default() {
          return {};
        }
      },
      theme: {
        type: String,
        default: PRIMARY,
        validator(value) {
          return Object.keys(themes).includes(value);
        }
      },
      isLoading: {
        type: Boolean,
        default: false
      },
      isInverted: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      buttonThemeOverride() {
        return this.buttonStyleOverride[themes[this.theme]];
      },
      buttonInvertedOverride() {
        return this.buttonStyleOverride.inverted || '';
      },
      buttonLoadingOverride() {
        return this.buttonStyleOverride.loading || '';
      },
      spinnerOverride() {
        return this.buttonStyleOverride.spinner || '';
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  $button-border-radius: $base-border-radius;

  .button {
    border-radius: $button-border-radius;

    text-transform: uppercase;
    text-align: center;

    white-space: nowrap;

    font-size: 14px;
    font-weight: bold;
    line-height: 1.43;

    cursor: pointer;

    outline: none;

    &:disabled {
      pointer-events: none;
    }
  }

  .spinner {
    margin: 0 auto;
  }
</style>
