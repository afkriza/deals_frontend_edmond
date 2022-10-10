<template>
  <div :class="$style.updateTag">{{ updateText }}</div>
</template>

<script>
  export default {
    name: 'DealUpdatesTag',
    props: {
      numOfUpdates: {
        type: Number,
        required: true
      }
    },
    computed: {
      updateText() {
        return `${this.numOfUpdates} ${
          this.numOfUpdates > 1 ? 'updates' : 'update'
        }`;
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .update-tag {
    max-width: fit-content;
    padding: 2px 10px;
    color: $color-text-light;
    font-weight: bold;
    background-color: $color-bg-secondary;
    border-radius: 100px;
    white-space: nowrap;
  }
</style>
