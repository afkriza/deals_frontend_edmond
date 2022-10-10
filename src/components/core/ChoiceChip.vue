<template>
  <div
    :class="[
      $style.chip,
      $style[theme],
      {
        [$style.isActive]: value,
        [$style.inverse]: inverse
      }
    ]"
    @click="onClick"
  >
    <span>{{ label }}</span>
    <div :class="$style.checkmark" v-if="withCheckmark && value">
      <IconCheck />
    </div>
  </div>
</template>

<script>
  import IconCheck from '@/assets/images/icons/check.svg';

  export default {
    components: {
      IconCheck
    },
    props: {
      label: {
        type: String,
        required: true
      },

      value: {
        type: Boolean,
        required: true
      },

      withCheckmark: {
        type: Boolean,
        default: false
      },

      inverse: {
        type: Boolean,
        default: false
      },

      theme: {
        type: String,
        default: ''
      }
    },

    methods: {
      onClick() {
        this.$emit('input', !this.value);
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .chip {
    @include flex-center;
    height: 28px;

    font-size: 12px;
    font-weight: bold;
    line-height: 16px;

    display: flex;
    padding: 0 12px;

    border-width: 1px;
    border-style: solid;
    border-radius: 14px;

    vertical-align: top;
    color: $color-text-main;
    background-color: $color-bg-light;

    cursor: pointer;

    white-space: nowrap;

    &.is-active {
      color: $color-text-light;
      background-color: $color-bg-primary-mid;
      border-color: $color-border-primary-mid;
    }

    &.primary {
      color: $color-text-primary;
      border-color: $color-border-primary;

      &.is-active {
        color: $color-text-light;
        background-color: $color-bg-primary;
        border-color: $color-border-primary;
      }

      &:not(.is-active):hover {
        background-color: $color-bg-primary-dimmed;
      }
    }

    &.inverse {
      color: $color-text-light;
      background-color: transparent;
      border-color: $color-border-light;

      &.is-active {
        color: $color-text-primary;
        background-color: $color-bg-light;
      }
    }
  }

  /* stylelint-disable selector-max-type */
  .checkmark {
    height: 24px;
    width: 24px;
    margin-left: 5px;
  }

  /* stylelint-enable selector-max-type */
</style>
