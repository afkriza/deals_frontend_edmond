<template>
  <header :class="$style.header">
    <h3 :class="$style.title">{{ title }}</h3>
    <slot />
    <IconClose :class="$style.close" @click="onClose" />
  </header>
</template>

<script lang="ts">
  import { Vue, Component, Emit, Prop } from 'vue-property-decorator';
  import IconClose from '@/assets/images/icons/close-2px.svg';

  @Component({
    components: {
      IconClose
    }
  })
  export default class GroupsHeader extends Vue {
    @Prop({
      type: String,
      default: ''
    })
    readonly title: string;

    @Emit('close')
    onClose() {
      return true;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .header {
    @include row;

    align-items: center;

    padding: 18px 24px;

    border-bottom: 1px solid $color-border-main-light;
    background-color: $color-bg-light;
  }

  .title {
    margin: 0;
  }

  .close {
    margin-left: auto;
    cursor: pointer;
  }
</style>
