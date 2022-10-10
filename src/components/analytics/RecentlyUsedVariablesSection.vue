<template>
  <section :class="$style.container">
    <wizard-section-ribbon
      title="Recently Used"
      :isOpen="isOpen"
      :type="wizardSectionRibbonTypes.VALUES"
      :offset="{
        horizontal: -75,
        vertical: 100
      }"
      @accordion:toggle="toggleAccordion"
    />
    <transition name="height">
      <div v-show="isOpen" :class="$style.sectionWrapper">
        <div :class="$style.sectionContent">
          <draggable
            :class="$style.dropzone"
            v-model="_variables"
            :group="{ name: 'recentVariables', pull: true, put: false }"
            :dragClass="isCustomDragClass && $style.drag"
            :sort="false"
            @start="startDrag"
            @end="endDrag"
          >
            <variable-section-tab
              v-for="variable in variables"
              :class="$style.variable"
              :key="generateRandomHex()"
              :variable="variable"
              :readonly="true"
            />
          </draggable>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
  import { wizardSectionRibbonTypes } from 'enums/wizard-section-ribbon-types';
  import { isWindows } from '@/utils/browser';

  import draggable from 'vuedraggable';
  import VariableSectionTab from 'components/analytics/VariableSectionTab';
  import WizardSectionRibbon from 'components/analytics/WizardSectionRibbon';

  import { generateRandomHex } from 'utils/string';

  export default {
    components: {
      VariableSectionTab,
      WizardSectionRibbon,
      draggable
    },

    props: {
      variables: {
        type: Array,
        default: () => []
      }
    },

    computed: {
      _variables: {
        get() {
          return this.variables;
        },

        set(updatedVariables) {
          this.$emit('variable:update', updatedVariables);
        }
      },

      isCustomDragClass() {
        return isWindows;
      }
    },

    methods: {
      generateRandomHex,

      toggleAccordion() {
        this.isOpen = !this.isOpen;
      },

      startDrag() {
        this.$emit('drag:start');
      },

      endDrag() {
        this.$emit('drag:end');
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

  .container {
    @include column;
    min-height: 0;
    flex: 1 0;

    margin-bottom: 20px;
  }

  .dropzone {
    min-width: 288px;
    min-height: 48px;
  }

  .drag {
    position: relative;
    opacity: 1;
    background: transparent;
    padding: 20px;

    &::before {
      content: '';
      border: 1px solid $color-text-primary;
      box-shadow: 0 4px 10px $light-shadow-color;
      border-radius: 4px;
      display: block;
      background: $color-bg-light;
      z-index: -1;
      position: absolute;
      left: 50%;
      top: 50%;
      width: calc(100% - 5px);
      height: calc(100% - 5px);
      transform: translate(-50%, -50%);
    }
  }

  .variable {
    min-width: 288px;
  }

  .section-wrapper {
    @include column;
    min-height: 0;
    align-items: center;
    padding-top: 15px;

    &.is-open {
      max-height: 350px;
    }
  }

  .section-content {
    padding: 0 25px;
  }
</style>
