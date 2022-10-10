<template>
  <div :class="$style.item">
    <slot name="title">
      <span :class="$style.title" :style="titleStyle">{{ title }}</span>
    </slot>
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'GridItem',
    props: {
      title: {
        type: String,
        default: ''
      },
      titleSize: {
        type: String,
        default: '17px'
      }
    },
    computed: {
      titleStyle() {
        return {
          'font-size': this.titleSize
        };
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .item {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .title {
    display: block;
    line-height: 22px;
    color: $color-text-main-light;
  }
</style>
