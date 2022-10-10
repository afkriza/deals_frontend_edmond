<template>
  <ActionModal
    title="Mixed chart series type"
    :size="modalSizesEnum.SMALL"
    submit-button-text="Save"
    @submit="onSubmit"
    @close="close"
  >
    <SegmentControl
      v-model="seriesSettings_.seriesType"
      :class="$style.multiSwitch"
      :options="types"
    />

    <CheckboxField
      :checked="seriesSettings_.opposite"
      :condensed="true"
      :reverse="true"
      @checked:update="toggleYAxisSeparation"
    >
      <span :class="$style.label">Use secondary Y-axis</span>
    </CheckboxField>
    <p :class="$style.description">
      The data for this calculation will be shown on a secondary Y-axis
    </p>
  </ActionModal>
</template>

<script>
  import CheckboxField from 'components/core/Checkbox';
  import ActionModal from 'components/modals/ActionModal';

  import { map, capitalize } from 'lodash';
  import { modalSizesEnum } from 'enums/modal-sizes';

  import { LINE, BAR, AREA } from 'constants/series-types';

  import SeriesSettingsModel from 'components/analytics/models/SeriesSettings';
  import SegmentControl from '@/components/inputs/SegmentControl';

  export default {
    components: {
      SegmentControl,
      CheckboxField,
      ActionModal
    },

    props: {
      seriesSettings: {
        type: [SeriesSettingsModel, null],
        default: null
      }
    },

    data() {
      return {
        modalSizesEnum,
        seriesSettings_: this.seriesSettings
          ? SeriesSettingsModel.from(this.seriesSettings)
          : SeriesSettingsModel.from()
      };
    },

    computed: {
      types() {
        return map([LINE, BAR, AREA], id => ({ id, label: capitalize(id) }));
      }
    },

    methods: {
      capitalize,

      toggleSeriesType(type) {
        if (!type) {
          return;
        }

        this.seriesSettings_.seriesType = type;
      },

      toggleYAxisSeparation() {
        this.seriesSettings_.opposite = !this.seriesSettings_.opposite;
      },

      onSubmit() {
        this.$emit('submit', this.seriesSettings_);
      },

      close() {
        this.$emit('close');
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .multi-switch {
    width: 237px;

    margin-bottom: 42px;
    margin-top: 24px;

    height: 36px;
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
