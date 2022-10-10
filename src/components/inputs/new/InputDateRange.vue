<template>
  <div
    :class="[
      $style.container,
      { [$style.dark]: dark, [$style.disabled]: disabled }
    ]"
  >
    <div v-if="labelFrom || labelTo" :class="$style.labels">
      <label :class="$style.label">{{ labelFrom }}</label>
      <label :class="$style.label">{{ labelTo }}</label>
    </div>
    <div
      :class="[
        $style.wrapper,
        wrapperClass,
        {
          [$style.focused]: isFocused,
          [$style.error]: error,
          [$style.disabled]: disabled,
          [$style.transparent]: transparent
        }
      ]"
    >
      <div :class="[$style.box, { [$style.focused]: isFocused }]">
        <input
          ref="input"
          v-model.lazy="dateFromInput"
          type="text"
          :class="[
            $style.input,
            {
              [$style.disabled]: disabled,
              [$style.focused]: isFocused,
              [$style.error]: error
            }
          ]"
          placeholder="dd.mm.yyyy"
          :disabled="disabled"
          :readonly="readonly"
          @input="$emit('update', $event.target.value)"
          @focus="onInputFocus"
          @blur="onInputBlur"
        />
      </div>
      <div :class="[$style.box, { [$style.focused]: isFocused }]">
        <input
          ref="input"
          v-model.lazy="dateToInput"
          type="text"
          :class="[
            $style.input,
            {
              [$style.disabled]: disabled,
              [$style.focused]: isFocused,
              [$style.error]: error
            }
          ]"
          placeholder="dd.mm.yyyy"
          :disabled="disabled"
          :readonly="readonly"
          @input="$emit('update', $event.target.value)"
          @focus="onInputFocus"
          @blur="onInputBlur"
        />
      </div>
      <div
        v-show="calendar"
        :class="[$style.box, { [$style.focused]: isFocused }]"
      >
        <VPopover
          :popover-class="$style.popover"
          :open.sync="isDatePickerOpen"
          placement="bottom"
        >
          <template #popover>
            <DateRange
              :start-date="dateFromSync"
              :end-date="dateToSync"
              custom-class="date-theme-light date-input-default-light date-header-light date-range-picker"
              @start-date:update="onStartDateUpdate"
              @end-date:update="onEndDateUpdate"
              @close="closeDatePicker"
            />
          </template>
          <div :class="$style.calendar">
            <IconCalendar :class="$style.icon" />
          </div>
        </VPopover>
      </div>
    </div>
    <span
      :class="[$style.message, $style.messageFrom, { [$style.error]: error }]"
    >
      {{ messageFrom }}
    </span>
    <span
      :class="[$style.message, $style.messageTo, { [$style.error]: error }]"
    >
      {{ messageTo }}
    </span>
  </div>
</template>

<script lang="ts">
  import {
    Vue,
    Component,
    Prop,
    Emit,
    Ref,
    PropSync
  } from 'vue-property-decorator';
  import { format, parse, isValid, isBefore, isAfter } from 'date-fns';
  import { VPopover } from 'v-tooltip';

  import IconCalendar from '@/assets/images/icons/calendar.svg';
  import DatePicker from '@/components/core/DatePicker.vue';
  import DateRange from '@/components/core/DateRange.vue';

  @Component({
    inheritAttrs: false,
    model: {
      event: 'update'
    },
    components: {
      DateRange,
      DatePicker,
      IconCalendar,
      VPopover
    }
  })
  export default class InputDateRange extends Vue {
    @PropSync('dateFrom', {
      type: Date,
      default: null
    })
    dateFromSync: Date;

    @PropSync('dateTo', {
      type: Date,
      default: null
    })
    dateToSync: Date;

    @Prop({
      type: String,
      default: 'text'
    })
    readonly type: string;

    @Prop({
      type: Boolean
    })
    readonly dark: boolean;

    @Prop({
      type: Boolean
    })
    readonly error: boolean;

    @Prop({
      type: Boolean
    })
    readonly disabled: boolean;

    @Prop({
      type: Boolean
    })
    readonly readonly: boolean;

    @Prop({
      type: Boolean
    })
    readonly transparent: boolean;

    @Prop({
      type: Boolean
    })
    readonly clearable: boolean;

    @Prop({
      type: Boolean
    })
    readonly hideInput: boolean;

    @Prop({
      type: String,
      default: ''
    })
    readonly messageFrom: string;

    @Prop({
      type: String,
      default: ''
    })
    readonly messageTo: string;

    @Prop({
      type: String,
      default: ''
    })
    readonly labelFrom: string;

    @Prop({
      type: String,
      default: ''
    })
    readonly labelTo: string;

    @Prop({
      type: String,
      default: ''
    })
    readonly placeholder: string;

    @Prop({
      type: [String, Array]
    })
    readonly inputClass: string | string[];

    @Prop({
      type: [String, Array]
    })
    readonly wrapperClass: string | string[];

    @Prop({
      type: Boolean
    })
    readonly calendar: boolean;

    @Ref('input')
    readonly inputElement: HTMLInputElement;

    isFocused = false;

    isDatePickerOpen = false;

    get dateFromInput() {
      return this.dateFromFormatted;
    }

    set dateFromInput(date: string) {
      if (!date) {
        if (this.clearable) {
          this.dateFromSync = null;
        }
        return;
      }

      const parsedDate = parse(date, 'dd.MM.yyyy', new Date());

      if (isValid(parsedDate)) {
        this.dateFromSync = isAfter(parsedDate, this.dateToSync)
          ? this.dateToSync
          : parsedDate;
      }
    }

    get dateToInput() {
      return this.dateToFormatted;
    }

    set dateToInput(date: string) {
      if (!date) {
        if (this.clearable) {
          this.dateToSync = null;
        }
        return;
      }

      const parsedDate = parse(date, 'dd.MM.yyyy', new Date());

      if (isValid(parsedDate)) {
        this.dateToSync = isBefore(parsedDate, this.dateFromSync)
          ? this.dateFromSync
          : parsedDate;
      }
    }

    get dateFromFormatted() {
      if (!this.dateFromSync) {
        return '';
      }

      return format(this.dateFromSync, 'dd.MM.yyyy');
    }

    get dateToFormatted() {
      if (!this.dateToSync) {
        return '';
      }

      return format(this.dateToSync, 'dd.MM.yyyy');
    }

    onStartDateUpdate(startDate: Date) {
      this.dateFromSync = startDate;
    }

    onEndDateUpdate(endDate: Date) {
      this.dateToSync = endDate;
    }

    closeDatePicker() {
      this.isDatePickerOpen = false;
    }

    @Emit('focus')
    onInputFocus() {
      this.isFocused = true;

      return true;
    }

    @Emit('blur')
    onInputBlur() {
      this.isFocused = false;

      return true;
    }

    async $focus() {
      await this.$nextTick();
      this.inputElement.focus();
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  $label-color-light: $color-text-main-light;
  $label-color-dark: $color-text-main-lighter;

  $helper-text-color-light: $color-text-main-light;
  $helper-text-color-dark: $color-text-main-lighter;

  $border-color-light: $color-border-main-light;
  $border-color-dark: $color-border-primary-mid;

  $hover-border-color-light: $color-border-primary-light;
  $hover-border-color-dark: #32465d;

  $focus-border-color-light: #2367ba;
  $focus-border-color-dark: $color-border-light;

  $text-color-light: $color-text-main;
  $text-color-dark: $color-border-light;

  $error-color: $color-warning;
  $disabled-bg-color-light: $color-bg-main-light;
  $disabled-color: $color-text-main-light;

  $disabled-bg-color-dark: #444d56;

  $icon-color-light: $color-gray-50;
  $icon-color-hover-light: $color-primary-highlight;

  $icon-color-dark: $color-text-main-mild-light;
  $icon-color-hover-dark: $color-white;

  .label {
    display: inline-block;

    font-size: 12px;
    line-height: 16px;

    margin-bottom: 4px;

    color: $label-color-light;
  }

  .container {
    position: relative;
  }

  .wrapper {
    @include row;

    background-color: $color-bg-light;

    border: 1px solid $border-color-light;
    box-sizing: border-box;
    border-radius: 4px;

    height: 36px;
    color: $text-color-light;

    &:not(.disabled) {
      &:hover {
        @include hard-shadow($hover-border-color-light, 3px);

        .calendar {
          background-color: $hover-border-color-light;
        }

        .icon {
          color: $icon-color-hover-light;
        }
      }

      &.transparent {
        background-color: transparent;
      }
    }

    &.focused {
      border: 2px solid $focus-border-color-light;
    }

    &.error {
      border: 1px solid $error-color;
    }

    &.error.focused {
      border: 2px solid $error-color;
    }

    &.disabled {
      pointer-events: none;
      background-color: $disabled-bg-color-light;
      border-color: transparent;
    }
  }

  .icon {
    color: $icon-color-light;
  }

  .input {
    @include input;

    width: 100%;

    flex: 1;

    line-height: 20px;

    color: $text-color-light;

    &.disabled {
      color: $disabled-color;
    }
  }

  .message {
    position: absolute;
    display: block;
    margin-top: 2px;
    font-size: 12px;
    line-height: 16px;

    color: $helper-text-color-light;

    &-from {
      left: 0;
    }

    &-to {
      left: calc(50% - 16px);
    }

    &.error {
      color: $error-color;
    }
  }

  .dark {
    .label {
      color: $label-color-dark;
    }

    .wrapper {
      background-color: $color-bg-primary-darker;
      color: $text-color-dark;
      border: 1px solid $border-color-dark;

      &:not(.disabled) {
        &:hover {
          @include hard-shadow($hover-border-color-dark, 3px);

          .calendar {
            background-color: $hover-border-color-dark;
          }

          .icon {
            color: $icon-color-hover-dark;
          }
        }

        &.transparent {
          background-color: transparent;
        }
      }

      &.focused {
        border: 2px solid $focus-border-color-dark;
      }

      &.disabled {
        background-color: $disabled-bg-color-dark;
        border-color: transparent;

        .box + .box {
          border-color: $color-border-primary-dark;
        }
      }

      &.error {
        border: 1px solid $error-color;
      }

      &.error.focused {
        border: 2px solid $error-color;
      }
    }

    .box + .box {
      border-color: $border-color-dark;
    }

    .input {
      color: $text-color-dark;
    }

    .message {
      color: $helper-text-color-dark;

      &.error {
        color: $error-color;
      }
    }

    .icon {
      color: $icon-color-dark;
    }
  }

  .box {
    @include flex-center;

    flex: 1;

    padding: 7px 15px;

    &:last-child {
      flex: 0 0 40px;
      padding: 3px 5px;
    }

    &.focused {
      padding-top: 6px;
      padding-bottom: 6px;

      &:first-child {
        padding-left: 14px;
      }

      &:nth-child(2) {
        padding-right: 14px;
      }

      &:last-child {
        padding-top: 2px;
        padding-bottom: 2px;
        padding-right: 3px;
      }
    }
  }

  .box + .box {
    border-left: 1px solid $color-border-main-light;
  }

  .calendar {
    padding: 2px;
    border-radius: 2px;
    height: 28px;
    cursor: pointer;
  }

  .labels {
    padding-right: 40px;
    @include row;

    label {
      margin-left: 4px;
      flex: 1;
    }
  }

  .popover[x-placement^='bottom'] {
    margin-top: 12px;
  }
</style>
