<template>
  <article :class="$style.wrapper">
    <div
      :class="[$style.calculation, 'draggable-item']"
      @mouseleave="closeDropdown"
    >
      <span :class="['draggable-handle', $style.reorder]">
        <!-- @svg("controls/reorder") -->
      </span>
      <AnimatedInput
        v-model="calculationName"
        :class="$style.container"
        :helper-class-override="$style.helper"
        :class-override="$style.input"
        :helper-text="helperText"
        :is-invalid="calculationNameTaken || calculationNameMissing"
        :error-messages="errorMessages"
      />
      <div :class="$style.dropzoneWrapper">
        <Draggable
          v-model="calculation.elements"
          :class="$style.dropzone"
          :filter="`.${$style.removeIcon}`"
          :ghost-class="$style.ghostClass"
          :group="{
            name: 'calculationValues',
            pull: ['calculationValues', 'calculationPlaceholderValues'],
            put: [
              'variables',
              'operators',
              'recentVariables',
              'calculationValues'
            ]
          }"
          @add="onAdd"
          @change="onChange"
        >
          <div
            v-for="element in calculation.elements"
            :key="element.id"
            :class="$style.itemWrapper"
          >
            <component
              :is="element.component"
              :key="element.id"
              :class="$style.item"
              :is-placed="true"
              v-bind="element.props"
            />
            <span :class="$style.removeIcon" @click="onRemove(element)">
              <!-- @svg("remove") -->
            </span>
          </div>
        </Draggable>
      </div>
      <div :class="$style.badges">
        <template v-if="isTable">
          <TotalsBadge v-if="calculation.calculateTotalAsIndividual" />
          <div v-if="conditionalFormatting.length" :class="$style.badgeGroup">
            <ConditionalFormattingBadge
              v-for="(formatting, index) in conditionalFormatting"
              :key="formatting.id"
              :class="$style.badge"
              :formatting="formatting"
              :style="{ zIndex: conditionalFormatting.length - index }"
            />
          </div>
        </template>
        <div
          v-if="numericFormatting.type && numericFormatting.type !== 'number'"
          :class="$style.badgeGroup"
        >
          <NumericFormattingBadge
            :class="$style.badge"
            :type="numericFormatting.type"
          />
        </div>
        <div
          v-if="!isTable && (chartFormatting || seriesSettings)"
          :class="$style.badgeGroup"
        >
          <SeriesFormattingSettingsBadge
            :class="$style.badge"
            :series-type="seriesType"
            :series-color="seriesColor"
          />
        </div>
      </div>
      <ul :class="$style.buttons">
        <li :class="$style.button">
          <BasicDropdown
            :class="$style.dropdown"
            :is-open="isDropdownOpen"
            :offset="{ horizontal: -180 }"
            @dropdown:close="closeDropdown"
            @dropdown:open="openDropdown"
          >
            <div slot="trigger" :class="$style.dropdownTrigger">
              <!-- @svg("more") -->
            </div>
            <div :class="$style.dropdownContent">
              <div
                v-if="isTable"
                :class="$style.dropdownItem"
                @click="openModal(widgetModals.CONDITIONAL)"
              >
                Conditional formatting
              </div>
              <div
                v-else
                :class="$style.dropdownItem"
                @click="openModal(widgetModals.CHART)"
              >
                Visual formatting
              </div>
              <div
                :class="$style.dropdownItem"
                @click="openModal(widgetModals.NUMERIC)"
              >
                Numeric formatting
              </div>
              <div
                v-if="isTable"
                :class="$style.dropdownItem"
                @click="openModal(widgetModals.TOTALS)"
              >
                Calculate total with...
              </div>
              <div
                v-if="!isMixedChart && !isTable && !isStacked"
                :class="$style.dropdownItem"
                @click="openModal(widgetModals.YAXIS)"
              >
                Y-axis
              </div>
              <div
                v-if="isMixedChart"
                :class="$style.dropdownItem"
                @click="openModal(widgetModals.SERIES_TYPE)"
              >
                Mixed chart series type
              </div>
              <div
                :class="[$style.dropdownItem, $style.delete]"
                @click="onCalculationDelete"
              >
                Delete
              </div>
            </div>
          </BasicDropdown>
        </li>
      </ul>
    </div>
    <CalculationDivider
      :class="[$style.tooltip, $style.override]"
      :class-override="$style.separator"
      :is-active="formatting.hasSeparator"
      :is-visible="formatting.hasSeparator || showSeparator"
      @click="toggleSeparator"
      @mouseleave="showSeparator = false"
      @mouseover="showSeparator = true"
    />

    <!-- MODALS -->
    <ChartFormattingModal
      v-if="activeModal === widgetModals.CHART"
      :chart-modal-type="chartModalType"
      :formatting="chartFormatting"
      @chartFormatting:submit="onChartFormattingSubmit"
      @close="closeModal"
    />

    <NumericFormattingModal
      v-if="activeModal === widgetModals.NUMERIC"
      :formatting="numericFormatting"
      @close="closeModal"
      @numericFormatting:submit="onNumericFormattingSubmit"
    />
    <ConditionalFormattingModal
      v-if="activeModal === widgetModals.CONDITIONAL"
      :formattings="conditionalFormatting"
      @close="closeModal"
      @submit="onConditionalFormattingSubmit"
    />
    <TotalsModal
      v-if="activeModal === widgetModals.TOTALS"
      :total-as-individual="calculation.calculateTotalAsIndividual"
      @close="closeModal"
      @totals:submit="onTotalsSubmit"
    />
    <SeriesSettingsModal
      v-if="activeModal === widgetModals.SERIES_TYPE"
      :series-settings="calculation.seriesSettings"
      @close="closeModal"
      @submit="onSeriesSettingsSubmit"
    />
    <YAxisSettingsModal
      v-if="activeModal === widgetModals.YAXIS"
      :series-settings="calculation.seriesSettings"
      @close="closeModal"
      @submit="onSeriesSettingsSubmit"
    />
  </article>
</template>

<script>
  import Draggable from 'vuedraggable';
  import { isUnique } from 'utils/array';
  import { isEmpty } from 'lodash';

  import BasicDropdown from 'components/core/BasicDropdown';
  import ValidationInput from 'components/inputs/ValidationInput';
  import AnimatedInput from 'components/inputs/AnimatedInput';

  import { errorMessagesFactory } from 'utils/validation';

  import ConditionalFormattingBadge from 'components/analytics/badges/ConditionalFormattingBadge';
  import NumericFormattingBadge from 'components/analytics/badges/NumericFormattingBadge';
  import SeriesFormattingSettingsBadge from 'components/analytics/badges/SeriesFormattingSettingsBadge';
  import ConditionalFormattingModal from 'components/analytics/modals/ConditionalFormattingModal';
  import TotalsBadge from 'components/analytics/badges/TotalsBadge';
  import NumericFormattingModal from 'components/analytics/modals/NumericFormattingModal';
  import ChartFormattingModal from 'components/analytics/modals/ChartFormattingModal';
  import TotalsModal from 'components/analytics/modals/TotalsModal';
  import SeriesSettingsModal from 'components/analytics/modals/SeriesSettingsModal';
  import CalculationDivider from 'components/analytics/CalculationDivider';
  import YAxisSettingsModal from 'components/analytics/modals/YAxisSettingsModal';

  import widgetModals from 'enums/widget-modals';
  import { widgetRepresentations } from 'enums/widget-representations';
  import { COLOR, VISUAL } from 'constants/chart-modal-types';
  import { BAR, LINE, AREA } from 'constants/series-types';
  import chartModalTypes from 'enums/chart-modal-types';
  import { generateRandomHex } from 'utils/string';

  import Operator from 'components/analytics/operators/Operator';
  import Variable from 'components/analytics/Variable';

  import instantiate from 'components/analytics/models/instantiate.js';

  export default {
    components: {
      BasicDropdown,
      ValidationInput,
      AnimatedInput,
      ConditionalFormattingModal,
      NumericFormattingModal,
      ChartFormattingModal,
      ConditionalFormattingBadge,
      NumericFormattingBadge,
      SeriesFormattingSettingsBadge,
      TotalsBadge,
      TotalsModal,
      SeriesSettingsModal,
      Draggable,
      Operator,
      Variable,
      CalculationDivider,
      YAxisSettingsModal
    },

    props: {
      calculation: {
        type: Object,
        required: true
      },

      calculationNames: {
        type: Array,
        required: true
      },

      widgetType: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        widgetModals,
        isDropdownOpen: false,
        activeModal: '',
        showSeparator: false,
        isNameManual: this.calculation.isNameManual
      };
    },

    computed: {
      calculationName: {
        get() {
          return this.calculation.name;
        },

        set(updatedName) {
          this.calculation.name = updatedName;
          this.updateIsNameManual();
        }
      },

      isTable() {
        return this.widgetType === widgetRepresentations.TABLE.id;
      },

      isMixedChart() {
        return this.widgetType === widgetRepresentations.MIXED_CHART.id;
      },

      isStacked() {
        return (
          this.widgetType === widgetRepresentations.AREA_CHART_STACKED.id ||
          this.widgetType === widgetRepresentations.BAR_CHART_STACKED.id
        );
      },

      isLineChart() {
        return this.widgetType === widgetRepresentations.LINE_CHART.id;
      },

      isBarChart() {
        const { BAR_CHART, BAR_CHART_STACKED } = widgetRepresentations;

        return [BAR_CHART, BAR_CHART_STACKED]
          .map(({ id }) => id)
          .includes(this.widgetType);
      },

      isAreaChart() {
        const { AREA_CHART, AREA_CHART_STACKED } = widgetRepresentations;

        return [AREA_CHART, AREA_CHART_STACKED]
          .map(({ id }) => id)
          .includes(this.widgetType);
      },

      formatting() {
        return this.calculation.formatting;
      },

      conditionalFormatting() {
        return this.formatting.conditional;
      },

      numericFormatting() {
        return this.formatting.numeric;
      },

      chartFormatting() {
        return this.calculation.formatting.chart;
      },

      chartModalType() {
        return this.seriesType === BAR
          ? chartModalTypes[COLOR]
          : chartModalTypes[VISUAL];
      },

      chartModalTypeTitle() {
        return this.chartModalType.title;
      },

      seriesSettings() {
        return this.calculation.seriesSettings;
      },

      isSeriesSettingsEmpty() {
        return isEmpty(this.seriesSettings);
      },

      isLineChartFormatting() {
        return (
          this.isLineChart ||
          (this.seriesSettings &&
            this.isMixedChart &&
            this.seriesSettings.seriesType === LINE)
        );
      },

      helperText() {
        if (this.calculationNameMissing) {
          return 'Name is required';
        }

        if (this.calculationNameTaken) {
          return 'This name is taken.';
        }

        return '';
      },

      errorMessages() {
        return errorMessagesFactory(
          'isNameInvalid',
          'This name is already taken, please choose a different name.'
        );
      },

      calculationNameTaken() {
        return !isUnique(this.calculationNames, this.calculationName);
      },

      calculationNameMissing() {
        return !this.calculationName;
      },

      seriesType() {
        if (this.isLineChart) {
          return LINE;
        }

        if (this.isBarChart) {
          return BAR;
        }

        if (this.isAreaChart) {
          return AREA;
        }

        return this.seriesSettings.seriesType;
      },

      seriesColor() {
        return this.chartFormatting.color;
      }
    },

    methods: {
      toggleSeparator() {
        this.formatting.hasSeparator = !this.formatting.hasSeparator;
      },

      generateRandomHex,

      onAdd({ newIndex }) {
        this.$set(
          this.calculation.elements,
          newIndex,
          instantiate(this.calculation.elements[newIndex])
        );
        if (!this.isNameManual) {
          this.calculation.setAutomaticName();
        }
        this.updateIsNameManual();
        this.$emit('element:add', this.calculation.elements[newIndex]);
      },

      onChange() {
        if (!this.calculation.elements.length) {
          this.onCalculationDelete();
        }
        if (!this.isNameManual) {
          this.calculation.setAutomaticName();
        }
        this.updateIsNameManual();
      },

      updateIsNameManual() {
        this.isNameManual = this.calculation.isNameManual;
      },

      onRemove(elementToRemove) {
        const indexOfElement =
          this.calculation.elements.indexOf(elementToRemove);

        this.calculation.elements.splice(indexOfElement, 1);
        if (!this.isNameManual) {
          this.calculation.setAutomaticName();
        }
        this.updateIsNameManual();

        this.onChange();
      },

      onCalculationDelete() {
        this.$emit('calculation:delete', this.calculation);
      },

      openDropdown() {
        this.isDropdownOpen = true;
      },

      closeDropdown() {
        this.isDropdownOpen = false;
      },

      openModal(modal) {
        this.activeModal = modal;
      },

      closeModal() {
        this.activeModal = '';
      },

      onChartFormattingSubmit(chartFormatting) {
        this.calculation.formatting.chart = chartFormatting;
        this.closeModal();
      },

      onNumericFormattingSubmit(numericFormatting) {
        this.calculation.formatting.numeric = numericFormatting;
        this.closeModal();
      },

      onConditionalFormattingSubmit(conditionalFormatting) {
        this.calculation.formatting.conditional = conditionalFormatting;
        this.closeModal();
      },

      onTotalsSubmit(totals) {
        this.calculation.calculateTotalAsIndividual = totals;
        this.closeModal();
      },

      onSeriesSettingsSubmit(seriesSettings) {
        this.calculation.seriesSettings = seriesSettings;
        this.closeModal();
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  $value-item-wrapper-bottom-margin: 10px;

  .wrapper {
    position: relative;
  }

  .calculation {
    display: flex;
    align-items: center;

    min-height: 80px;
    min-width: 700px;
    padding: 16px 30px 16px 15px;

    background-color: $color-bg-light;
    box-shadow: $value-calculation-box-shadow;
    border-radius: $base-border-radius;

    &:hover {
      .buttons {
        display: block;
      }

      .badges {
        display: none;
      }
    }
  }

  .reorder {
    cursor: grab;
  }

  .container {
    width: auto;
    margin-right: 15px;
    margin-left: 15px;
  }

  .input {
    font-weight: bold;
    padding: 3px 0 3px 1px;

    width: 140px;

    color: $color-text-main;

    &.readonly {
      border-color: transparent;
    }
  }

  .helper {
    white-space: break-spaces;
    bottom: 0;
    transform: translateY(100%);
  }

  .dropzone-wrapper {
    flex: 1;
    margin-left: 71px;
    margin-bottom: -$value-item-wrapper-bottom-margin;
  }

  %item-placeholder {
    border: 1px dashed $color-border-primary;
    border-radius: 4px;
    background-color: $color-bg-primary-dimmed;
    box-shadow: none;
  }

  %operator {
    min-width: 48px;
    min-height: 48px;
  }

  %variable {
    width: 182px;
    min-height: 48px;
  }

  .dropzone {
    display: flex;
    flex-wrap: wrap;

    // needed because of placeholders dropzone placeholders
    /* stylelint-disable selector-max-universal */
    > *:not(:last-child) {
      margin-right: 8px;
    }

    // when dragging from outer list, this is how operator placeholder looks like
    /* stylelint-disable selector-max-specificity */
    :global(.sortable-chosen.operator).ghost-class {
      @extend %item-placeholder;
      @extend %operator;
    }

    // when dragging from outer list, this is how variable placeholder looks like
    :global(.sortable-chosen.variable).ghost-class {
      @extend %item-placeholder;
      @extend %variable;
    }
  }

  .item-wrapper {
    position: relative;
    margin-bottom: $value-item-wrapper-bottom-margin;

    :global(.variable) {
      min-width: 182px;
    }

    :global(.operator) {
      min-width: 48px;
    }

    &:hover:not(:global(.sortable-chosen)) .remove-icon {
      display: block;
    }

    // this is how placeholder looks when dragging elements inside the list
    &:global(.sortable-chosen) > * {
      &:global(.operator) {
        @extend %item-placeholder;
        @extend %operator;
      }

      &:global(.variable) {
        @extend %item-placeholder;
        @extend %variable;
      }
    }
  }

  .item {
    min-height: 48px;
  }

  .buttons {
    display: none;
    margin: 0 0 0 auto;
    padding-left: 0;
  }

  .dropdown-content {
    min-width: 215px;

    padding-top: 8px;
    padding-bottom: 8px;

    border-radius: $base-border-radius;
    overflow: hidden;

    color: $color-text-main;
  }

  .dropdown-item {
    padding: 12px 15px;

    &:hover {
      background-color: $color-bg-pale-gray-two;
    }

    &.delete {
      color: $color-text-warning;
    }
  }

  .button {
    display: inline-block;
    list-style-type: none;

    cursor: pointer;

    &:not(:last-child) {
      margin-right: 15px;
    }

    /* stylelint-disable selector-max-type */
    svg path {
      fill: $color-text-primary;
    }
  }

  .remove-icon {
    display: none;
    position: absolute;
    cursor: pointer;
    top: 0;
    right: 0;
    transform: translateX(50%) translateY(-50%);
  }

  .badges {
    display: flex;
  }

  .badge-group {
    display: flex;

    &:not(:last-child) {
      margin-right: 8px;
    }
  }

  .badge {
    box-sizing: content-box;
    border: 3px solid $color-border-light;
    border-radius: 50%;

    &:not(:last-child) {
      margin-right: -20px;
    }
  }

  .separator {
    @include flex-center;

    height: 16px;
  }

  .tooltip.override {
    position: absolute;
    top: 100%;
    width: 100%;
    left: 0;
  }
</style>
