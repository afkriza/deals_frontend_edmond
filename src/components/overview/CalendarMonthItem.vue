<template>
  <div :class="$style[layout]">
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'CalendarItem',
    props: {
      layout: {
        type: String,
        default: 'card',
        validator(value) {
          return ['card', 'small-card', 'row'].includes(value);
        }
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .row {
    padding: 12px 8px;
  }

  .small-card {
    padding: 10px 8px 0;
  }

  .card {
    padding: 12px 16px 22px;
  }
</style>
