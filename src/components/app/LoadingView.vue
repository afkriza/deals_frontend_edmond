<template>
  <div
    :class="[$style.backdrop, { [$style.transparent]: transparent }]"
    @click.stop
  >
    <div :class="$style.loaderContainer">
      <BounceSpinner />
      <span :class="$style.loaderText">{{ loaderMessage }}</span>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import BounceSpinner from '@/components/core/BounceSpinner.vue';

  export default {
    components: {
      BounceSpinner
    },
    props: {
      loaderMessage: {
        type: String,
        default: 'Loading...'
      },
      transparent: Boolean
    },
    computed: {
      ...mapGetters(['currentUser'])
    },
    data() {
      return {};
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .backdrop {
    @include flex-center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: $color-bg-main-dimmed;
    z-index: $z-backdrop;

    &.transparent {
      background-color: transparent;
    }
  }

  .loader-container {
    @include flex-center;
    padding: 16px 32px 16px 24px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    background-color: $color-bg-light;
  }

  .loader-text {
    color: $color-gray-50;
    font-size: 17px;
    height: 22px;
    vertical-align: middle;

    margin-left: 32px;
  }
</style>
