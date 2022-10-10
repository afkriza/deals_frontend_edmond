<template>
  <VPopover
    :open.sync="open"
    :disabled="disabled"
    :placement="placement"
    :class="$style.trigger"
    :popover-base-class="$style.popover"
    :popover-wrapper-class="$style.popoverWrapper"
    :offset="4"
    :container="false"
  >
    <InputBase
      ref="input"
      v-model="search"
      type="text"
      :disabled="disabled"
      :dark="dark"
      :label="label"
      :message="message"
      :placeholder="placeholder"
      :error="error"
      :input-class="[...inputClass, $style.input]"
      :wrapper-class="[
        ...wrapperClass,
        $style.inputWrapper,
        {
          [$style.empty]: empty,
          [$style.focused]: isFocused
        }
      ]"
      :hide-input="
        !searchable || empty || (Boolean(value.length) && !isFocused)
      "
      :readonly="!searchable"
      @click.native="onClick"
      @blur="isFocused = false"
      @focus="onFocus"
    >
      <template v-if="value.length > 0" #prepend>
        <div>
          <InputMultiselectTag
            v-for="tag in value"
            :key="tag[searchBy]"
            :class="$style.tag"
            :text="tag[searchBy]"
            @remove.stop="onTagRemove(tag)"
          />
        </div>
      </template>
      <template #append>
        <span :class="$style.icon">
          <slot name="append">
            <ArrowDown v-show="!disabled" :rotated="open" />
          </slot>
        </span>
      </template>
    </InputBase>

    <template #popover>
      <slot
        v-if="searchOptions.length"
        name="dropdown"
        :options="options"
        :on-option-select="onOptionSelect"
      >
        <DropdownList
          :class="$style.dropdown"
          :items="searchOptions"
          @select="onOptionSelect"
        >
          <template #item="{ item }">
            <slot name="item" :item="item">
              <span>{{ item[searchBy] }}</span>
            </slot>
          </template>
        </DropdownList>
      </slot>
      <div v-else>
        <div :class="$style.noResults">
          <span>No results</span>
        </div>
      </div>
    </template>
  </VPopover>
</template>

<script lang="ts">
  import { Component, Emit, Prop, Ref } from 'vue-property-decorator';
  import { VPopover } from 'v-tooltip';
  import InputBase from '@/components/inputs/new/InputBase.vue';
  import ArrowDown from '@/components/icons/ArrowDown.vue';
  import DropdownList from '@/components/core/DropdownList.vue';
  import { difference, filter, pull, size, differenceBy } from 'lodash';
  import Tag from '@/components/core/Tag.vue';
  import InputMultiselectTag from '@/components/inputs/new/InputMultiselectTag.vue';
  import { mixins } from 'vue-class-component';
  import InputMixin from '@/components/inputs/new/InputMixin.vue';

  interface Option {
    label: string;
    id: string;
  }

  @Component({
    components: {
      InputMultiselectTag,
      Tag,
      DropdownList,
      ArrowDown,
      InputBase,
      VPopover
    },
    model: {
      event: 'select'
    }
  })
  export default class InputMultiselect extends mixins(InputMixin) {
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
      type: Array,
      default: () => []
    })
    readonly value: Option[];

    @Prop({
      type: String,
      default: 'label'
    })
    readonly searchBy: string;

    @Prop({
      type: String,
      default: 'bottom-start'
    })
    readonly placement: string;

    @Ref('input')
    readonly inputBase: InputBase;

    search = '';
    open = false;
    isFocused = false;

    get availableOptions() {
      return differenceBy(this.options, this.value, 'id');
    }

    get searchOptions() {
      return filter(this.availableOptions, option =>
        option[this.searchBy].toLowerCase().includes(this.search.toLowerCase())
      );
    }

    get empty() {
      return size(this.availableOptions) === 0;
    }

    onClick() {
      this.isFocused = true;
      this.inputBase.$focus();
    }

    @Emit('select')
    onTagRemove(tag: Option) {
      return [...pull(this.value, tag)];
    }

    @Emit('select')
    onOptionSelect(option: Option) {
      return [...this.value, option];
    }

    @Emit('focus')
    onFocus() {
      return;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .input-wrapper {
    @include column;
    position: relative;
    cursor: pointer;
    padding: 5px 18px 0 8px;

    &.empty {
      pointer-events: none;
    }
  }

  .input {
    cursor: text;
    padding-left: 8px;
    margin-bottom: 6px;
  }

  .focused,
  .input-wrapper:active {
    .icon {
      right: 7px;
      top: 7px;
    }
  }

  .icon {
    position: absolute;
    right: 8px;
    top: 8px;
    align-self: center;
  }

  .popover {
    padding: 0;
    min-width: 100%;
    width: auto;
    z-index: $z-dropdown;
  }

  .trigger {
    position: relative;

    :global(.trigger) {
      display: block;
      width: 100%;
    }
  }

  .tag {
    pointer-events: all;
    margin-right: 6px;
    margin-bottom: 5px;
  }

  .popover-wrapper {
    padding-left: 3px;
    margin: 0;
  }

  .dropdown,
  .no-results {
    padding: 8px 0;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    background-color: $color-bg-light;
    max-height: 360px;
    overflow-y: auto;
  }

  .option {
    margin-right: 4px;
  }

  .icon {
    @include flex-center;
    cursor: pointer;
  }

  .no-results {
    padding-left: 16px;
  }
</style>
