<template>
  <BaseModal
    :size="size"
    :width="width"
    :height="height"
    :disable-backdrop-closing="disableBackdropClosing"
    :show-close-icon="showCloseIcon"
    @close="close"
  >
    <slot name="header">
      <header :class="$style.header">
        <slot name="headerContent">
          <h2 :class="$style.title">{{ title }}</h2>
        </slot>
      </header>
    </slot>
    <slot></slot>
    <slot name="footer">
      <footer :class="$style.footer">
        <slot name="footerContent" />
      </footer>
    </slot>
  </BaseModal>
</template>

<script>
  import BaseModal from 'components/modals/BaseModal';

  export default {
    components: {
      BaseModal
    },
    extends: BaseModal,
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .header {
    padding: 48px 40px 24px;
  }

  .title {
    margin: 0;

    color: $color-text-main;
  }

  .footer {
    display: flex;
    justify-content: flex-end;

    padding: 26px 40px 30px;
  }
</style>
