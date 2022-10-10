<template>
  <AppModal
    :title="title"
    :size="size"
    :width="width"
    :height="height"
    :disable-backdrop-closing="disableBackdropClosing"
    :show-close-icon="showCloseIcon"
    @close="close"
  >
    <!-- forward header and headerContent slots -->
    <template v-for="slot of ['header', 'headerContent']" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>

    <slot name="main">
      <div
        ref="content"
        :class="[
          $style.content,
          {
            [$style.scrollable]: scrollable,
            [$style.overflowingContent]: scrollable && isOverflowing
          }
        ]"
      >
        <slot />
      </div>
    </slot>

    <template #footerContent>
      <ButtonFlat
        v-if="showDelete"
        :class="[$style.button, $style.delete, oBtn]"
        @click="onDelete"
        >Delete</ButtonFlat
      >
      <ButtonFlat
        :class="[
          $style.button,
          {
            [$style.resetWidth]: resetButtonWidth,
            [$style.dark]: isDarkThemed
          },
          oBtn
        ]"
        @click="onCancel"
        >{{ cancelButtonText }}</ButtonFlat
      >
      <ButtonRegular
        :class="[
          $style.button,
          {
            [$style.resetWidth]: resetButtonWidth
          },
          oBtn
        ]"
        :theme="determineSubmitButtonTheme"
        :is-loading="isLoading"
        :disabled="isDisabled || isLoading"
        @click="onSubmit"
        >{{ submitButtonText }}</ButtonRegular
      >
    </template>
  </AppModal>
</template>

<script>
  import AppModal from 'components/modals/AppModal';

  import { PRIMARY, SECONDARY } from 'constants/button';

  import ButtonFlat from 'components/buttons/ButtonFlat';
  import ButtonRegular from 'components/buttons/ButtonRegular';

  export default {
    components: {
      AppModal,
      ButtonFlat,
      ButtonRegular
    },
    extends: AppModal,
    props: {
      isDestructive: {
        type: Boolean,
        default: false
      },
      submitButtonText: {
        type: String,
        default: 'Submit'
      },
      cancelButtonText: {
        type: String,
        default: 'Cancel'
      },
      isLoading: {
        type: Boolean,
        default: false
      },
      isDisabled: {
        type: Boolean,
        default: false
      },
      isDone: {
        type: Boolean,
        default: false
      },
      oBtn: {
        type: String,
        default: null
      },
      resetButtonWidth: {
        type: Boolean,
        default: false
      },
      isDarkThemed: {
        type: Boolean,
        default: false
      },
      showDelete: {
        type: Boolean,
        default: false
      },
      scrollable: Boolean
    },

    data() {
      return {
        isOverflowing: false
      };
    },
    computed: {
      determineSubmitButtonTheme() {
        return this.isDestructive ? SECONDARY : PRIMARY;
      }
    },
    mounted() {
      this.checkOverflow();
    },
    updated() {
      this.checkOverflow();
    },
    methods: {
      onCancel() {
        this.$emit('close');
      },
      onSubmit() {
        this.$emit('submit');
      },

      onDelete() {
        this.$emit('delete');
      },

      checkOverflow() {
        this.$nextTick(() => {
          let contentElement = this.$refs.content;

          if (contentElement) {
            this.isOverflowing =
              contentElement.clientHeight < contentElement.scrollHeight;
          }
        });
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .content {
    color: $color-text-main;
    line-height: 1.5;
    padding: 0 40px;
    height: 100%;

    &.scrollable {
      overflow-y: auto;
    }

    &.overflowing-content {
      border: {
        top: 1px solid $color-border-main-light;
        bottom: 1px solid $color-border-main-light;
      }
    }
  }

  .button {
    width: 136px;
    height: 48px;

    &:not(:last-child) {
      margin-right: 24px;
    }

    &.delete {
      color: $color-text-warning;
      margin-right: auto;
      margin-left: 6px;
    }

    &.dark {
      color: $color-text-main;
    }

    &.reset-width {
      width: auto;
    }
  }
</style>
