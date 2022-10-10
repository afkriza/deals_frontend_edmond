<template>
  <div :class="$style.radioSelect">
    <button
      v-for="option in options"
      :class="[
        { [$style.isSelected]: option === selectedOption },
        $style.option
      ]"
      @click="changeSelected(option)"
    >
      <div v-if="option.icon" v-html="option.icon" :class="$style.icon"></div>
      <span :class="$style.label"> {{ option.label }} </span>
    </button>
  </div>
</template>

<script>
  export default {
    props: {
      options: {
        type: Array,
        required: true
      },
      selectedOption: {
        type: Object
      }
    },
    methods: {
      changeSelected(option) {
        this.$emit('option:click', option);
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  $options-border-radius: $base-border-radius;
  $option-border: 1px solid $color-border-main;

  .radio-select {
    display: flex;
  }

  .option {
    @include button;
    @include svg-color($color-text-main-lighter);
    display: flex;
    align-items: center;
    padding: 3px 24px;
    cursor: pointer;
    color: $color-text-main-lighter;
    border: {
      top: $option-border;
      bottom: $option-border;
      left: $option-border;
    }

    &.is-selected {
      @include svg-color($color-primary);
      color: $color-text-primary;
    }

    &:first-child {
      border-top-left-radius: $options-border-radius;
      border-bottom-left-radius: $options-border-radius;
    }

    &:last-child {
      border-top-right-radius: $options-border-radius;
      border-bottom-right-radius: $options-border-radius;
      border-right: $option-border;
    }
  }

  .icon {
    @include svg-icon();
    margin-right: 6px;
  }

  .label {
    font-size: 12px;
    line-height: 24px;
    text-transform: uppercase;
  }
</style>
