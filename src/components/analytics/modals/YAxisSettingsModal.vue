<template>
  <action-modal
    title="Y-axis"
    :size="modalSizesEnum.SMALL"
    submitButtonText="Save"
    @submit="onSubmit"
    @close="close"
  >
    <div :class="$style.wrapper">
      <checkbox-field
        :checked="seriesSettings_.opposite"
        :condensed="true"
        :reverse="true"
        @checked:update="toggleYAxisSeparation"
      >
        <span :class="$style.label">Use secondary Y-axis</span>
      </checkbox-field>
      <p :class="$style.description">
        The data for this calculation will be shown on a secondary Y-axis
      </p>
    </div>
  </action-modal>
</template>

<script>
  import CheckboxField from 'components/core/Checkbox';
  import ActionModal from 'components/modals/ActionModal';

  import { modalSizesEnum } from 'enums/modal-sizes';

  import SeriesSettingsModel from 'components/analytics/models/SeriesSettings';

  export default {
    components: {
      CheckboxField,
      ActionModal
    },

    props: {
      seriesSettings: {
        type: SeriesSettingsModel,
        default: null
      }
    },

    methods: {
      toggleYAxisSeparation() {
        this.seriesSettings_.opposite = !this.seriesSettings_.opposite;
      },

      onSubmit() {
        this.$emit('submit', this.seriesSettings_);
      },

      close() {
        this.$emit('close');
      }
    },

    data() {
      return {
        modalSizesEnum,
        seriesSettings_: this.seriesSettings
          ? SeriesSettingsModel.from(this.seriesSettings)
          : SeriesSettingsModel.from()
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';
  .wrapper {
    margin-top: 25px;
  }

  .label {
    color: $color-text-main;
    font-weight: bold;
  }

  .description {
    color: $color-text-main-lighter;
    margin: 2px 0 32px 30px;
    width: 280px;
  }
</style>
