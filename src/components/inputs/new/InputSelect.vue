<template>
  <VPopover
    :open.sync="open"
    :disabled="disabled"
    :placement="placement"
    :class="$style.trigger"
    :popover-base-class="$style.popover"
    :popover-wrapper-class="$style.wrapper"
    :offset="4"
    :container="false"
  >
    <InputBase
      v-model="search"
      type="text"
      :wrapper-class="$style.wrapper"
      :input-class="[$style.input, { [$style.searchable]: searchable }]"
      :disabled="disabled"
      v-bind="$attrs"
      :readonly="!searchable"
      :dark="dark"
      @update="$emit('search', $event)"
      @focus="onFocus"
      @blur="onLoseFocus"
    >
      <template #append>
        <slot name="append">
          <ArrowDown
            :class="[
              $style.arrow,
              { [$style.disabled]: disabled, [$style.dark]: dark }
            ]"
            :rotated="open"
          />
        </slot>
      </template>
    </InputBase>

    <template #popover>
      <slot
        v-if="searchOptions.length && !isLoading"
        name="dropdown"
        :options="searchOptions"
        :on-option-select="onOptionSelect"
      >
        <DropdownList
          :class="$style.dropdown"
          :items="searchOptions"
          @select="onOptionSelect"
        >
          <template #item="{ item, isHover }">
            <slot name="item" :item="item" :isHover="isHover">
              <span>{{ item[searchBy] }}</span>
            </slot>
          </template>
        </DropdownList>
      </slot>
      <div v-else-if="isLoading">
        <div :class="$style.spinnerWrapper">
          <Spinner :class="$style.spinner" />
        </div>
      </div>
      <div v-else>
        <div :class="$style.noResults">
          <span>No results</span>
        </div>
      </div>
    </template>
  </VPopover>
</template>

<script lang="ts">
  import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
  import { VPopover } from 'v-tooltip';
  import InputBase from '@/components/inputs/new/InputBase.vue';
  import ArrowDown from '@/components/icons/ArrowDown.vue';
  import DropdownList from '@/components/core/DropdownList.vue';
  import { size, filter } from 'lodash';
  import Spinner from '@/components/core/Spinner.vue';

  export interface Option {
    label: string;
    id: string;
  }

  @Component({
    components: { DropdownList, ArrowDown, InputBase, VPopover, Spinner },
    inheritAttrs: false,
    model: {
      event: 'select'
    }
  })
  export default class InputSelect extends Vue {
    @Prop({
      type: Array,
      default: () => []
    })
    readonly options: Option[];

    @Prop({
      type: Boolean
    })
    readonly searchable: boolean;

    @Prop({
      type: Object,
      default: null
    })
    readonly value: Option;

    @Prop({
      type: Boolean
    })
    readonly disabled: boolean;

    @Prop({
      type: String,
      default: 'label'
    })
    readonly searchBy: string;

    @Prop({
      type: String,
      default: 'bottom-end'
    })
    readonly placement: string;

    @Prop({
      type: Boolean
    })
    readonly unselectable: boolean;

    @Prop({
      type: Boolean
    })
    readonly isLoading: boolean;

    @Prop({
      type: Boolean
    })
    readonly dark: boolean;

    search = '';
    open = false;

    get searchOptions() {
      if (this.value?.[this.searchBy] === this.search) {
        return this.options;
      }

      return filter(this.options, option =>
        option?.[this.searchBy]
          .toLowerCase()
          .includes(this.search.toLowerCase())
      );
    }

    @Emit('focus')
    onFocus() {
      if (!this.searchable) {
        return;
      }

      this.search = '';
      this.$emit('search', '');
    }

    onLoseFocus() {
      if (!this.value) {
        return;
      }

      if (!this.search && this.unselectable) {
        return this.removeSelect();
      } else {
        this.search = this.value[this.searchBy];
      }
    }

    get empty() {
      return size(this.options) === 0;
    }

    @Watch('value', { immediate: true })
    onValueChange(newValue: Option) {
      if (!newValue) {
        this.search = '';
        return;
      }

      this.search = newValue[this.searchBy];
    }

    @Emit('select')
    onOptionSelect(option: Option) {
      this.open = false;

      return option;
    }

    @Emit('select')
    removeSelect() {
      return null;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .wrapper {
    cursor: pointer;
  }

  .input:not(.searchable) {
    cursor: pointer;
  }

  .arrow {
    margin: 6px;
    align-self: center;

    color: $color-text-main;

    &.dark {
      color: $color-text-main-mild-light;
    }

    &.disabled {
      color: $color-text-main-light;
    }
  }

  .popover {
    padding: 0;
    min-width: 100%;
    width: auto;
    z-index: $z-dropdown;
  }

  .wrapper {
    margin: 0;
  }

  .trigger {
    position: relative;

    :global(.trigger) {
      display: block;
      width: 100%;
    }
  }

  .dropdown,
  .no-results,
  .spinner-wrapper {
    padding: 8px 0;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    background-color: $color-bg-light;
    max-height: 360px;
    overflow-y: auto;
  }

  .no-results {
    padding-left: 16px;
  }

  .spinner {
    margin: 34px auto;
    border-color: $color-border-primary;
  }
</style>
