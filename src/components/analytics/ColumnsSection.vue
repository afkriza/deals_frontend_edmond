<template>
  <div :class="$style.wrapper">
    <draggable
      :class="$style.columnsDropzone"
      v-model="columns"
      :group="{
        name: 'columnsCategories',
        pull: ['rowsCategories', 'categories'],
        put: ['categories', 'rowsCategories']
      }"
      :dragClass="$style.sortableDrag"
      :ghostClass="$style.ghostPlaceholder"
      @choose="onChose"
      @start="startDrag"
      @end="endDrag"
      @add="onAdd"
    >
      <category-tab
        v-for="category in categories"
        :key="category.id"
        placement="column"
        :class="[$style.tab, $style.dragOverride]"
        :category="category"
        :isIgnoreFiltersActive="filtersBlacklist.includes(category.id)"
        :isRemovable="category.id !== 'values'"
        :isBlacklistable="category.id !== 'values'"
        @ignoreFilters:toggle="onIgnoreFiltersClick(category.id)"
        @granulation:change="category.setGranulation($event)"
        @remove="onRemove"
      />
    </draggable>
    <div v-if="!categories.length" :class="$style.dropPlaceholder">
      Drag and drop categories
    </div>
    <div v-if="withTotals && categories.length" :class="$style.totalTab">
      <checkbox-field
        :checked="totalChecked"
        :condensed="true"
        :reverse="true"
        @checked:update="toggleTotal"
      >
        <span
          :class="[$style.checkboxLabel, { [$style.checked]: totalChecked }]"
          >Show total</span
        >
      </checkbox-field>
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
      },

      withTotals: {
        type: Boolean,
        default: true
      }
    },

    computed: {
      columns: {
        get() {
          return this.categories;
        },

        set(updatedColumns) {
          this.$emit('column:update', updatedColumns);
        }
      }
    },

    methods: {
      toggleTotal() {
        this.$emit('total:toggle');
      },

      onAdd() {
        this.columns = this.columns.map(instantiate);
      },

      onRemove(id) {
        this.columns = this.columns.filter(col => col.id !== id);
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

  .wrapper {
    display: flex;
    position: relative;
  }

  .columns-dropzone {
    position: relative;

    display: flex;
    flex-wrap: wrap;

    width: 100%;
    min-height: 70px; // To compensate for row height
    padding: 0 40px;

    // HACK: due to draggable not registering a custom class here
    /* stylelint-disable selector-max-type */
    > article {
      max-width: 208px;
      width: 100%;
      &:not(:last-child) {
        margin-right: 12px;
      }
      margin-bottom: 5px;
    }

    /* stylelint-enable selector-max-type */
  }

  .checkbox-label {
    font-weight: bold;
    color: $color-text-main-light;
    transition-property: font-weight, color;
    transition-duration: 0.2s;

    &.checked {
      color: $color-text-primary;
    }
  }

  .drop-placeholder {
    position: absolute;
    left: 41px;
    top: 1px;
    cursor: default;

    display: inline-block;
    width: 206px;
    padding: 14px 15px;

    color: $color-text-main-lighter;
    background-color: $color-bg-main-dimmed;
    border-radius: $base-border-radius;
    border: 1px dashed $color-border-main;
  }

  .ghost-placeholder {
    border: {
      style: dashed;
      width: 1px;
    }
    padding-bottom: 0;
    margin-right: 15px;
    margin-bottom: 10px;

    max-height: 48px;
    height: 100%;

    width: 100%;
    max-width: 208px;
    min-width: auto;

    color: $color-text-primary;
    background-color: $color-bg-primary-dimmed;

    [placement='categories'] {
      display: flex;
    }
  }

  .total-tab {
    font-weight: bold;

    display: flex;

    min-width: 125px;
    margin-right: 80px;
    margin-bottom: 11px;
  }

  // Need to override default behaviour
  .drag-override.sortable-drag {
    // transform: rotate(3deg);
    box-shadow: $tooltip-shadow;
  }
</style>
