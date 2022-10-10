<template>
  <div :class="$style.container">
    <IconRequestStatusError />
    <span v-if="text" :class="$style.text">{{ text }}</span>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import IconRequestStatusError from '@/assets/images/icons/request-status-error.svg';

  @Component({
    components: { IconRequestStatusError }
  })
  export default class RequestStatusError extends Vue {
    @Prop({
      type: String,
      default: ''
    })
    readonly text: string;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    @include flex-center;

    > * + .text {
      margin-left: 16px;
    }
  }

  .text {
    font-weight: bold;
    line-height: 20px;
    color: $color-text-warning;
  }
</style>
