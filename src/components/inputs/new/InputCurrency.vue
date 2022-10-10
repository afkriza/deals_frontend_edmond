<template>
  <InputBase
    v-model="_value"
    type="text"
    :dark="dark"
    :label="label"
    :readonly="readonly"
    :message="message"
    :placeholder="placeholder"
    :disabled="disabled"
    :error="error"
    :input-class="[...inputClass, $style.input]"
    :wrapper-class="wrapperClass"
    :transparent="transparent"
    @change="onInputChange"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
  >
    <template #prepend="{ isFocused }">
      <span :class="[$style.currency, { [$style.focused]: isFocused }]">{{
        currencySymbol
      }}</span>
    </template>
  </InputBase>
</template>

<script lang="ts">
  import { Component, Prop } from 'vue-property-decorator';
  import InputBase from '@/components/inputs/new/InputBase.vue';
  import { formatPriceNumber } from '@/utils/format';
  import { mixins } from 'vue-class-component';
  import InputMixin from '@/components/inputs/new/InputMixin.vue';

  @Component({
    components: { InputBase }
  })
  export default class InputCurrency extends mixins(InputMixin) {
    @Prop({
      type: String,
      default: '€'
    })
    readonly currencySymbol: string;

    @Prop({
      type: Number
    })
    readonly value: number;

    @Prop({
      type: Boolean
    })
    readonly decimal: boolean;

    @Prop({
      type: Boolean
    })
    readonly clearable: boolean;

    get _value() {
      if (this.value === null) {
        return null;
      }

      return formatPriceNumber(
        this.decimal ? this.value.toFixed(2) : this.value
      );
    }

    set _value(value: string) {
      if (value === '') {
        this.$emit('update', this.clearable ? null : this.value);
        return;
      }

      const number = Number(value.replace(/[^0-9]+/g, ''));

      if (this.decimal) {
        this.$emit('update', number / 100);
      } else {
        this.$emit('update', number);
      }
    }

    onInputChange(e) {
      const value = e.target.value;

      if (value === '') {
        this.$emit('change', this.clearable ? null : this.value);
        return;
      }

      const number = Number(value.replace(/[^0-9.]+/g, ''));

      this.$emit('change', number);
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .input {
    text-align: right;
  }

  .currency {
    @include flex-center($is-inline: true);
    justify-content: flex-end;

    color: $color-text-main-light;

    width: 26px;

    // compensate for focus border
    &.focused {
      width: 25px;
    }
  }
</style>
