<template>
  <button
    :class="[
      $style.button,
      { [$style.loading]: loading, [$style.small]: small }
    ]"
    type="button"
    v-on="$listeners"
  >
    <Spinner v-if="loading" :class="$style.spinner" :size="spinnerSize" />
    <slot v-else />
  </button>
</template>

<script>
  import Spinner from '@/components/core/Spinner';

  export default {
    name: 'ButtonBase',
    components: {
      Spinner
    },
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      small: {
        type: Boolean,
        default: false
      },
      destructive: {
        type: Boolean,
        default: false
      },
      dark: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      spinnerSize() {
        return this.small ? '16px' : '18px';
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .button {
    @include flex-center;

    border-radius: 4px;

    text-align: center;

    white-space: nowrap;

    font-weight: bold;
    line-height: 20px;

    outline: none;
    cursor: pointer;

    border: 1px solid transparent;

    padding: 13px;

    &.small {
      padding: 5px;
    }

    transition: background-color 70ms ease-out;

    &.loading,
    &:disabled {
      pointer-events: none;
    }
  }

  .spinner {
    margin: 0 auto;
  }
</style>
