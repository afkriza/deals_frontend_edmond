<template>
  <VPopover :open.sync="open">
    <template #popover>
      <DatePicker :date="value" @date:update="onDateUpdate" />
    </template>
    <InputBase
      :dark="dark"
      :label="label"
      :message="message"
      :placeholder="placeholder"
      :disabled="disabled"
      :error="error"
      :input-class="[...inputClass, $style.input]"
      :wrapper-class="wrapperClass"
      :value="_value"
      readonly
      v-on="$listeners"
    >
      <template #append>
        <ButtonFlat :class="$style.button">
          <IconCalendar />
        </ButtonFlat>
      </template>
    </InputBase>
  </VPopover>
</template>

<script lang="ts">
  import { Component, Emit, Prop } from 'vue-property-decorator';
  import { VPopover } from 'v-tooltip';
  import InputBase from '@/components/inputs/new/InputBase.vue';
  import IconCalendar from '@/assets/images/icons/calendar.svg';
  import ButtonFlat from '@/components/buttons/ButtonFlat.vue';
  import DatePicker from '@/components/core/DatePicker.vue';
  import { formatDate } from '@/utils/format';
  import { mixins } from 'vue-class-component';
  import InputMixin from '@/components/inputs/new/InputMixin.vue';

  @Component({
    components: { DatePicker, ButtonFlat, InputBase, IconCalendar, VPopover }
  })
  export default class InputDate extends mixins(InputMixin) {
    @Prop({
      type: Date
    })
    readonly value: Date;

    open = false;

    get _value() {
      return formatDate(this.value, 'dd.MM.yyyy');
    }

    @Emit('update')
    onDateUpdate(newDate: Date) {
      this.open = false;

      return newDate;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .input {
    cursor: pointer;
  }

  .button {
    @include flex-center;
    padding: 0 5px;
    margin: 3px;
    color: $color-text-main-light;

    &:hover {
      color: $color-text-primary;
      background-color: $color-bg-primary-light;
    }
  }
</style>
