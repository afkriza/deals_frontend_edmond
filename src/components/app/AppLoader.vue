<template>
  <div :class="[$style.spinner, { [$style.dark]: dark }]">
    <BounceSpinner :dark="dark" />
    <span v-if="loadingText">{{ loadingText }}</span>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';

  import BounceSpinner from '@/components/core/BounceSpinner.vue';

  @Component({
    name: 'AppLoader',
    components: {
      BounceSpinner
    }
  })
  export default class AppLoader extends Vue {
    @Prop({
      type: String
    })
    readonly loadingText: string;

    @Prop({
      type: Boolean
    })
    readonly dark: boolean;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .spinner {
    @include flex-center($flex-direction: column);
    color: $color-text-main-light;
    height: 100%;

    &.dark {
      color: $color-text-main-mild-light;
    }

    > * + * {
      margin-top: 40px;
    }
  }
</style>
