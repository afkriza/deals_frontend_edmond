<template>
  <div :class="$style.container">
    <label v-if="label" :class="$style.label">{{ label }}</label>
    <div :class="[$style.group, { [$style.vertical]: vertical }]">
      <InputRadio
        v-for="option in options"
        :key="option[valueAttr]"
        v-model="modelValue"
        :class="$style.radio"
        :value="option[valueAttr]"
        :label="option[labelAttr]"
      />
    </div>
    <span :class="[$style.message, { [$style.error]: error }]">
      {{ message }}
    </span>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, ModelSync } from 'vue-property-decorator';
  import InputRadio from '@/components/inputs/new/InputRadio.vue';

  interface Option {
    value: string;
    label: string;
  }

  @Component({
    components: { InputRadio }
  })
  export default class InputRadioGroup extends Vue {
    @Prop({
      type: String,
      default: ''
    })
    readonly label: string;

    @Prop({
      type: String,
      default: ''
    })
    readonly message: string;

    @Prop({
      type: Boolean
    })
    readonly error: boolean;

    @Prop({
      type: Array,
      required: true
    })
    readonly options: Option[];

    @ModelSync('value', 'change', {
      type: String
    })
    readonly modelValue: string;

    @Prop({
      type: Boolean
    })
    readonly vertical: boolean;

    @Prop({
      type: String,
      default: 'label'
    })
    readonly labelAttr: string;

    @Prop({
      type: String,
      default: 'value'
    })
    readonly valueAttr: string;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    position: relative;
  }

  .group {
    @include row;
    gap: 16px;

    &.vertical {
      @include column;
      gap: 0;
    }
  }

  .radio {
    height: 36px;
  }

  .label {
    display: inline-block;

    font-size: 12px;
    line-height: 16px;

    margin-bottom: 4px;

    color: $color-text-main-light;
  }

  .message {
    position: absolute;
    display: block;
    margin-top: 2px;
    font-size: 12px;
    line-height: 16px;

    white-space: nowrap;

    color: $color-text-main-light;

    &.error {
      color: $color-warning;
    }
  }
</style>
