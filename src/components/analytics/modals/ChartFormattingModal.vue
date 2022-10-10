<template>
  <ActionModal
    :title="title"
    submit-button-text="Save"
    cancel-button-text="Cancel"
    width="545px"
    @submit="onSubmit"
    @close="close"
  >
    <div :class="$style.content">
      <div>
        <label for="colors" :class="$style.label">Color</label>
        <ColorPalette
          id="colors"
          :class="$style.colors"
          v-model="formatting_.color"
          :colors="chartColors"
          large
        />
      </div>
      <div v-if="isVisualFormatting">
        <label for="switch" :class="$style.label">Line style</label>
        <MultiSwitchButtons
          :class="$style.lineStyle"
          :switcher-modes="visualFormattingTypes"
          :current-switcher-mode="formatting_.lineStyle"
          @change="onFormattingChange('lineStyle', $event)"
        >
          <template v-slot="{ switcherMode }">
            <component :is="visualFormattingTypesIcons[switcherMode]" />
          </template>
        </MultiSwitchButtons>

        <label for="switch" :class="$style.label">Line thickness</label>
        <MultiSwitchButtons
          :switcher-modes="visualFormattingLineThickness"
          :current-switcher-mode="formatting_.lineThickness"
          @change="onFormattingChange('lineThickness', $event)"
        >
          <template v-slot="{ switcherMode }">
            <component :is="visualFormattingLineThicknessIcons[switcherMode]" />
          </template>
        </MultiSwitchButtons>
      </div>
    </div>
  </ActionModal>
</template>

<script>
  import ActionModal from 'components/modals/ActionModal';
  import ChartFormattingModel from 'components/analytics/models/ChartFormatting';
  import MultiSwitchButtons from 'components/core/MultiSwitchButtons';
  import ColorPalette from 'components/app/ColorPalette';

  import visualFormattingTypes, {
    visualFormattingTypesEnum
  } from 'enums/visual-formatting-types';
  import visualFormattingLineThickness, {
    visualFormattingLineThicknessEnum
  } from 'enums/visual-formatting-line-thickness';
  import { chartColors } from 'enums/chart-picker-colors';
  import { capitalize } from 'utils/string';
  import { VISUAL } from 'constants/chart-modal-types';
  import chartModalTypes from 'enums/chart-modal-types';

  import SolidLine from '@/assets/images/icons/solid-line.svg';
  import DashedLine from '@/assets/images/icons/dashed-line.svg';
  import DottedLine from '@/assets/images/icons/dotted-line.svg';

  import ThinLine from '@/assets/images/icons/thin-line.svg';
  import MediumLine from '@/assets/images/icons/medium-line.svg';
  import ThickLine from '@/assets/images/icons/thick-line.svg';

  export default {
    components: {
      ActionModal,
      MultiSwitchButtons,
      ColorPalette,
      SolidLine,
      DashedLine,
      DottedLine
    },

    props: {
      formatting: {
        type: ChartFormattingModel,
        default: null
      },

      chartModalType: {
        type: Object,
        default: chartModalTypes[VISUAL]
      }
    },

    computed: {
      title() {
        return this.chartModalType.title;
      },

      isVisualFormatting() {
        return this.chartModalType.type === VISUAL;
      },

      visualFormattingTypesIcons() {
        return {
          [visualFormattingTypesEnum.SOLID]: SolidLine,
          [visualFormattingTypesEnum.DASHED]: DashedLine,
          [visualFormattingTypesEnum.DOTTED]: DottedLine
        };
      },

      visualFormattingLineThicknessIcons() {
        return {
          [visualFormattingLineThicknessEnum.THIN]: ThinLine,
          [visualFormattingLineThicknessEnum.MEDIUM]: MediumLine,
          [visualFormattingLineThicknessEnum.THICK]: ThickLine
        };
      }
    },

    methods: {
      capitalize,

      close() {
        this.$emit('close');
      },

      onFormattingChange(prop, value) {
        if (!value || this.formatting_[prop] === value) {
          return;
        }

        this.formatting_[prop] = value;
      },

      onSubmit() {
        this.$emit('chartFormatting:submit', this.formatting_);
      }
    },

    data() {
      return {
        chartColors,
        visualFormattingTypesEnum,
        visualFormattingTypes,
        visualFormattingLineThicknessEnum,
        visualFormattingLineThickness,
        formatting_: this.formatting
          ? ChartFormattingModel.from(this.formatting)
          : ChartFormattingModel.from()
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';
  .content {
    display: grid;
    grid-column-gap: 64px;
    grid-template-columns: 1fr 1fr;
    padding-top: 25px;
    padding-bottom: 44px;
  }

  .label {
    display: inline-block;
    margin-bottom: 12px;
    color: $color-text-main-light;
    line-height: 16px;
  }

  .line-style {
    margin-bottom: 32px;
  }

  .colors {
    margin: 0;
    padding: 0;
    width: 184px;
  }
</style>
