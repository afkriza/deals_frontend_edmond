<template>
  <InputBase
    ref="input"
    :dark="dark"
    :label="label"
    :readonly="readonly"
    :message="message"
    :placeholder="placeholder"
    :disabled="disabled"
    :error="error"
    :input-class="[...inputClass, $style.input]"
    :wrapper-class="wrapperClass"
    :value="_value"
    :transparent="transparent"
    @update="onUpdate"
    @change="onChange"
  >
    <template v-if="!hideControls" #prepend>
      <ButtonFlat
        type="button"
        :class="[$style.button, { [$style.dark]: dark }]"
        @click="decrement"
      >
        <IconMinus />
      </ButtonFlat>
    </template>
    <template v-if="!hideControls" #append>
      <ButtonFlat
        type="button"
        :class="[$style.button, { [$style.dark]: dark }]"
        @click="increment"
      >
        <IconPlus />
      </ButtonFlat>
    </template>
  </InputBase>
</template>

<script lang="ts">
  import { Component, Emit, Prop, Ref } from 'vue-property-decorator';
  import InputBase from '@/components/inputs/new/InputBase.vue';
  import IconMinus from '@/assets/images/icons/Misc/ic-16-minus.svg';
  import IconPlus from '@/assets/images/icons/Misc/ic-16-plus.svg';
  import Button from '@/components/core/Button.vue';
  import ButtonFlat from '@/components/buttons/ButtonFlat.vue';
  import { formatPriceNumber } from '@/utils/format';
  import { mixins } from 'vue-class-component';
  import InputMixin from '@/components/inputs/new/InputMixin.vue';

  @Component({
    components: { ButtonFlat, Button, InputBase, IconMinus, IconPlus }
  })
  export default class InputNumber extends mixins(InputMixin) {
    @Prop({
      type: Number
    })
    readonly value: number;

    @Prop({
      default: null
    })
    readonly defaultValue;

    @Prop({
      type: Boolean
    })
    readonly hideControls: boolean;

    @Prop({
      type: Boolean
    })
    readonly decimal: boolean;

    @Ref('input')
    readonly inputBase: InputBase;

    get _value() {
      if (this.value == null) {
        return '';
      }

      return formatPriceNumber(
        this.decimal ? this.value.toFixed(2) : this.value
      );
    }

    extractValue(value: string) {
      const rawValue = value.replace(/[^-0-9]+/g, '');

      if (!rawValue) {
        this.$emit('update', null);
      }

      const number = Number(rawValue);

      return !isNaN(number)
        ? this.decimal
          ? number / 100
          : number
        : this.defaultValue;
    }

    @Emit('update')
    onUpdate(value: string) {
      return this.extractValue(value);
    }

    @Emit('change')
    onChange(e) {
      // Needed to keep the input value in sync
      this.inputBase.$forceUpdate();
      return this.extractValue(e.target.value);
    }

    @Emit('update')
    @Emit('change')
    decrement() {
      return this.value - 1;
    }

    @Emit('update')
    @Emit('change')
    increment() {
      return this.value + 1;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .input {
    text-align: center;
    padding: 0 !important;
  }

  .currency {
    @include flex-center($is-inline: true);
    justify-content: flex-end;

    width: 26px;
  }

  .button {
    @include flex-center;
    padding: 0 5px;
    margin: 3px;
    color: $color-text-main-light;
    border-radius: 2px;

    &:hover {
      color: $color-text-primary;
      background-color: $color-bg-primary-light;
    }

    &.dark {
      &:hover {
        color: $color-text-light;
        background-color: $color-bg-primary-mid;
      }
    }
  }
</style>
