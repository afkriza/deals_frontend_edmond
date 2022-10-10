<template>
  <div :class="$style.rows">
    <draggable
      v-model="rows"
      :class="$style.rowsDropzone"
      :group="{
        name: 'rowsCategories',
        pull: ['columnsCategories', 'categories'],
        put: ['categories', 'columnsCategories']
      }"
      :drag-class="$style.sortableDrag"
      :ghost-class="$style.ghostPlaceholder"
      @choose="onChose"
      @start="startDrag"
      @end="endDrag"
      @add="onAdd"
    >
      <CategoryTab
        v-for="category in categories"
        :key="category.id"
        placement="row"
        :class="$style.tab"
        :category="category"
        :is-removable="category.id !== 'values'"
        :is-blacklistable="category.id !== 'values'"
        :is-ignore-filters-active="filtersBlacklist.includes(category.id)"
        @ignoreFilters:toggle="onIgnoreFiltersClick(category.id)"
        @granulation:change="category.setGranulation($event)"
        @remove="onRemove"
      />
    </draggable>
    <div v-if="!categories.length" :class="$style.dropPlaceholder">
      Drag and drop categories
    </div>
    <div v-if="categories.length" :class="$style.totalTab">
      <CheckboxField
        :checked="totalChecked"
        :condensed="true"
        :reverse="true"
        @checked:update="toggleTotal"
      >
        <span
          :class="[$style.checkboxLabel, { [$style.checked]: totalChecked }]"
          >Show total</span
        >
      </CheckboxField>
    </div>
  </div>
</template>

<script>
  import CategoryTab from 'components/analytics/CategoryTab';
  import CheckboxField from 'components/core/Checkbox';

  import draggable from 'vuedraggable';

  import instantiate from 'components/analytics/models/instantiate.js';

  export default {
    components: {
      CategoryTab,
      CheckboxField,
      draggable
    },

    props: {
      categories: {
        type: Array,
        default: () => []
      },

      totalChecked: {
        type: Boolean,
        default: false
      },

      filtersBlacklist: {
        type: Array,
        default: () => []
      }
    },

    computed: {
      rows: {
        get() {
          return this.categories;
        },

        set(updatedRows) {
          this.$emit('row:update', updatedRows);
        }
      }
    },

    methods: {
      toggleTotal() {
        this.$emit('total:toggle');
      },

      onAdd() {
        this.rows = this.rows.map(instantiate);
      },

      onRemove(id) {
        this.rows = this.rows.filter(row => row.id !== id);
      },

      onIgnoreFiltersClick(id) {
        this.$emit('ignoreFilters:toggle', id);
      },

      onChose(evt) {
        this.$emit('item:choose', evt.oldIndex);
      },

      startDrag() {
        this.$emit('drag:start');
      },

      endDrag() {
        this.$emit('drag:end');
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .rows-dropzone {
    z-index: 1; // To ensure dropzone is above placeholder
    position: relative;
    height: 100%;
    padding: 0 24px;

    & > * + * {
      margin-top: 10px;
    }
  }

  .rows {
    display: flex;
    flex-direction: column;
  }

  .checkbox-label {
    color: $color-text-main-light;
    transition-property: font-weight, color;
    transition-duration: 0.2s;
    font-weight: bold;

    &.checked {
      color: $color-text-primary;
    }
  }

  .drop-placeholder {
    position: absolute;

    display: inline-block;
    width: 207px;
    margin: 0 24px;
    padding: 14px 15px;

    color: $color-text-main-lighter;
    border-radius: $base-border-radius;
    border: 1px dashed $color-border-main;
  }

  .ghost-placeholder {
    border: {
      style: dashed;
      width: 1px;
    }
    padding-bottom: 0;
    margin-bottom: 10px;

    max-height: 48px;
    height: 100%;

    color: $color-text-primary;
    background-color: $color-bg-primary-dimmed;

    [placement='categories'] {
      display: flex;
    }
  }

  .total-tab {
    display: flex;

    min-width: 125px;

    margin: auto 20px 30px 0;
    padding: 10px 40px;
  }

  // Need to override default behaviour
  .drag-override.sortable-drag {
    // transform: rotate(3deg);
    box-shadow: $tooltip-shadow;
  }
</style>
