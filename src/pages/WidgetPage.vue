<template>
  <div v-if="widget" :class="[$style.page, { [$style.graph]: !_isTable }]">
    <aside :class="$style.aside">
      <WidgetTypeDropdown
        :is-open="isWidgetTypeDropdownOpen"
        :widget-type="_representation"
        @dropdown:open="isWidgetTypeDropdownOpen = true"
        @dropdown:close="isWidgetTypeDropdownOpen = false"
        @widgetType:select="setWidgetRepresentation"
      />
      <div
        :class="isCategoryDragging && isDragging && $style.categoriesDragging"
      >
        <CategoriesSection
          :categories="widgetCategories"
          :disabled="!isCategoryDragging && isDragging"
          :used-categories="_rowsAndColumnsItems"
          @item:choose="isCategoryDragging = true"
          @drag:start="setValue(true, 'isDragging')"
          @drag:end="setValue(false, 'isDragging')"
        />
      </div>
      <VariableSection
        :metrics="widgetMetrics"
        :calculations="calculations"
        :variables="_variables"
        :widget="widget"
        @variable:update="_configuration.variables = $event"
        @drag:start="setValue(true, 'isVariableDragging')"
        @drag:end="setValue(false, 'isVariableDragging')"
        @visibility:shown="setValue(true, 'variablesFormShown')"
        @visibility:hidden="setValue(false, 'variablesFormShown')"
      >
        <RecentlyUsedVariablesSection
          v-show="!variablesFormShown && !recentlyUsedVariablesEmpty"
          :variables="_recentlyUsedVariables"
          @variable:update="_recentlyUsedVariables = $event"
          @drag:start="setValue(true, 'isVariableDragging')"
          @drag:end="setValue(false, 'isVariableDragging')"
        />
      </VariableSection>
    </aside>
    <div
      v-if="_isTable"
      :class="[$style.rowsWrapper, { [$style.dragging]: isDragging }]"
    >
      <h1 :class="[$style.title, $style.rowsTitle]">Rows</h1>
      <RowsSection
        :class="$style.dropSection"
        :categories="_rows"
        :total-checked="_configuration.showRowsTotal"
        :filters-blacklist="_configuration.filtersBlacklist"
        @item:choose="onChooseRowItem"
        @total:toggle="
          _configuration.showRowsTotal = !_configuration.showRowsTotal
        "
        @ignoreFilters:toggle="updateBlacklist($event)"
        @row:update="_configuration.rows = $event"
        @drag:start="setValue(true, 'isDragging')"
        @drag:end="setValue(false, 'isDragging')"
      />
    </div>
    <header :class="[$style.columnsWrapper, { [$style.dragging]: isDragging }]">
      <h1 :class="[$style.title, $style.columnsTitle]">{{ _xAxisTitle }}</h1>
      <ColumnsSection
        :class="$style.dropSection"
        :categories="_columns"
        :with-totals="_isTable"
        :total-checked="_configuration.showColumnsTotal"
        :filters-blacklist="_configuration.filtersBlacklist"
        @item:choose="onChooseColumnItem"
        @total:toggle="
          _configuration.showColumnsTotal = !_configuration.showColumnsTotal
        "
        @ignoreFilters:toggle="updateBlacklist"
        @column:update="_configuration.columns = $event"
        @drag:start="setValue(true, 'isDragging')"
        @drag:end="setValue(false, 'isDragging')"
      />
    </header>
    <div
      v-if="_variables.length || _recentlyUsedVariables.length"
      :class="[
        $style.content,
        {
          [$style.dragging]:
            isCalculationDragging || isOperatorDragging || isVariableDragging
        }
      ]"
    >
      <draggable
        v-model="calculations"
        :drag-class="$style.valueDragClass"
        handle=".draggable-handle"
        @start="setValue(true, 'isCalculationDragging')"
        @end="setValue(false, 'isCalculationDragging')"
      >
        <ValueCalculation
          v-for="(calculation, index) in calculations"
          :key="index"
          :class="[
            $style.calculation,
            { [$style.dragging]: isCalculationDragging }
          ]"
          :calculation="calculation"
          :calculation-names="calculationNames"
          :widget-type="_representation"
          @calculation:delete="onCalculationDelete"
          @element:add="addToVariableSectionIfNotExists"
        />
      </draggable>
      <ValueCalculationPlaceholder
        :class="$style.calculationPlaceholder"
        @placeholder:add="onPlaceholderAdd"
      />
    </div>
    <EmptyState v-else :class="$style.emptyState">
      <template slot="image">
        <!-- @svg("emptystate-widget-calculations") -->
      </template>
      <template slot="text">
        Create variables so you can create<br />
        calculations with them.
      </template>
    </EmptyState>
    <div v-show="calculations.length" :class="$style.operators">
      <Operators
        @start="setValue(true, 'isOperatorDragging')"
        @end="setValue(false, 'isOperatorDragging')"
      />
    </div>
    <ActionToolbar
      :class="$style.toolbar"
      :is-primary-button-inverted="false"
      :is-secondary-button-inverted="false"
      :button-class="$style.button"
      :secondary-button-type="ButtonFlat"
      :is-disabled="isDisabled"
      :is-loading="isWidgetLoading"
      primary-button-text="Save"
      secondary-button-text="Cancel"
      @click:primary="submit"
      @click:secondary="onCancelClick"
    >
      <div :class="$style.widgetNameWrapper">
        <label :class="$style.widgetName">Widget title</label>
        <ValidationField :v="$v.name" :error-messages="errorMessages">
          <template #default="{ isError, errorMessage }">
            <InputText
              v-model.trim="name"
              :class="$style.input"
              :message="errorMessage"
              :error="isError"
              @focus="$v.name.$reset()"
            />
          </template>
        </ValidationField>
      </div>

      <template
        #buttonPrimary="{
          primaryButtonAttrs,
          primaryButtonEvents,
          primaryButtonText
        }"
      >
        <BasicTooltip
          :disabled="Boolean(calculations.length)"
          theme="light"
          :offset="{ vertical: -56, horizontal: -140 }"
          :condensed="true"
        >
          <ButtonRegular
            slot="trigger"
            v-bind="primaryButtonAttrs"
            v-on="primaryButtonEvents"
            >{{ primaryButtonText }}</ButtonRegular
          >
          <span :class="$style.tooltipText"
            >Your widget should have at least one calculation.</span
          >
        </BasicTooltip>
      </template>
    </ActionToolbar>

    <!-- ======== MODALS ======== -->

    <CoreModal
      v-if="
        activeModal === modals.UNSAVED_WIDGET ||
        activeModal === modals.UNSAVED_CALCULATOR
      "
      :btn-class="$style.unsavedBtn"
      title="Unsaved Changes"
      cancel-button-text="Continue editing"
      submit-button-text="Discard changes"
      @close="closeModal"
      @submit="onUnsavedModalSubmit"
    >
      <p v-if="activeModal === modals.UNSAVED_CALCULATOR">
        You have unsaved changes which will be lost if you exit the calculator.
      </p>
      <p v-else>
        You have unsaved changes which will be lost if you leave this page.
      </p>
    </CoreModal>
    <CloseIcon :class="$style.closeBtn" @click="onCancelClick" />
  </div>
</template>

<script>
  import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';
  import draggable from 'vuedraggable';
  import { cloneDeep, isEqual, uniq } from 'lodash';

  import * as mutationTypes from 'store/mutation-types';
  import widgetModals from 'enums/widget-modals';
  import { calculationsOrientationEnum } from 'enums/calculations-orientation';
  import { widgetTypes } from 'enums/widget-types';
  import { widgetRepresentations } from 'enums/widget-representations';
  import { LINE, BAR, AREA } from 'constants/series-types';
  import visualFormattingTypesEnum from 'enums/visual-formatting-types';
  import { DEFAULT_LINE_THICKNESS } from 'enums/visual-formatting-line-thickness';
  import chartColors from 'enums/chart-picker-colors';
  import { valuesCategory } from 'constants/widget-categories';
  import { toggleArrValue } from 'utils/collection';
  import { generateRandomHex } from 'utils/string';
  import { maxLength } from 'vuelidate/lib/validators';

  import instantiate from 'components/analytics/models/instantiate.js';
  import Calculation from 'components/analytics/models/Calculation.js';
  import OperatorInstance from 'components/analytics/models/OperatorInstance';

  import CoreModal from 'components/core/Modal';
  import EmptyState from 'components/app/EmptyState';
  import CategoriesSection from 'components/analytics/CategoriesSection';
  import ColumnsSection from 'components/analytics/ColumnsSection';
  import RowsSection from 'components/analytics/RowsSection';
  import ValueCalculation from 'components/analytics/ValueCalculation';
  import VariableSection from 'components/analytics/VariableSection';
  import RecentlyUsedVariablesSection from 'components/analytics/RecentlyUsedVariablesSection';
  import Operators from 'components/analytics/operators/Operators';
  import BasicTooltip from 'components/core/BasicTooltip';
  import WidgetTypeDropdown from 'components/analytics/WidgetTypeDropdown';
  import namespacedMixin from 'mixins/namespaced';

  import ActionToolbar from 'components/toolbars/ActionToolbar';
  import ButtonFlat from 'components/buttons/ButtonFlat';
  import ButtonRegular from 'components/buttons/ButtonRegular';

  import ValueCalculationPlaceholder from 'components/analytics/ValueCalculationPlaceholder';

  import WidgetModel from 'components/analytics/models/Widget.js';
  import ValidationField from 'components/renderless/ValidationField';
  import InputText from 'components/inputs/new/InputText';
  import { errorMessagesFactory } from 'utils/validation';
  import VariableModel from 'components/analytics/models/Variable.js';
  import CloseIcon from '@/assets/images/icons/close-2px.svg';

  const { ROWS, COLUMNS } = calculationsOrientationEnum;

  export default {
    components: {
      ActionToolbar,
      CategoriesSection,
      CloseIcon,
      ColumnsSection,
      CoreModal,
      EmptyState,
      RowsSection,
      ValueCalculation,
      VariableSection,
      draggable,
      Operators,
      ValueCalculationPlaceholder,
      BasicTooltip,
      ButtonRegular,
      RecentlyUsedVariablesSection,
      WidgetTypeDropdown,
      ValidationField,
      InputText
    },
    mixins: [namespacedMixin],

    props: {
      dashboardId: {
        type: String,
        default: ''
      },
      widgetId: {
        type: String,
        default: ''
      },
      representation: {
        type: String
      }
    },

    computed: {
      calculations: {
        get() {
          return this.widget.configuration.calculations;
        },

        set(calculations) {
          this.widget.configuration.calculations = calculations;
        }
      },

      recentlyUsedVariablesEmpty() {
        return this._recentlyUsedVariables.length === 0;
      },

      calculationNames() {
        return this.calculations.map(calculation => calculation.name);
      },

      calculationNamesUnique() {
        return (
          uniq(this.calculationNames).length === this.calculationNames.length
        );
      },

      calculationNameMissing() {
        return this.calculationNames.some(name => !name);
      },

      name: {
        get() {
          return (this.widget && this.widget.name) || '';
        },

        set(newName) {
          this.widget.name = newName;
        }
      },

      _variables() {
        return this.widget.configuration.variables;
      },

      _rows() {
        return this.widget.configuration.rows;
      },

      _columns() {
        return this.widget.configuration.columns;
      },

      _configuration() {
        return this.widget.configuration;
      },

      _rowsAndColumnsItems() {
        return [...this._rows, ...this._columns].map(({ id }) => id);
      },

      _representation() {
        return this.widget.representation;
      },

      _isTable() {
        return this.widget.representation === widgetRepresentations.TABLE.id;
      },

      _xAxisTitle() {
        return this._isTable ? 'Columns' : 'Categories';
      },

      isWidgetEdit() {
        return Boolean(this.widgetId);
      },

      isDisabled() {
        return (
          !this.isDirty ||
          !this.calculations.length ||
          !this.name ||
          (!this._isTable && this._columns.length === 0) ||
          !this.calculationNamesUnique ||
          this.calculationNameMissing
        );
      },

      isDirty() {
        return !isEqual(this.widget, this.widgetInitial);
      },

      ...mapState({
        isWidgetMetricsLoaded(state, getters) {
          return getters[`${this.namespace}/isWidgetMetricsLoaded`];
        },
        isWidgetCategoriesLoaded(state, getters) {
          return getters[`${this.namespace}/isWidgetCategoriesLoaded`];
        },
        widgetCategories(state, getters) {
          return getters[`${this.namespace}/widgetCategories`];
        },
        isWidgetLoaded(state, getters) {
          return getters[`${this.namespace}/isWidgetLoaded`];
        },
        widgetData(state, getters) {
          return getters[`${this.namespace}/widgetData`];
        },
        widgetMetrics(state, getters) {
          return getters[`${this.namespace}/widgetMetrics`];
        },
        recentlyUsedVariables(state, getters) {
          return getters[`${this.namespace}/recentlyUsedVariables`];
        }
      }),

      errorMessages() {
        return errorMessagesFactory({
          isNameInvalid:
            'This name is already taken, please choose a different name.',
          maxLength: 'Name should not exceed 50 characters'
        });
      },

      useDefault() {
        return (
          this._representation === this.widgetRepresentations.TABLE.id ||
          this.lastRepresentation === this.widgetRepresentations.TABLE.id
        );
      },

      getDefaultSeries() {
        let defaultType = '';

        if (this.useDefault) {
          defaultType = LINE;
        } else if (
          this._representation === this.widgetRepresentations.MIXED_CHART.id
        ) {
          defaultType =
            this.lastRepresentation === this.widgetRepresentations.LINE_CHART.id
              ? LINE
              : BAR;
        } else if (
          this._representation === this.widgetRepresentations.AREA_CHART.id ||
          this._representation ===
            this.widgetRepresentations.AREA_CHART_STACKED.id
        ) {
          defaultType = AREA;
        } else {
          defaultType =
            this._representation === this.widgetRepresentations.LINE_CHART.id
              ? LINE
              : BAR;
        }

        return {
          opposite: false,
          seriesType: defaultType
        };
      },

      ...mapGetters('analytics', ['widgetNameGenerated']),

      ...mapGetters(['fullscreen'])
    },

    methods: {
      generateRandomHex,

      getDefaultChart(index) {
        return {
          color: chartColors[index],
          lineStyle: visualFormattingTypesEnum.SOLID,
          lineThickness: DEFAULT_LINE_THICKNESS
        };
      },

      getCalculationWithDefaultValues(calculation, index) {
        return Calculation.generate({
          ...calculation,
          formatting: {
            ...calculation.formatting,
            chart: calculation.formatting.chart
              ? calculation.formatting.chart
              : this.getDefaultChart(index)
          },
          seriesSettings: calculation.seriesSettings
            ? calculation.seriesSettings
            : this.getDefaultSeries
        });
      },

      onCalculationDelete(calculation) {
        this.calculations = this.calculations.filter(
          calc => calc.id !== calculation.id
        );

        // if no calculations then remove Values category
        if (this.calculations.length === 0) {
          this._configuration.rows = this._rows.filter(
            ({ id }) => id !== valuesCategory.id
          );
          this._configuration.columns = this._columns.filter(
            ({ id }) => id !== valuesCategory.id
          );
        }
      },

      onPlaceholderAdd(element) {
        // instantiate element and create calculation with it
        const elementInstance = instantiate(element);
        const elementName =
          elementInstance instanceof OperatorInstance
            ? elementInstance.symbol
            : elementInstance.name;

        const newCalculation = this.getCalculationWithDefaultValues(
          Calculation.from({ elements: [elementInstance] }),
          this.calculations.length
        );

        this.widget.calculateCalculationNameDuplicates(newCalculation);

        this.calculations = [
          ...this.calculations,
          Calculation.from({
            ...newCalculation
          })
        ];

        // if first calculation then create Values category inside the Rows section
        if (this.calculations.length === 1) {
          this._rows.push(valuesCategory);
        }

        this.addToVariableSectionIfNotExists(element);
      },

      addToVariableSectionIfNotExists(element) {
        // if variables section doesn't include this variable, then add it to variables section
        if (
          element instanceof VariableModel &&
          !this._variables
            .map(({ variableId }) => variableId)
            .find(id => id === element.variableId)
        ) {
          this._variables.push(element);
        }
      },

      setValue(value, property) {
        this[property] = value;
      },

      setWidgetRepresentation(representation) {
        this.widget.representation = representation;

        const category =
          representation === widgetRepresentations.TABLE.id
            ? widgetTypes.TABLE
            : widgetTypes.CHART;

        if (this.widget.category === category) {
          return;
        }

        if (category === widgetTypes.TABLE) {
          this.widget.category = widgetTypes.TABLE;

          if (size(this.calculations)) {
            this._configuration.rows = [valuesCategory];
          }
        } else {
          this.widget.category = widgetTypes.CHART;

          this._configuration.columns = reject(
            [...this._configuration.rows, ...this._configuration.columns],
            ['id', valuesCategory.id]
          );
          this._configuration.rows = [];
        }
      },

      openModal(modal, callback) {
        this.activeModal = modal;
        this.unsavedModalSubmitFunc = callback ? callback : null;
      },

      closeModal() {
        this.activeModal = '';
      },

      redirectToDashboard(addedNewWidget) {
        if (addedNewWidget) {
          this.$emit('widget:add', this.widget);
        } else {
          this.$emit('widget:edit', this.widget);
        }
      },

      cancelChanges() {
        this.$emit('widget:close');
      },

      async submit() {
        this.$v.$touch();

        if (this.$v.$invalid) {
          return;
        }

        const data = WidgetModel.adaptKeys(this.widget);

        this.isWidgetLoading = true;
        try {
          if (this.isWidgetEdit) {
            this.widget = await this.editWidget(data);
          } else {
            this.widget = await this.createWidget(data);
          }
          this.redirectToDashboard(!this.isWidgetEdit);
        } catch (messages) {
          this.errors = { messages, data };
        } finally {
          this.isWidgetLoading = false;
        }
      },

      onCancelClick() {
        if (this.isDirty) {
          this.openModal(this.modals.UNSAVED_WIDGET, this.cancelChanges);
        } else {
          this.cancelChanges();
        }
      },

      onUnsavedModalSubmit() {
        this.unsavedModalSubmitFunc();
        this.closeModal();
      },

      updateBlacklist(value) {
        this._configuration.filtersBlacklist = toggleArrValue(
          value,
          this._configuration.filtersBlacklist
        );
      },

      toggleCheckbox(type) {
        this[type] = !this[type];
      },

      ...mapActions('analytics', ['fetchWidgetName']),

      createWidget(payload) {
        return this.$store.dispatch(`${this.namespace}/createWidget`, payload);
      },

      editWidget(payload) {
        return this.$store.dispatch(`${this.namespace}/editWidget`, payload);
      },

      fetchWidget(payload) {
        return this.$store.dispatch(`${this.namespace}/fetchWidget`, payload);
      },

      fetchCategories(payload) {
        return this.$store.dispatch(
          `${this.namespace}/fetchCategories`,
          payload
        );
      },

      fetchMetrics(payload) {
        return this.$store.dispatch(`${this.namespace}/fetchMetrics`, payload);
      },

      fetchRecentlyUsedVariables(payload) {
        return this.$store.dispatch(
          `${this.namespace}/fetchRecentlyUsedVariables`,
          payload
        );
      },

      onChooseColumnItem(index) {
        this.isCategoryDragging = this._columns[index].id !== 'values';
      },

      onChooseRowItem(index) {
        this.isCategoryDragging = this._rows[index].id !== 'values';
      },

      ...mapMutations([
        mutationTypes.START_FULLSCREEN,
        mutationTypes.END_FULLSCREEN
      ])
    },

    data() {
      return {
        ButtonFlat,
        COLUMNS,
        ROWS,
        widgetRepresentations,
        activeModal: '',
        lastRepresentation: '',
        isCategoryDragging: false,
        unsavedModalSubmitFunc: null,
        isDragging: false,
        isCalculationDragging: false,
        isVariableDragging: false,
        isOperatorDragging: false,
        isWidgetLoading: false,
        isWidgetTypeDropdownOpen: false,
        modals: widgetModals,
        widget: null,
        widgetInitial: null,
        errors: {},
        variablesFormShown: false,
        _recentlyUsedVariables: []
      };
    },

    async created() {
      if (!this.isWidgetMetricsLoaded) {
        this.fetchMetrics();
      }

      if (!this.isWidgetCategoriesLoaded) {
        await this.fetchCategories(); // Necessary for deserialization
      }

      await this.fetchRecentlyUsedVariables();
      this._recentlyUsedVariables = this.recentlyUsedVariables.map(
        VariableModel.from
      );

      if (this.isWidgetEdit) {
        const widgetData = await this.fetchWidget(this.widgetId);

        this.widget = WidgetModel.deserialize({
          ...widgetData,
          categories: this.widgetCategories
        });
      } else {
        this.widget = WidgetModel.from({ dashboardId: this.dashboardId });
        this.setWidgetRepresentation(this.representation);

        await this.fetchWidgetName(this.dashboardId);
        this.name = this.widgetNameGenerated;
      }

      this.widgetInitial = cloneDeep(this.widget); // clone for later dirty checking

      document.addEventListener('keydown', this.onKeyDown);
    },

    destroyed() {
      document.removeEventListener('keydown', this.onKeyDown);
    },

    validations: {
      name: {
        maxLength: maxLength(50),
        isNameInvalid(currentName) {
          return !(this.errors.data && this.errors.data.name === currentName);
        }
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  $header-height: 185px;
  $left-aside-width: 305px;
  $right-aside-width: 352px;

  .page {
    background-color: $color-bg-main-dimmed;
    z-index: $z-modal;
    display: grid;
    grid-template-columns: 336px 256px 1fr 73px;

    // Calc is being used so operators don't cause overflow on smaller screens
    grid-template-rows: 110px calc(100vh - 182px) 72px;
    grid-template-areas:
      'aside rows columns columns'
      'aside rows content operators'
      'aside toolbar toolbar toolbar';

    &.graph {
      grid-template-areas:
        'aside columns columns columns'
        'aside content content operators'
        'aside toolbar toolbar toolbar';

      .content {
        padding-left: 175px;
      }
    }
  }

  .aside {
    @include column;

    grid-area: aside;

    background-color: $color-bg-primary-dark;
    box-shadow: $widget-page-aside-box-shadow;
  }

  .rows-wrapper {
    grid-area: rows;

    display: flex;
    flex-direction: column;

    padding-top: 48px;
    border-right: 1px solid $color-border-main;

    &.dragging {
      background-color: $color-bg-primary-dimmed;
    }
  }

  .columns-wrapper {
    grid-area: columns;

    display: flex;
    align-items: flex-end;
    padding-left: 40px;

    border-bottom: 1px solid $color-border-main;

    &.dragging {
      background-color: $color-bg-primary-dimmed;
    }
  }

  .empty-state {
    grid-column: 3 / 4;
    grid-row: 2 / 3;
  }

  .toolbar {
    grid-area: toolbar;
    z-index: 1;

    background-color: $color-bg-light;

    box-shadow: $widget-page-toolbar-box-shadow;

    .button {
      width: 160px;
    }
  }

  .operators {
    grid-area: operators;

    border-left: 1px solid $color-border-main;

    padding: 40px 16px;
    overflow-y: auto;
  }

  .drop-section {
    flex: 1;

    transition: background-color 0.2s;
  }

  .content {
    position: relative;
    grid-area: content;

    display: flex;
    flex-direction: column;

    background-color: $color-bg-main-dimmed;
    overflow-y: auto;
    padding: 40px;
    min-width: 670px;

    &.dragging {
      background-color: $color-bg-primary-dimmed;
    }
  }

  .title {
    margin-top: 0;
    margin-bottom: 32px;

    color: $color-text-main;

    &.rows-title {
      padding: 0 56px 0 24px;
    }
  }

  .calculation {
    &:not(:first-child) {
      margin-top: 16px;
    }

    &.dragging :global(.draggable-handle) {
      cursor: grabbing;
    }
  }

  .placeholder {
    padding-top: 110px;
    text-align: center;
  }

  .placeholder-text {
    margin: 0;
    color: $color-text-main-lighter;
  }

  .value-drag-class {
    box-shadow: $value-calculation-box-shadow;
    background-color: $color-bg-light;
  }

  .unsaved-btn {
    width: 168px;
  }

  .close-btn {
    position: absolute;

    top: 30px;
    right: 46px;
    height: 24px;
    cursor: pointer;
  }

  .input {
    width: 240px;
    margin: 8px 0;
  }

  .widget-name-wrapper {
    display: flex;
    align-items: center;
    margin-right: auto;
    margin-left: 40px;
  }

  .widget-name {
    color: $color-text-main-light;
    margin-right: 16px;
  }

  .calculation-placeholder {
    margin-top: 16px;
  }

  .categories-dragging {
    background-color: $color-bg-primary-darker;
  }

  .tooltip-text {
    @include flex-center($flex-direction: column);
    white-space: nowrap;
  }
</style>
