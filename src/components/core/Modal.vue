<template>
  <div ref="backdrop" :class="$style.backdrop" @mousedown="onBackdropMousedown">
    <div :class="[$style.modal, $style[size]]">
      <header :class="$style.header">
        <h2 :class="[$style.title, $style.textMain]">
          {{ title }}
        </h2>
      </header>
      <div :class="$style.content">
        <slot />
      </div>

      <div v-if="hasButton" :class="$style.buttons">
        <button-flat
          v-if="hasCancelButton"
          :theme="determineButtonTheme"
          :class="[$style.button, btnClass]"
          @click="close"
        >
          <span :class="{ [$style.textMain]: isDestructive }">{{
            cancelButtonText
          }}</span>
        </button-flat>
        <button-regular
          v-if="hasSubmitButton"
          :theme="determineButtonTheme"
          :class="[$style.button, btnClass]"
          :isLoading="loading"
          :disabled="!submittable || loading"
          @click="onSubmit"
        >
          {{ submitButtonText }}
        </button-regular>
      </div>
    </div>
  </div>
</template>

<script>
  import ButtonRegular from 'components/buttons/ButtonRegular';
  import ButtonOutline from 'components/buttons/ButtonOutline';
  import ButtonFlat from 'components/buttons/ButtonFlat';

  import { modalTypesEnum } from 'enums/modal-types';
  import { modalSizesEnum } from 'enums/modal-sizes';

  import { PRIMARY, SECONDARY } from 'constants/button';

  export default {
    components: {
      ButtonRegular,
      ButtonOutline,
      ButtonFlat
    },

    props: {
      title: {
        type: String,
        default: ''
      },

      type: {
        type: String,
        default: modalTypesEnum.DEFAULT
      },

      size: {
        type: String,
        default: modalSizesEnum.DEFAULT
      },

      customModalClass: {
        type: String,
        default: ''
      },

      submitButtonText: {
        type: String,
        default: 'Save'
      },

      cancelButtonText: {
        type: String,
        default: 'Cancel'
      },

      loading: {
        type: Boolean,
        default: false
      },

      submittable: {
        type: Boolean,
        default: true
      },

      // HACK: temporary before modal refactor is merged
      btnClass: {
        type: String,
        default: ''
      }
    },

    computed: {
      hasSubmitButton() {
        return Boolean(this.$listeners && this.$listeners.submit);
      },

      hasCancelButton() {
        return Boolean(this.$listeners && this.$listeners.close);
      },

      hasButton() {
        return this.hasSubmitButton || this.hasCancelButton;
      },

      isDestructive() {
        return this.type === modalTypesEnum.DESTRUCTIVE;
      },

      determineButtonTheme() {
        let buttonTheme = PRIMARY;

        if (this.isDestructive) {
          buttonTheme = SECONDARY;
        }

        return buttonTheme;
      }
    },

    methods: {
      close() {
        this.$emit('close');
      },

      onBackdropMousedown(event) {
        if (event.target === this.$refs.backdrop) {
          this.close();
        }
      },

      onSubmit() {
        this.$emit('submit');
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .backdrop {
    @include flex-center;
    @include stretch;
    position: fixed;
    z-index: $z-backdrop;

    background-color: $color-bg-backdrop;
  }

  .modal {
    width: 100%;
    padding: 40px 40px 30px 40px;

    background-color: $color-bg-light;
    box-shadow: $modal-shadow;

    border-radius: $base-border-radius;

    &.default {
      max-width: 760px;
    }

    &.small {
      max-width: 545px;
    }
  }

  .header {
    margin-bottom: 20px;
  }

  .title {
    font-size: 24px;
    line-height: 1.33;
    margin: 0;
  }

  .text-main {
    color: $color-text-main;
  }

  .content {
    font-size: 16px;
    line-height: 1.5;
    color: $color-text-main;
  }

  .buttons {
    text-align: right;
    margin-top: 40px;
  }

  /* stylelint-disable selector-max-specificity */
  .button {
    vertical-align: top;

    min-width: 136px;
    min-height: 48px;
  }
</style>
