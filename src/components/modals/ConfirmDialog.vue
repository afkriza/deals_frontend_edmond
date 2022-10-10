<template>
  <ActionModal
    :title="title"
    :size="size"
    :submit-button-text="confirmText"
    :cancel-button-text="dismissText"
    :is-destructive="isDestructive"
    :reset-button-width="resetButtonWidth"
    :is-dark-themed="isDarkThemed"
    :is-loading="isLoading"
    :is-disabled="isDisabled"
    :o-btn="oBtn"
    @submit="onConfirmClick"
    @close="onDismissClick"
  >
    <template #headerContent>
      <h3 :class="$style.title">{{ title }}</h3>
    </template>
    <p v-if="$slots.default" :class="$style.textMain">
      <slot></slot>
    </p>
  </ActionModal>
</template>

<script>
  import ActionModal from 'components/modals/ActionModal';

  import { modalSizesEnum } from 'enums/modal-sizes';

  export default {
    components: {
      ActionModal
    },
    extends: ActionModal,
    props: {
      dismissText: {
        type: String,
        default: 'Dismiss'
      },
      confirmText: {
        type: String,
        default: 'Confirm'
      },
      size: {
        type: String,
        default: modalSizesEnum.DEFAULT
      }
    },
    data() {
      return {
        modalSizesEnum
      };
    },
    methods: {
      onDismissClick() {
        this.$emit('dismiss');
      },
      onConfirmClick() {
        this.$emit('confirm');
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .title {
    margin: 0;
  }

  .text-main {
    color: $color-text-main;
    margin: 0;
  }
</style>
