<template>
  <pinned-base-filter
    :value="value.name"
    :label="label"
    :text-after="textAfter"
    v-bind="$attrs"
  >
    <template #icon>
      <slot name="icon" />
    </template>
    <pinned-filter-dropdown-content>
      <template v-for="option in availableOptions">
        <FilterListItemSingleSelect
          v-close-popover
          :key="option.id"
          :title="option.name"
          :active="option.id === value.id"
          @update:active="onRadioButtonInput(option)"
        />
      </template>
    </pinned-filter-dropdown-content>
  </pinned-base-filter>
</template>

<script>
  import PinnedBaseFilter from './PinnedBaseFilter';
  import PinnedFilterDropdownContent from './PinnedFilterDropdownContent';
  import FilterListItemSingleSelect from '@/components/filters/FilterListItemSingleSelect';

  import { VClosePopover } from 'v-tooltip';

  // This is a component's interface, each options object needs to have props: id, name and available
  const isValidObject = obj =>
    ['id', 'name', 'available'].every(prop => prop in obj);

  export default {
    name: 'PinnedRadioSelectFilter',
    components: {
      PinnedFilterDropdownContent,
      PinnedBaseFilter,
      FilterListItemSingleSelect
    },
    model: {
      event: 'change'
    },
    inheritAttrs: false,
    directives: {
      closePopover: VClosePopover
    },
    props: {
      options: {
        type: Array,
        required: true,
        validator(arr) {
          return arr.every(isValidObject);
        }
      },
      value: {
        type: Object,
        required: true,
        validator(obj) {
          return isValidObject(obj);
        }
      },
      label: {
        type: String,
        default: ''
      },
      textAfter: String
    },
    computed: {
      availableOptions() {
        return this.options.filter(({ available }) => available);
      }
    },
    methods: {
      onRadioButtonInput(option) {
        this.$emit('change', option);
      }
    }
  };
</script>
