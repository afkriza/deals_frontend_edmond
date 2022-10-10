<template>
  <div :class="$style.sidebarGrid" :style="sidebarGridStyle">
    <template v-for="(_, row) in numberOfRows">
      <div :class="$style.row">
        <template v-for="(item, column) in rowItems(row)">
          <slot :index="row * numberOfColumns + column" :item="item" />
        </template>
      </div>
    </template>
  </div>
</template>

<script>
  import { size, ceil, slice } from 'lodash';

  export default {
    name: 'SidebarGrid',
    props: {
      items: {
        type: Array,
        default: () => {
          return [];
        }
      },
      numberOfColumns: {
        type: Number,
        default: 1
      },
      itemWidth: {
        type: String,
        default: '380px'
      }
    },
    computed: {
      numberOfRows() {
        return ceil(size(this.items) / this.numberOfColumns);
      },
      sidebarGridStyle() {
        if (this.items.length === 1) {
          return { 'grid-template-columns': '1fr' };
        }
        let style = '';

        for (let index = 0; index < this.numberOfColumns; index++) {
          style += ' 1fr';
        }
        return { 'grid-template-columns': style };
      }
    },
    methods: {
      rowItems(row) {
        const start = row * this.numberOfColumns;
        return slice(this.items, start, start + this.numberOfColumns);
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .sidebar-grid {
    display: grid;
  }

  .row {
    display: contents;

    > * {
      border-right: 1px solid $color-border-main-light;
    }
  }
</style>
