<template>
  <section>
    <wizard-section-ribbon
      title="Categories"
      instructions="Drag categories to move them or to add them to column or row sections."
      :isOpen="isOpen"
      :type="wizardSectionRibbonTypes.LABELS"
      :offset="{
        horizontal: -85,
        vertical: 100
      }"
      @accordion:toggle="toggleAccordion"
    />
    <div :class="[$style.sectionWrapper, { [$style.isOpen]: isOpen }]">
      <draggable
        :class="$style.sectionDropzone"
        v-model="categories_"
        :group="{
          name: 'categories',
          pull: 'clone',
          put: ['rowsCategories', 'columnsCategories']
        }"
        :sort="false"
        :disabled="disabled"
        filter=".drag-disabled"
        @choose="onChose"
        @start="startDrag"
        @end="endDrag"
        @add="onAdd"
      >
        <div
          v-for="category in categories"
          :key="category.id"
          :class="$style.tabWrap"
        >
          <category-tab
            placement="categories"
            :class="$style.tab"
            :category="category"
            :isRemovable="false"
            :disabled="usedCategories.includes(category.id)"
          />
        </div>
      </draggable>
    </div>
  </section>
</template>

<script>
  import CategoryTab from 'components/analytics/CategoryTab';
  import WizardSectionRibbon from 'components/analytics/WizardSectionRibbon';

  import instantiate from 'components/analytics/models/instantiate.js';
  import { wizardSectionRibbonTypes } from 'enums/wizard-section-ribbon-types';

  import draggable from 'vuedraggable';

  export default {
    components: {
      CategoryTab,
      WizardSectionRibbon,
      draggable
    },

    props: {
      categories: {
        type: Array,
        required: true
      },

      usedCategories: {
        type: Array,
        default: () => []
      },

      disabled: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      categories_: {
        get() {
          return this.categories;
        },

        set(updatedCategories) {
          this.$emit('categories:update', updatedCategories);
        }
      }
    },

    methods: {
      startDrag() {
        this.$emit('drag:start');
      },

      endDrag() {
        this.$emit('drag:end');
      },

      toggleAccordion() {
        this.isOpen = !this.isOpen;
      },

      onAdd() {
        this.categories_ = this.categories_.map(instantiate);
      },

      onChose() {
        this.$emit('item:choose');
      }
    },

    data() {
      return {
        wizardSectionRibbonTypes,
        isOpen: true
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .section-wrapper {
    max-height: 0;

    transition: max-height 0.5s;
    overflow: hidden;

    &.is-open {
      max-height: 300px;
    }
  }

  .section-dropzone {
    display: flex;
    flex-wrap: wrap;
    padding: 10px 13px 10px 25px;

    // removes duplicate element that dragable library adds for sorting,
    // on column and row is added attribute placement.
    [placement='column'],
    [placement='row'] {
      display: none;
    }

    .tab {
      width: 140px;
    }
  }

  .tab-wrap {
    flex: 1;
    padding-bottom: 10px;
  }

  .tab {
    display: inline-flex;
    min-width: 140px;
  }
</style>
