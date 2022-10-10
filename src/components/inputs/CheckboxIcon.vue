<template>
  <label :class="$style.container">
    <checkbox-field
      v-bind="$attrs"
      v-on="$listeners"
      :class="$style.checkboxField"
      :labelClass="$style.label"
      :condensed="true"
      :reverse="true"
      theme="medium"
    >
      <div v-if="$slots.title" :class="$style.title">
        <slot name="title" />
      </div>
    </checkbox-field>
    <div v-if="$slots.icon" :class="$style.icon">
      <slot name="icon" />
      <div v-if="$slots.message" :class="$style.message">
        <slot name="message" />
      </div>
    </div>
  </label>
</template>

<script>
  import BaseInput from 'components/core/BaseInput';
  import CheckboxField from 'components/core/Checkbox';

  export default {
    name: 'CheckboxIcon',
    inheritAttrs: false,
    components: {
      BaseInput,
      CheckboxField
    },
    model: {
      event: 'update'
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    .checkbox-field {
      flex: 1;

      .label {
        cursor: pointer;
        margin-left: 0;
        margin-right: 8px;
      }
    }
  }

  .title {
    padding: 0 12px;
    font-size: 14px;
    line-height: 20px;
    color: $color-text-main;
  }

  .icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    &:hover .message {
      opacity: 1;
      pointer-events: auto;
    }
  }

  .message {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    top: 200%;
    left: 50%;
    transform: translateX(-50%);
    width: 280px;
  }
</style>
