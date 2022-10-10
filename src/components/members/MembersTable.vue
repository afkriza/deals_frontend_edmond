<template>
  <div :class="$style.table">
    <header :class="$style.header">
      <div
        v-for="headerItem in headerItems"
        :key="headerItem.label"
        :class="$style.cell"
      >
        <h5 :class="$style.headerLabel">{{ headerItem.label }}</h5>
      </div>
    </header>
    <div id="data-container" :class="$style.dataContainer">
      <slot :members="members" />
    </div>
  </div>
</template>

<script>
  import { unitsTableHeaderTypes } from 'enums/units-table-header-types';

  export default {
    props: {
      members: {
        type: Array,
        required: true
      },
      headerItems: {
        type: Array,
        required: true
      }
    },

    data() {
      return {
        unitsTableHeaderTypes
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .table {
    @include column;
    min-height: 0;
    min-width: 900px;
  }

  .header {
    display: flex;

    margin: 0;

    padding-right: 20px;
    padding-left: 20px;

    border-bottom: 1px solid $color-border-main-light;

    background-color: $color-bg-light;

    z-index: 1;
  }

  .cell {
    flex: 1 0;
    font-weight: bold;
    text-transform: uppercase;
    color: $color-text-main-lighter;
    line-height: 20px;
    padding: 10px 0;
    display: flex;
  }

  .header-label {
    margin: 0;
  }

  .data-container {
    overflow-y: auto;
  }
</style>
