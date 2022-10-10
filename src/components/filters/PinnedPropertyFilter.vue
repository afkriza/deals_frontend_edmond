<template>
  <div :class="$style.wrapper">
    <PinnedFilter
      :class="$style.filter"
      :filter="filter"
      @filter:update="onFilterUpdate"
    >
      <template #icon>
        <PropertyIcon />
      </template>
    </PinnedFilter>
  </div>
</template>

<script>
  import PropertyIcon from '@/assets/images/icons/hotels.svg';
  import { SelectFilter } from '@/components/filters/models/SelectFilter.model';
  import PinnedFilter from '@/components/filters/PinnedFilter';

  // This is a component's interface, each options object needs to have props: id, name and available
  const isValidObject = obj =>
    ['id', 'name', 'available'].every(prop => prop in obj);

  export default {
    name: 'PinnedPropertyFilter',
    components: {
      PinnedFilter,
      PropertyIcon
    },
    inheritAttrs: false,
    props: {
      property: {
        type: Object,
        required: true,
        validator: isValidObject
      },
      options: {
        type: Array,
        required: true,
        validator(arr) {
          return arr.every(isValidObject);
        }
      }
    },
    computed: {
      filter() {
        return new SelectFilter({
          id: 'property',
          name: '',
          options: this.options,
          type: 'select',
          value: this.property,
          defaultValue: this.property
        });
      }
    },

    methods: {
      onFilterUpdate(filter) {
        this.$emit('update:property', filter.value);
        this.$emit('update:filter');
        this.$emit('refresh:sidebar');
      }
    }
  };
</script>

<style lang="scss" module>
  .wrapper {
    display: flex;
  }

  .filter {
    flex: 1;

    min-width: 0;
  }

  .icon {
    margin-right: 8px;
  }
</style>
