<template>
  <section v-windows-custom-scroll:dark :class="$style.section">
    <WizardSectionRibbon
      title="Values"
      instructions="Add values, then drop them to add them to the calculation box."
      :is-open="isOpen"
      :type="wizardSectionRibbonTypes.VALUES"
      :offset="{
        horizontal: -55,
        vertical: 100
      }"
      @accordion:toggle="toggleAccordion"
    />
    <transition name="height">
      <div v-show="isOpen" :class="$style.sectionWrapper">
        <div v-if="!isFormShown" :class="$style.sectionContent">
          <button :class="$style.buttonAddValue" @click="showForm">
            <IconAddFlat />
            <span>Add value</span>
          </button>
          <draggable
            v-model="_variables"
            :class="$style.dropzone"
            :group="{ name: 'variables', pull: 'clone', put: ['variables'] }"
            filter=".drag-disabled"
            :ghost-class="$style.hidden"
            :drag-class="isCustomDragClass && $style.drag"
            :sort="false"
            @start="startDrag"
            @end="endDrag"
          >
            <VariableSectionTab
              v-for="variable in variables"
              :key="variable.id"
              :class="$style.variable"
              :variable="variable"
              :related-calculations="
                calculationsGroupedByVariables[variable.variableId]
              "
              @edit:click="onEditVariableClick"
              @remove:click="onRemoveVariableClick"
            />
          </draggable>
        </div>
        <VariableSectionForm
          v-else
          :is-edit-mode="isEditMode"
          :metrics="metrics"
          :variable="activeVariable"
          @form:submit="submitForm"
          @form:close="onFormClose"
        />
      </div>
    </transition>
    <!-- Better solution should be found, this is here so in this case component recently used variables is aware of variables height transition, otherwise it jumps when displey none from v-if statement is added at the end of transition -->
    <slot></slot>
  </section>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import { isWindows } from '@/utils/browser';

  import { wizardSectionRibbonTypes } from 'enums/wizard-section-ribbon-types';

  import * as mutationTypes from 'store/mutation-types';

  import draggable from 'vuedraggable';
  import VariableSectionTab from 'components/analytics/VariableSectionTab';
  import VariableSectionForm from 'components/analytics/VariableSectionForm';
  import WizardSectionRibbon from 'components/analytics/WizardSectionRibbon';

  import instantiate from 'components/analytics/models/instantiate';
  import VariableModel from 'components/analytics/models/Variable';

  import IconAddFlat from '@/assets/images/icons/add-flat.svg';

  export default {
    components: {
      VariableSectionTab,
      VariableSectionForm,
      WizardSectionRibbon,
      draggable,
      IconAddFlat
    },

    props: {
      metrics: {
        type: Array,
        default: () => []
      },

      variables: {
        type: Array,
        default: () => []
      },

      calculations: {
        type: Array,
        default: () => []
      },
      widget: {
        type: Object
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
      },

      calculationsGroupedByVariables() {
        return this.variables.reduce((acc, curr) => {
          acc[curr.variableId] = this.calculations.filter(calculation =>
            this.findCalculationVariableById(calculation, curr.variableId)
          );

          return acc;
        }, {});
      },

      calculationsWithActiveVariable() {
        return this.calculationsGroupedByVariables[
          this.activeVariable.variableId
        ];
      },

      isActiveVariableInCalculations() {
        return Boolean(this.calculationsWithActiveVariable);
      }
    },

    methods: {
      resetForm() {
        this.activeVariable = VariableModel.from();
        this.isEditMode = false;
      },

      onFormClose() {
        this.hideForm();
        this.resetForm();
      },

      showForm() {
        this.isFormShown = true;
        this.$emit('visibility:shown');
      },

      hideForm() {
        this.isFormShown = false;
        this.$emit('visibility:hidden');
      },

      toggleAccordion() {
        this.isOpen = !this.isOpen;
      },

      startDrag() {
        this.$emit('drag:start');
      },

      endDrag() {
        this.$emit('drag:end');
      },

      submitForm(variable) {
        if (this.isEditMode) {
          // update calculations using this variable
          this._variables = this.calculationsWithActiveVariable.map(
            calculation => {
              let isNameManual = false;
              calculation.elements = calculation.elements.map(element => {
                if (variable.variableId !== element.variableId) {
                  return element;
                }
                isNameManual = calculation.isNameManual;
                const { id, operator } = element;
                return instantiate(variable, { id, operator });
              });

              // if name is not manual update offset on calculation name
              if (!isNameManual) {
                this.widget.calculateCalculationNameDuplicates(calculation);
              }
            }
          );

          const index = this._variables
            .map(({ variableId }) => variableId)
            .indexOf(variable.variableId);
          this._variables[index] = variable;
        } else {
          this._variables.push(variable);
        }

        this._variables = [...this._variables]; // trigger event emitter

        this.hideForm();
        this.resetForm();
      },

      onEditVariableClick(variable) {
        this.isEditMode = true;
        this.activeVariable = variable;
        this.showForm();
      },

      onRemoveVariableClick(id) {
        if (!this.calculationsGroupedByVariables[id].length) {
          this._variables = this._variables.filter(
            variableModel => variableModel.variableId !== id
          );
        }
      },

      findCalculationVariableById(calculation, id) {
        return calculation.elements.find(element => element.variableId === id);
      },

      ...mapMutations('analytics', [
        mutationTypes.WIDGET_VARIABLE_CREATE,
        mutationTypes.WIDGET_VARIABLE_EDIT,
        mutationTypes.WIDGET_VARIABLE_DELETE,
        mutationTypes.WIDGET_VALUE_VARIABLE_EDIT
      ])
    },

    data() {
      return {
        activeVariable: VariableModel.from(),
        wizardSectionRibbonTypes,
        isFormShown: false,
        isOpen: true,
        isEditMode: false
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .section {
    @include column;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .section-wrapper {
    @include column;
    min-height: 0;
    align-items: center;
    flex-shrink: 0;
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
      width: calc(100% - 20px);
      height: calc(100% - 20px);
      transform: translate(-50%, -50%);
    }
  }

  .hidden {
    display: none;
  }

  .variable {
    min-width: 288px;
  }

  .section-content {
    padding: 15px 25px;
  }

  .button-add-value {
    @include row;
    @include button;
    text-transform: none;
    align-items: center;

    width: 100%;
    margin-bottom: 12px;

    padding: 12px 16px;
    line-height: 20px;

    font-weight: bold;

    border-radius: 4px;

    background-color: $color-bg-primary-mid;
    color: $color-text-light;

    & > * + * {
      margin-left: 8px;
    }
  }
</style>
