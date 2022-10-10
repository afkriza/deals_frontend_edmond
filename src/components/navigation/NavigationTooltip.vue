<template>
  <base-tooltip :contentClass="contentClass" :offset-y="tooltipYOffset">
    <div v-if="title" :class="$style.header">
      <span :class="$style.title">
        {{ title }}
      </span>
    </div>
    <slot />
  </base-tooltip>
</template>
<script>
  import BaseTooltip from 'components/core/BaseTooltip';

  export default {
    name: 'NavigationTooltip',
    components: {
      BaseTooltip
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      contentClass: {
        type: String
      },
      tooltipYOffset: {
        type: String
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .header {
    padding: 6px 16px;
  }

  .title {
    font-size: 14px;
    font-weight: bold;
    color: $color-text-main;
    line-height: 1.43;
  }
</style>
