<template>
  <div :class="$style.grid" :style="gridStyle" v-on="$listeners">
    <template v-for="(n, i) in numberOfRows">
      <template v-for="(k, j) in actualNumberOfColumns">
        <div
          :class="[
            $style.item,
            borderType(i, j),
            { [$style.stripe]: isCellStriped(i) }
          ]"
          :style="gridItemStyle(j)"
        >
          <slot name="tile" v-bind="tileProps(i, j)" v-if="isDataCell(j)" />
        </div>
      </template>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'OverviewGrid',
    props: {
      numberOfRows: {
        type: Number,
        default: 6
      },
      numberOfColumns: {
        type: Number,
        default: 7
      },
      cellWidth: {
        type: String,
        default: '295px'
      },
      cellHeight: {
        type: String,
        default: '150px'
      },
      isStriped: {
        type: Boolean,
        default: true
      },
      isInverted: {
        type: Boolean,
        default: false
      },
      hasBorder: {
        type: Boolean,
        default: true
      },
      showRowBorder: {
        type: Boolean,
        default: true
      },
      showColumnBorder: {
        type: Boolean,
        default: true
      },
      leftPadding: {
        type: String,
        default: '0px'
      },
      rightPadding: {
        type: String,
        default: '0px'
      }
    },
    computed: {
      gridStyle() {
        return {
          'grid-template-columns': `1fr repeat(${this.numberOfColumns}, ${this.cellWidth}) 1fr`,
          'grid-template-rows': `repeat(${this.numberOfRows}, minmax(${this.cellHeight}, 1fr))`
        };
      },

      numberOfCells() {
        return this.numberOfRows * this.actualNumberOfColumns;
      },

      actualNumberOfColumns() {
        return this.numberOfColumns + 2;
      }
    },
    methods: {
      gridItemStyle(column) {
        if (column === 0) {
          return {
            'padding-left': this.leftPadding
          };
        }

        if (column === this.actualNumberOfColumns - 1) {
          return {
            'padding-right': this.rightPadding
          };
        }
      },

      isDataCell(columnIndex) {
        return (
          columnIndex !== 0 && columnIndex !== this.actualNumberOfColumns - 1
        );
      },

      tileProps(rowIndex, columnIndex) {
        let lostCellsFromBefore = rowIndex * 2;
        lostCellsFromBefore += 1;

        // skip first and last columns and keep the same interface as before
        return {
          index:
            rowIndex * (this.numberOfColumns + 2) +
            columnIndex -
            lostCellsFromBefore,
          row: rowIndex,
          column: columnIndex - 1
        };
      },

      borderType(row, column) {
        const result = [];

        // if no border then return empty array
        if (!this.hasBorder) {
          return result;
        }

        // first and last 2 columns should not have right border
        if (
          this.showColumnBorder &&
          column !== this.numberOfColumns &&
          column !== 0 &&
          column !== this.numberOfColumns + 1
        ) {
          result.push(this.$style.rightBorder);
        }

        // last row should not have bottom border
        if (this.showRowBorder && row !== this.numberOfRows - 1) {
          result.push(this.$style.bottomBorder);
        }

        return result;
      },

      isCellStriped(row) {
        if (!this.isStriped) {
          return false;
        }

        let isStriped = row % 2 === 1;

        if (this.isInverted) {
          isStriped = !isStriped;
        }

        return isStriped;
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .grid {
    display: grid;
    min-width: min-content;
  }

  .item {
    background-color: $color-bg-main-dimmed;

    &.right-border {
      border-right: 1px solid $color-border-main-light;
    }

    &.bottom-border {
      border-bottom: 1px solid $color-border-main-light;
    }
  }

  .stripe {
    background-color: $color-bg-light;
  }
</style>
