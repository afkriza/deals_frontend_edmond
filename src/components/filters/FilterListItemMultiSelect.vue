<template>
  <div>
    <FilterListItem
      :active="active"
      :disabled="disabled"
      :indented="indented"
      :title="title"
      :isOpen="isOpen"
      @click="onFilterListItemClick"
    >
      <template #prepend>
        <slot
          name="prepend"
          :active="active"
          :disabled="disabled"
          :indeterminate="indeterminate"
        >
          <Checkbox
            :checked="active"
            :class="$style.checkbox"
            :disabled="disabled"
            :indeterminate="indeterminate"
            theme="secondary"
            @checked:update="onFilterListItemClick"
          />
        </slot>
      </template>
      <template #append>
        <RotationSwitch
          v-if="hasSubOptions"
          :class="$style.rotationSwitch"
          :is-disabled="disabled || isSubMenuDisabled"
          :is-rotated="isSubMenuOpen"
          @click.stop="onSubMenuClick"
        >
          <IconChevronDown />
        </RotationSwitch>
      </template>
    </FilterListItem>
    <template v-if="hasSubOptions">
      <slot v-if="isSubMenuOpen" name="subOptions"></slot>
    </template>
  </div>
</template>

<script lang="ts">
  import { Component, Emit, Model, Prop } from 'vue-property-decorator';
  import Checkbox from '@/components/core/Checkbox.vue';
  import RotationSwitch from '@/components/core/RotationSwitch.vue';
  import IconChevronDown from '@/assets/images/icons/chevron-down-light.svg';
  import FilterListItem from '@/components/filters/FilterListItem.vue';

  @Component({
    name: 'FilterListItemMultiSelect',
    components: { FilterListItem, RotationSwitch, Checkbox, IconChevronDown }
  })
  export default class FilterListItemMultiSelect extends FilterListItem {
    @Model('update:active', {
      type: Boolean,
      required: true
    })
    readonly active: boolean;

    @Prop({
      type: Boolean
    })
    readonly indeterminate: boolean;

    @Prop({
      type: Boolean
    })
    readonly hasSubOptions: boolean;

    @Prop({
      type: Boolean
    })
    readonly isSubMenuDisabled: boolean;

    @Prop({
      type: Boolean,
      default: true
    })
    readonly isOpen: boolean;

    isSubMenuOpen = false;

    @Emit('update:active')
    onFilterListItemClick() {
      return !this.active;
    }

    onSubMenuClick() {
      this.isSubMenuOpen = !this.isSubMenuOpen;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .checkbox {
    margin-right: 12px;
  }

  .rotation-switch {
    cursor: pointer;
    height: 24px;
    margin-left: auto;
  }
</style>
