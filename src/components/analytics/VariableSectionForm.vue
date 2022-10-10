<template>
  <div :class="$style.container">
    <!-- FIRST STEP -->
    <div v-if="isFirstStep" :class="$style.metricsWrapper">
      <div :class="$style.metrics">
        <div v-for="metric in metrics" :key="metric.id" :class="$style.metric">
          <div :class="$style.metricHeader">
            <span :class="$style.metricName">{{ metric.name }}</span>
          </div>
          <div
            v-for="context in metric.contexts"
            :key="context.id"
            :class="$style.context"
            @click="onMetricClick(context.id, metric.id)"
          >
            <span :class="$style.contextName">{{ context.id }}</span>
          </div>
        </div>
      </div>
    </div>
    <template v-else>
      <div :class="[$style.column, $style.secondStepContainer]">
        <div :class="$style.column">
          <span :class="$style.inputLabel">METRIC</span>
          <div :class="$style.activeMetric">
            <span :class="$style.activeMetricName">{{
              activeMetricFullName
            }}</span>
            <IconClose :class="$style.activeMetricClose" @click="resetValues" />
          </div>
        </div>
        <template v-if="withYearOffset || withSnapshotOffset">
          <div
            v-if="withYearOffset"
            :class="[$style.column, $style.offsetContainer]"
          >
            <div :class="$style.inputLabel">Booking year</div>
            <RadioButton
              v-for="year in offsetYears"
              :key="year.name"
              :label="year.name"
              theme="light"
              :class="$style.radioButton"
              :value="activeYearOffsetName === year.name"
              :condensed="true"
              :reverse="true"
              @input="onYearOffsetClick(year.value)"
            />
          </div>
          <div
            v-if="withSnapshotOffset"
            :class="[$style.column, $style.offsetContainer]"
          >
            <div :class="$style.inputLabel">Snapshot date</div>
            <RadioButton
              v-for="snapshot in offsetSnapshotsVisible"
              :key="snapshot.name"
              :label="snapshot.name"
              theme="light"
              :class="$style.radioButton"
              :value="
                !isSnapshotDateManualEnter &&
                activeSnapshotOffsetName === snapshot.name
              "
              :condensed="true"
              :reverse="true"
              @input="onSnapshotOffsetClick(snapshot.value)"
            />
            <RadioButton
              label="Enter manually"
              theme="light"
              :class="$style.radioButton"
              :value="isSnapshotDateManualEnter"
              :condensed="true"
              :reverse="true"
              @input="onSnapshotOffsetClick(-2)"
            />
            <div
              v-show="isSnapshotDateManualEnter"
              :class="$style.manualInputWrapper"
            >
              <ValidationField
                :v="$v.activeSnapshotOffsetValManualInput"
                :error-messages="errorMessagesSnapshotOffset"
                :class="$style.manualInput"
              >
                <template #default="{ isError, errorMessage }">
                  <InputNumber
                    :value="activeSnapshotOffsetValManualInput"
                    dark
                    transparent
                    :message="errorMessage"
                    :error="isError"
                    @change="activeSnapshotOffsetValManualInput = $event"
                  />
                </template>
              </ValidationField>

              <div :class="$style.manualInputText">
                days <br />
                ago
              </div>
            </div>
          </div>
        </template>
        <div :class="[$style.row, $style.variableNameWrapper]">
          <div :class="$style.fullwidthWrapper">
            <ValidationField
              :v="$v.activeName"
              :error-messages="errorMessagesVariableName"
            >
              <template #default="{ isError, errorMessage }">
                <InputText
                  v-model.trim="activeName"
                  label="Value name"
                  dark
                  transparent
                  :message="errorMessage"
                  :error="isError"
                  @focus="$v.activeName.$reset()"
                />
              </template>
            </ValidationField>
          </div>
        </div>
      </div>
    </template>

    <div :class="$style.buttons">
      <ButtonFlat :class="$style.btn" @click="onCancelClick">
        <span :class="[$style.textLight, $style.btnText]">Cancel</span>
      </ButtonFlat>

      <ButtonRegular
        v-if="!isFirstStep"
        :class="$style.btn"
        @click="submitForm"
      >
        <span :class="$style.btnText">{{ submitButtonText }}</span>
      </ButtonRegular>
    </div>
  </div>
</template>

<script>
  import ButtonFlat from 'components/buttons/ButtonFlat';
  import ButtonRegular from 'components/buttons/ButtonRegular';
  import RadioButton from 'components/core/RadioButton';

  import { offsetYears } from 'enums/offset-years';
  import { offsetSnapshots } from 'enums/offset-snapshots';

  import VariableModel from 'components/analytics/models/Variable.js';
  import ValidationField from '@/components/renderless/ValidationField';
  import InputText from '@/components/inputs/new/InputText';
  import { required } from 'vuelidate/lib/validators';
  import { errorMessagesFactory } from 'utils/validation';
  import InputNumber from '@/components/inputs/new/InputNumber.vue';
  import IconClose from '@/assets/images/icons/close-2px.svg';

  const SNAPSHOT_OFFSET_LOWER_BOUND = 2;
  const SNAPSHOT_OFFSET_UPPER_BOUND = 30;

  export default {
    components: {
      ButtonFlat,
      ButtonRegular,
      RadioButton,
      ValidationField,
      InputText,
      InputNumber,
      IconClose
    },

    props: {
      metrics: {
        type: Array,
        required: true
      },

      variable: {
        type: VariableModel,
        required: true
      },

      isEditMode: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        offsetYears,
        offsetSnapshots,
        customName: this.variable.name || '',
        activeYearOffsetVal: this.variable.yearOffset || 0,
        activeSnapshotOffsetVal: this.daysOffsetStartValue(),
        activeMetricID: this.variable.metric || null,
        activeMetricContextID: this.variable.context || null,
        activeVariableID: this.variable.variableId || null,
        isNameManualEnter: false
      };
    },

    validations: {
      activeName: {
        required
      },
      activeSnapshotOffsetValManualInput: {
        isValueValid(value) {
          return !this.isSnapshotDateManualEnter || (value >= 2 && value <= 30);
        }
      }
    },

    computed: {
      isFirstStep() {
        return !(this.activeMetricID && this.activeMetricContextID);
      },

      activeName: {
        get() {
          return this.isNameManualEnter
            ? this.customName
            : this.autoGeneratedName;
        },

        set(newName) {
          this.isNameManualEnter = Boolean(newName !== this.autoGeneratedName);
          this.customName = newName;
        }
      },

      submitButtonText() {
        return this.isEditMode ? 'Save' : 'Add';
      },

      activeMetric() {
        return this.metrics.find(({ id }) => id === this.activeMetricID);
      },

      activeMetricAbbr() {
        return this.activeMetric && this.activeMetric.abbreviation;
      },

      activeMetricContext() {
        return this.activeMetric
          ? this.activeMetric.contexts.find(
              ({ id }) => id === this.activeMetricContextID
            )
          : null;
      },

      activeMetricContextAbbr() {
        return (
          this.activeMetricContext && this.activeMetricContext.abbreviation
        );
      },

      activeMetricFullName() {
        return (
          this.activeMetric &&
          this.activeMetricContextID &&
          `${this.activeMetric.name} ${this.activeMetricContextID}`
        );
      },

      withYearOffset() {
        return (
          this.activeMetricContext &&
          this.activeMetricContext.offsets.includes('year')
        );
      },

      withSnapshotOffset() {
        return (
          this.activeMetricContext &&
          this.activeMetricContext.offsets.includes('snapshot')
        );
      },

      activeSnapshotOffset() {
        const activeSnapshot = Object.values(offsetSnapshots).find(
          ({ value }) => value === this.activeSnapshotOffsetVal
        );

        return (
          activeSnapshot || {
            name: `${-this.activeSnapshotOffsetVal} days ago`,
            abbreviation: `${this.activeSnapshotOffsetVal}d`
          }
        );
      },

      activeSnapshotOffsetName() {
        return this.activeSnapshotOffset && this.activeSnapshotOffset.name;
      },

      activeSnapshotOffsetAbbr() {
        return (
          this.activeSnapshotOffset && this.activeSnapshotOffset.abbreviation
        );
      },

      activeYearOffset() {
        return Object.values(offsetYears).find(
          ({ value }) => value === this.activeYearOffsetVal
        );
      },

      activeYearOffsetName() {
        return this.activeYearOffset && this.activeYearOffset.name;
      },

      activeYearOffsetAbbr() {
        return this.activeYearOffset && this.activeYearOffset.abbreviation;
      },

      autoGeneratedName() {
        return [
          this.activeMetricAbbr,
          this.activeMetricContextAbbr,
          this.activeYearOffsetAbbr,
          this.activeSnapshotOffsetAbbr
        ]
          .filter(Boolean)
          .join(' ');
      },

      offsetSnapshotsVisible() {
        const { FROM_FILTER, TODAY, YESTERDAY } = this.offsetSnapshots;
        return [FROM_FILTER, TODAY, YESTERDAY];
      },

      activeSnapshotOffsetValManualInput: {
        get() {
          return -this.activeSnapshotOffsetVal;
        },

        set(snapshotOffset) {
          if (!snapshotOffset) {
            return;
          }

          if (snapshotOffset < SNAPSHOT_OFFSET_LOWER_BOUND) {
            snapshotOffset = SNAPSHOT_OFFSET_LOWER_BOUND;
          }

          if (snapshotOffset > SNAPSHOT_OFFSET_UPPER_BOUND) {
            snapshotOffset = SNAPSHOT_OFFSET_UPPER_BOUND;
          }

          this.activeSnapshotOffsetVal = -Number(snapshotOffset);
        }
      },

      isSnapshotDateManualEnter() {
        return this.activeSnapshotOffsetVal <= -2;
      },

      errorMessagesVariableName() {
        return errorMessagesFactory({
          required: "Name can't be blank"
        });
      },

      errorMessagesSnapshotOffset() {
        return errorMessagesFactory({
          isValueValid: 'Value must be between 2 and 30'
        });
      }
    },

    created() {
      this.isNameManualEnter = this.customName !== this.autoGeneratedName;
    },

    methods: {
      daysOffsetStartValue() {
        if (this.variable.dayOffset === null) {
          return null;
        }
        return this.variable.dayOffset || 0;
      },

      onMetricClick(contextID, metricID) {
        this.activeMetricID = metricID;
        this.activeMetricContextID = contextID;
      },

      onYearOffsetClick(offset) {
        this.activeYearOffsetVal = offset;
      },

      onSnapshotOffsetClick(offset) {
        this.activeSnapshotOffsetVal = offset;
      },

      onCancelClick() {
        this.$emit('form:close');
      },

      resetValues() {
        this.customName = '';
        this.activeSnapshotOffsetVal = 0;
        this.activeYearOffsetVal = 0;
        this.activeMetricID = null;
        this.activeMetricContextID = null;
        this.isNameManualEnter = false;
      },

      submitForm() {
        this.$v.$touch();

        if (this.$v.$invalid) {
          return;
        }

        const variable = VariableModel.from({
          variableId: this.activeVariableID,
          name: this.activeName,
          metric: this.activeMetricID,
          context: this.activeMetricContextID,
          yearOffset: this.withYearOffset ? this.activeYearOffsetVal : 0,
          dayOffset: this.withSnapshotOffset ? this.activeSnapshotOffsetVal : 0
        });

        this.$emit('form:submit', variable);
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  $metric-icon-size: 24px;

  .container {
    @include column;
    min-height: 0;
    width: 100%;
    padding-top: 16px;
  }

  .row {
    @include row;
    margin-bottom: 24px;
  }

  .fullwidth-wrapper {
    width: 100%;
  }

  .input-label {
    font-weight: bold;
    line-height: 16px;
    letter-spacing: 0.2px;
    text-transform: uppercase;
    font-size: 12px;

    margin-bottom: 16px;

    color: $color-text-main-lighter;
  }

  .metrics-wrapper {
    @include column;
    min-height: 0;

    border-bottom: 1px solid $color-border-primary-mid;
  }

  .metrics {
    padding: 0 25px;
  }

  /* stylelint-disable selector-max-type */
  .icon > path {
    fill: $color-border-main-mid;
  }

  .second-step-container {
    min-height: 0;
    padding: 0 24px;
  }

  .active-metric {
    @include flex-center;
    justify-content: space-between;
    background-color: $color-bg-light;
    border-radius: 4px;
    height: 32px;
    padding: 0 16px;

    &-name {
      color: $color-text-primary;
      text-transform: capitalize;
      line-height: 20px;
    }

    &-close {
      cursor: pointer;
      path {
        fill: $color-text-primary;
      }
    }
  }

  .offset-container {
    margin-top: 32px;
  }

  .manual-input-wrapper {
    display: flex;
    position: relative;
    margin-left: 30px;
  }

  .manual-input {
    width: 120px;
    margin-right: 12px;
  }

  .manual-input-text {
    color: $color-text-main-lighter;
    pointer-events: none;
  }

  .metric {
    &:not(:last-child) {
      margin-bottom: 36px;
    }

    &-header {
      @include flex-center;
      justify-content: flex-start;
      margin-bottom: 12px;
    }

    &-name {
      position: relative;

      font-size: 12px;
      font-weight: bold;
      letter-spacing: 0.2px;
      line-height: 16px;

      color: $color-text-main-lighter;
      text-transform: uppercase;
    }
  }

  .context {
    @include flex-center;
    justify-content: flex-start;
    background-color: $color-bg-primary-mid;
    border-radius: 4px;
    margin-bottom: 8px;
    height: 32px;
    padding-left: 16px;

    &:hover {
      cursor: pointer;
      background-color: $color-bg-primary-darker;
    }

    &-name {
      color: $color-text-light;
      text-transform: capitalize;
    }
  }

  .column {
    @include column;
    flex: 0 1 auto;
  }

  .radio-button {
    margin-bottom: 14px;
  }

  .metric-context {
    padding-left: 35px;
    text-transform: capitalize;
  }

  .variable-name-wrapper {
    margin-top: 16px;
    position: relative;
  }

  .halfwidth-wrapper {
    width: calc(50% - 12px);

    &:not(:last-child) {
      margin-right: 20px;
    }
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 12px;
    padding-right: 24px;
    min-height: 56px;
    margin-top: auto;
  }

  .btn {
    width: 88px;
    height: 32px;

    &-text {
      font-size: 12px;
    }
  }

  .text-light {
    color: $color-text-light;
  }
</style>
