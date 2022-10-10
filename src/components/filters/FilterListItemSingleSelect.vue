<template>
  <FilterListItem
    :active="active"
    :disabled="disabled"
    :indented="indented"
    :title="title"
    @click="onFilterListItemClick"
  >
    <template #prepend>
      <RadioButton
        :class="$style.radio"
        :disabled="disabled"
        :value="active"
        theme="light"
      />
    </template>
  </FilterListItem>
</template>

<script lang="ts">
  import { Component, Model } from 'vue-property-decorator';
  import Checkbox from '@/components/core/Checkbox.vue';
  import RotationSwitch from '@/components/core/RotationSwitch.vue';
  import IconChevronDown from '@/assets/images/icons/chevron-down-light.svg';
  import FilterListItem from '@/components/filters/FilterListItem.vue';
  import RadioButton from '@/components/core/RadioButton.vue';

  @Component({
    name: 'FilterListItemSingleSelect',
    components: {
      RadioButton,
      FilterListItem,
      RotationSwitch,
      Checkbox,
      IconChevronDown
    }
  })
  export default class FilterListItemSingleSelect extends FilterListItem {
    @Model('update:active', {
      type: Boolean,
      required: true
    })
    readonly active: boolean;

    onFilterListItemClick() {
      if (this.active) {
        return;
      }

      this.$emit('update:active', true);
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .checkbox {
    margin-right: 12px;
  }

  .rotation-switch {
    height: 24px;
    margin-left: auto;
  }
</style>
