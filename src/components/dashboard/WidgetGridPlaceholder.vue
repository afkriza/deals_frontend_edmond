<template>
  <div
    :class="$style.wrapper"
    :style="{
      '--gridPlaceholderItemWidth': widthPercentage,
      '--gridPlaceholderItemHeight': pixelify(rowHeight)
    }"
  >
    <div v-for="row in rowNum" :key="row" :class="$style.row">
      <div v-for="column in colNum" :key="column" :class="$style.column"></div>
    </div>
  </div>
</template>

<script>
  import { percentify, pixelify } from 'utils/string';

  export default {
    props: {
      colNum: {
        type: Number,
        required: true
      },

      rowNum: {
        type: Number,
        required: true
      },

      rowHeight: {
        type: Number,
        required: true
      }
    },

    computed: {
      widthPercentage() {
        return percentify(46 / this.colNum); // Magic number that works fow any number of columns
      }
    },

    data() {
      return {
        pixelify
      };
    },

    mounted() {
      this.$emit('mounted');
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .wrapper {
    @include stretch;
    margin-top: 16px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    padding: 0 16px;
  }

  .column {
    border: 2px dashed $color-bg-main-light;
    border-radius: 4px;
    min-width: var(--gridPlaceholderItemWidth);
    height: var(--gridPlaceholderItemHeight);
    margin-right: 16px;
    width: 100%;

    &:last-child {
      margin-right: 0;
    }
  }
</style>
