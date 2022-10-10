<template>
  <action-modal
    title="Calculate total with"
    submitButtonText="Save"
    :size="modalSizesEnum.SMALL"
    @submit="onSubmit"
    @close="close"
  >
    <div :class="$style.radioWrapper">
      <radio-button
        v-for="option in Object.values(totalsFormOptions)"
        :key="option.title"
        :class="$style.radio"
        :value="activeTotalAsIndividual === option.value"
        verticalAlignment="top"
        @input="optionTrigger(option.value)"
      >
        <div :class="$style.title">
          {{ option.title }}
          <span v-if="option.default" :class="$style.disclaimer">
            (default)
          </span>
        </div>
        <p :class="$style.description">{{ option.description }}</p>
      </radio-button>
    </div>
  </action-modal>
</template>

<script>
  import ActionModal from 'components/modals/ActionModal';
  import RadioButton from 'components/core/RadioButton';

  import totalsFormOptions from 'enums/totals-form-options';
  import { modalSizesEnum } from 'enums/modal-sizes';

  export default {
    components: {
      ActionModal,
      RadioButton
    },

    props: {
      totalAsIndividual: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      optionTrigger(value) {
        this.activeTotalAsIndividual = value;
      },

      close() {
        this.$emit('close');
      },

      onSubmit() {
        this.$emit('totals:submit', this.activeTotalAsIndividual);
      }
    },

    data() {
      return {
        totalsFormOptions,
        modalSizesEnum,
        activeTotalAsIndividual: this.totalAsIndividual
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .radio-wrapper {
    padding-top: 35px;
    padding-bottom: 32px;

    max-width: 390px;
  }

  .radio:not(:last-child) {
    margin-bottom: 30px;
  }

  .title {
    font-weight: bold;
  }

  .disclaimer {
    font-weight: normal;
  }

  .description {
    margin: 5px 0 0;
  }

  .title,
  .description {
    font-size: 14px;
  }

  .disclaimer,
  .description {
    color: $color-text-main-lighter;
  }
</style>
