<template>
  <div :class="$style.table" @scroll="onTableScroll">
    <div
      v-if="hasRowHeader"
      :class="[
        $style.rowHeader,
        $style[density],
        scrollState.horizontal ? $style.scroll : null
      ]"
    >
      <div
        :class="[
          $style.rowHeaderPlaceholder,
          scrollState.horizontal && scrollState.vertical ? $style.scroll : null
        ]"
        :style="{ height: columnHeaderHeight }"
      ></div>
      <div
        v-for="groupId in rowHeader.groupIds"
        :key="groupId"
        :class="[$style.rowHeaderGroup, $style[density]]"
      >
        <div
          v-for="(categoryId, depth) in categoriesByGroupId(
            'rowHeader',
            groupId
          ).categoryIds"
          :key="categoryId"
          :class="$style.rowHeaderGroupColumn"
        >
          <div
            v-for="(_, rowHeaderGroupIndex) in numberOfHeaderGroups(
              'rowHeader',
              groupId,
              depth
            )"
            :key="rowHeaderGroupIndex"
            :class="$style.rowHeaderGroupColumnGroup"
          >
            <div
              v-for="categoryValue in categoryValuesByDepth(
                'rowHeader',
                groupId,
                depth
              )"
              :key="categoryValue"
              :class="[$style.rowHeaderItemWrapper, $style[density]]"
            >
              <div :class="$style.rowHeaderItemWrapperHelper">
                <text-ellipsis
                  :key="density"
                  :class="[$style.rowHeaderItem, $style[density]]"
                  :text="categoryValue"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="$style.main">
      <div
        v-if="hasColumnHeader"
        ref="columnHeader"
        :class="[
          $style.columnHeader,
          scrollState.vertical ? $style.scroll : null
        ]"
      >
        <div
          v-for="groupId in columnHeader.groupIds"
          :key="groupId"
          :class="$style.columnHeaderGroup"
          :style="{
            flexBasis: `${(numberOfHeaderGroupItems('columnHeader', groupId) /
              totalNumberOfColumns) *
              100}%`
          }"
        >
          <div
            v-for="(categoryId, depth) in categoriesByGroupId(
              'columnHeader',
              groupId
            ).categoryIds"
            :key="categoryId"
            :class="[
              $style.columnHeaderGroupRow,
              depthClass('columnHeader', groupId, depth),
              $style[density]
            ]"
          >
            <div
              v-for="(_, columnHeaderGroupIndex) in numberOfHeaderGroups(
                'columnHeader',
                groupId,
                depth
              )"
              :key="columnHeaderGroupIndex"
              :class="[
                $style.columnHeaderGroupRowGroup,
                depthClass('columnHeader', groupId, depth)
              ]"
            >
              <div
                v-for="categoryValue in categoryValuesByDepth(
                  'columnHeader',
                  groupId,
                  depth
                )"
                :key="categoryValue"
                :class="[
                  $style.columnHeaderItemWrapper,
                  depthClass('columnHeader', groupId, depth),
                  $style[density]
                ]"
              >
                <text-ellipsis :key="density" :text="categoryValue" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div :class="$style.content">
        <div
          v-for="(_, column) in totalNumberOfColumns"
          :key="column"
          :class="[
            $style.contentColumn,
            $style[density],
            separatedColumns.includes(column) ? $style.separator : null
          ]"
        >
          <div
            v-for="(_, row) in totalNumberOfRows"
            :key="row"
            :class="[
              $style.contentRowWrapper,
              $style[density],
              {
                [$style.spaced]: spacedRows.includes(row),
                [$style.separator]: separatedRows.includes(row)
              }
            ]"
          >
            <div
              :class="[$style.contentRow, $style[density]]"
              :is-first="column === 0"
              :is-last="column === totalNumberOfColumns - 1"
              :is-striped="row % 2 === 0"
            >
              <slot
                :columns="columnPaths[column]"
                :data="dataMatrix[row][column]"
                :rows="rowPaths[row]"
                name="dataCell"
              >
                <text-ellipsis
                  :key="density"
                  :text="
                    dataMatrix[row][column] && dataMatrix[row][column].value
                      ? dataMatrix[row][column].value.toString()
                      : '-'
                  "
                />
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator';
  import { VTooltip } from 'v-tooltip';

  import { forEach, isMatch, rangeRight, size, sum, map } from 'lodash';
  import { hasProperties } from '@/utils/validation';
  import TextEllipsis from '@/components/core/TextEllipsis.vue';

  interface TableHeader {
    groupIds: string[];
    categoriesByGroupId: {
      [key: string]: {
        categoryIds: string[];
        categoryValuesByCategoryId: { [key: string]: string[] };
      };
    };
  }

  interface TableData {
    /*
  Row position of the data cell
 */
    row: { [id: string]: string };

    /*
  Column position of the data cell
 */
    column: { [id: string]: string };

    /*
  Value rendered inside the data cell
 */
    value: string | number;

    /*
  Any other data cell metadata, useful for custom rendering logic, keeping track of other properties, etc.
 */
    [other: string]: any;
  }

  interface Separators {
    rows: object[]; // row path object array
    columns: object[]; // column path object array
  }

  const tableHeaderValidator = (value: unknown): boolean =>
    hasProperties(value, 'groupIds', 'categoriesByGroupId');

  const tableHeaderType = [Object, null];

  export const REGULAR = 'regular';
  export const COMFORTABLE = 'comfortable';
  export const COMPACT = 'compact';

  @Component({
    components: { TextEllipsis },
    directives: {
      tooltip: VTooltip
    }
  })
  export default class TableWidget extends Vue {
    @Prop({
      type: tableHeaderType,
      // validator: tableHeaderValidator,
      default: null
    })
    readonly columnHeader: TableHeader | null;

    @Prop({
      type: tableHeaderType,
      // validator: tableHeaderValidator,
      default: null
    })
    readonly rowHeader: TableHeader | null;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly data: TableData[];

    @Prop({
      type: String,
      default: REGULAR
    })
    readonly density: string;

    @Prop({
      type: Object,
      default: null
    })
    readonly separators: Separators | null;

    currentlyHoveredRow = null;
    currentHover = {
      groupId: null,
      columnGroupByDepth: {},
      row: {}
    };
    /*
  Used to track whether or not table is scrolled horizontally or vertically to apply correct scroll state styles
 */
    scrollState = {
      vertical: false,
      horizontal: false
    };
    levelClasses = [this.$style.third, this.$style.second, this.$style.first];
    columnHeaderHeight = '0px';

    @Ref('columnHeader')
    readonly columnHeaderRef: Element;

    get separatedRows() {
      const separatedRows = [];
      for (let row = 0; row < this.totalNumberOfRows; row++) {
        if (this.hasSeparator('row', row)) {
          separatedRows.push(row);
        }
      }

      return separatedRows;
    }

    get separatedColumns() {
      const separatedColumns = [];
      for (let column = 0; column < this.totalNumberOfColumns; column++) {
        if (this.hasSeparator('column', column)) {
          separatedColumns.push(column);
        }
      }

      return separatedColumns;
    }

    get hasRowHeader() {
      return Boolean(this.rowHeader);
    }

    get hasColumnHeader() {
      return Boolean(this.columnHeader);
    }

    /*
    Creates a data matrix given the properties.
    It is of size M x N where M is number of rows and N number of columns
   */
    get dataMatrix(): TableData[][] {
      const rows = [];

      for (let row = 0; row < this.totalNumberOfRows; row++) {
        const rowItems = this.rowItems(row);

        rows.push(rowItems);
      }

      return rows;
    }

    get rowPaths() {
      const rowPaths = [];

      if (!this.hasRowHeader) {
        return rowPaths;
      }

      for (let row = 0; row < this.totalNumberOfRows; row++) {
        const rowPath = this.path('rowHeader', row);

        rowPaths.push(rowPath);
      }

      return rowPaths;
    }

    get columnPaths() {
      const columnPaths = [];

      if (!this.hasColumnHeader) {
        return columnPaths;
      }

      for (let column = 0; column < this.totalNumberOfColumns; column++) {
        const columnPath = this.path('columnHeader', column);

        columnPaths.push(columnPath);
      }

      return columnPaths;
    }

    get spacedRows() {
      const spacedRows = [];

      for (let row = 0; row < this.totalNumberOfRows; row++) {
        if (
          row === 0 ||
          this.headerGroup('rowHeader', row) ===
            this.headerGroup('rowHeader', row - 1)
        ) {
          continue;
        }

        spacedRows.push(row);
      }

      return spacedRows;
    }

    get totalNumberOfColumns() {
      if (!this.columnHeader) {
        return 1;
      }

      return sum(
        this.columnHeader.groupIds.map(groupId =>
          this.numberOfHeaderGroupItems('columnHeader', groupId)
        )
      );
    }

    get totalNumberOfRows() {
      if (!this.rowHeader) {
        return 1;
      }

      return sum(
        this.rowHeader.groupIds.map(groupId =>
          this.numberOfHeaderGroupItems('rowHeader', groupId)
        )
      );
    }

    hasSeparator(orientation: string, rowOrColumn: number) {
      if (!this.separators) {
        return false;
      }

      const isRow = orientation === 'row';
      const isColumn = !isRow;

      if (isRow && !this.separators.rows) {
        return false;
      }

      if (isColumn && !this.separators.columns) {
        return false;
      }

      let path;

      if (isRow) {
        path = this.rowPaths[rowOrColumn];
      } else {
        path = this.columnPaths[rowOrColumn];
      }

      let rowsOrColumns;
      if (isRow) {
        rowsOrColumns = this.separators.rows;
      } else {
        rowsOrColumns = this.separators.columns;
      }

      return rowsOrColumns.some(separatorPath => isMatch(path, separatorPath));
    }

    numberOfRowGroupItemsBeforeGroup(header: string, groupId: string) {
      let acc = 0;

      for (let i = 0; i < this[header].groupIds.length; i++) {
        if (groupId === this[header].groupIds[i]) {
          break;
        }
        acc += this.numberOfHeaderGroupItems(header, this[header].groupIds[i]);
      }

      return acc;
    }

    @Watch('currentlyHoveredRow')
    onCurrentlyHoveredRowChange(hoveredRow: number, lastHoveredRow: number) {
      if (
        !this.rowHeader ||
        hoveredRow === null ||
        lastHoveredRow === hoveredRow
      ) {
        return;
      }

      const hoveredGroupId = this.headerGroup('rowHeader', hoveredRow);

      let hoveredRowInsideTheGroup =
        hoveredRow -
        this.numberOfRowGroupItemsBeforeGroup('rowHeader', hoveredGroupId);

      this.currentHover.groupId = hoveredGroupId;
      const columnGroupByDepth = {};

      forEach(
        rangeRight(this.headerGroupDepth('rowHeader', hoveredGroupId) + 1),
        depth => {
          const columnGroupIndex = Math.floor(
            hoveredRowInsideTheGroup /
              size(
                this.categoryValuesByDepth('rowHeader', hoveredGroupId, depth)
              )
          );
          columnGroupByDepth[depth] = columnGroupIndex;

          hoveredRowInsideTheGroup = columnGroupIndex;
        }
      );

      this.currentHover.columnGroupByDepth = columnGroupByDepth;
      this.currentHover.row = this.rowPaths[hoveredRow];
    }

    @Watch('density')
    async recalculateColumnHeaderHeight() {
      if (this.columnHeaderRef) {
        await this.$nextTick();

        this.columnHeaderHeight =
          this.columnHeaderRef.getBoundingClientRect().height + 0.5 + 'px';
      }
    }

    mounted() {
      this.recalculateColumnHeaderHeight();
    }

    rowItems(row: number) {
      const rowPath = this.rowPaths[row] || {};

      const columns = [];
      for (let column = 0; column < this.totalNumberOfColumns; column++) {
        const columnPath = this.columnPaths[column] || {};

        const columnItem = this.dataMap.get(
          JSON.stringify({
            column: columnPath,
            row: rowPath
          })
        );

        columns.push(columnItem);
      }

      return columns;
    }

    get dataMap() {
      return new Map(
        map(this.data, ({ column, row, value }) => [
          JSON.stringify({ column, row }),
          { value }
        ])
      );
    }

    dataEntryText(dataEntry) {
      return dataEntry?.value?.toString() || '-';
    }

    onTableScroll() {
      this.scrollState.vertical = Boolean(this.$el.scrollTop);
      this.scrollState.horizontal = Boolean(this.$el.scrollLeft);
    }

    isHovered(groupId, depth, rowHeaderGroupIndex, categoryValue) {
      if (this.currentlyHoveredRow === null) {
        return false;
      }
      const categoryId = this.categoryIdByDepth('rowHeader', groupId, depth);
      return (
        groupId === this.currentHover.groupId &&
        this.currentHover.columnGroupByDepth[depth] === rowHeaderGroupIndex &&
        this.currentHover.row[categoryId] === categoryValue
      );
    }

    groupCategoryByDepth(header: string, groupId: string, depth: number) {
      return this.categoriesByGroupId(header, groupId).categoryIds[depth];
    }

    headerGroup(header: string, rowOrColumn: number) {
      let accumulator = 0;
      for (const groupId of this[header].groupIds) {
        const numberOfItems = this.numberOfHeaderGroupItems(header, groupId);

        accumulator += numberOfItems;

        if (rowOrColumn < accumulator) {
          return groupId;
        }
      }
    }

    path(header: string, rowOrColumn: number) {
      if (header === 'rowHeader' && !this.hasRowHeader) {
        return null;
      }

      if (header === 'columnHeader' && !this.hasColumnHeader) {
        return null;
      }

      const groupId = this.headerGroup(header, rowOrColumn);
      return this.pathHelper(
        header,
        groupId,
        rowOrColumn - this.numberOfRowGroupItemsBeforeGroup(header, groupId),
        this.headerGroupDepth(header, groupId)
      );
    }

    pathHelper(
      header: string,
      groupId: string,
      rowOrColumn: number,
      depth: number
    ) {
      if (depth < 0) {
        return;
      }

      const categoryId = this.groupCategoryByDepth(header, groupId, depth);
      const categories = this.categoryValuesByCategoryId(
        header,
        groupId,
        categoryId
      );

      const item = categories[rowOrColumn % size(categories)];

      return {
        ...this.pathHelper(
          header,
          groupId,
          Math.floor(rowOrColumn / size(categories)),
          depth - 1
        ),
        [categoryId]: item
      };
    }

    categoriesByGroupId(header: string, groupId: string) {
      return this[header].categoriesByGroupId[groupId];
    }

    categoryValuesByCategoryId(
      header: string,
      groupId: string,
      categoryId: string
    ) {
      return this.categoriesByGroupId(header, groupId)
        .categoryValuesByCategoryId[categoryId];
    }

    categoryIdByDepth(header: string, groupId: string, depth: number) {
      const categories = this.categoriesByGroupId(header, groupId);

      return categories.categoryIds[depth];
    }

    categoryValuesByDepth(header: string, groupId: string, depth: number) {
      const categoryId = this.categoryIdByDepth(header, groupId, depth);

      return this.categoryValuesByCategoryId(header, groupId, categoryId);
    }

    headerGroupDepth(header: string, groupId: string) {
      return this.categoriesByGroupId(header, groupId).categoryIds.length - 1;
    }

    numberOfHeaderGroups(header: string, groupId: string, depth: number) {
      return (
        this.numberOfHeaderGroupItems(header, groupId, depth) /
        this.categoryValuesByDepth(header, groupId, depth).length
      );
    }

    numberOfHeaderGroupItems(
      header: string,
      groupId: string,
      depth = this.headerGroupDepth(header, groupId)
    ) {
      if (depth === 0) {
        return size(this.categoryValuesByDepth(header, groupId, depth));
      }

      return (
        size(this.categoryValuesByDepth(header, groupId, depth)) *
        this.numberOfHeaderGroupItems(header, groupId, depth - 1)
      );
    }

    depthClass(header: string, groupId: string, level: number) {
      return this.levelClasses[
        (this.headerGroupDepth(header, groupId) - level) %
          this.levelClasses.length
      ];
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  $column-header-row-height-compact: 26px;
  $column-header-row-height-regular: 30px;
  $column-header-row-height-comfortable: 38px;

  $row-header-column-width-compact: 80px;
  $row-header-column-width-regular: 136px;
  $row-header-column-width-comfortable: 168px;

  $row-header-hover-gap-compact: 8px;
  $row-header-hover-gap-regular: 12px;
  $row-header-hover-gap-comfortable: 12px;

  $min-compact-cell-width: 40px;
  $min-regular-cell-width: 64px;
  $min-comfortable-cell-width: 80px;

  $scroll-border-color: $color-border-main-light;

  $row-group-gap-compact: 22px;
  $row-group-gap-regular: 24px;
  $row-group-gap-comfortable: 32px;

  $content-row-height-compact: 22px;
  $content-row-height-regular: 26px;
  $content-row-height-comfortable: 34px;

  $font-size-compact: 10px;
  $line-height-compact: 14px;

  $font-size-regular: 11.5px;
  $line-height-regular: 16px;

  $font-size-comfortable: 14px;
  $line-height-comfortable: 20px;

  $separator-color: $color-border-main;

  %font-size-line-height {
    &.compact {
      font-size: $font-size-compact;
      line-height: $line-height-compact;
    }

    &.regular {
      font-size: $font-size-regular;
      line-height: $line-height-regular;
    }

    &.comfortable {
      font-size: $font-size-comfortable;
      line-height: $line-height-comfortable;
    }
  }

  .table {
    @include row;
  }

  .row-header {
    display: flex;
    flex-direction: column;
    position: sticky;
    height: fit-content;
    left: 0;
    background-color: $color-bg-light;
    z-index: 2;
    border-right: 1px solid transparent;
    border-top: 1px solid transparent;
    min-width: fit-content;
    font-weight: bold;
    color: $color-text-main;

    &-placeholder {
      position: sticky;
      top: 0;
      z-index: 1;
      background-color: $color-bg-light;
      border-bottom: 1px solid transparent;

      &.scroll {
        border-bottom: 1px solid $scroll-border-color;
      }
    }

    &.scroll {
      border-right: 1px solid $scroll-border-color;
    }

    &-group {
      display: flex;
      flex: 1;
      justify-content: flex-end;

      &:not(:last-child) {
        &.compact {
          margin-bottom: $row-group-gap-compact;
        }

        &.regular {
          margin-bottom: $row-group-gap-regular;
        }

        &.comfortable {
          margin-bottom: $row-group-gap-comfortable;
        }
      }

      &-column {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        &-group {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
      }
    }

    &-item-wrapper {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 0;

      &.compact {
        min-width: $row-header-column-width-compact;
        padding-top: 2px;
        min-height: $content-row-height-compact;
      }

      &.regular {
        min-width: $row-header-column-width-regular;
        padding-top: 3px;
        min-height: $content-row-height-regular;
      }

      &.comfortable {
        min-width: $row-header-column-width-comfortable;
        padding-top: 5.5px;
        min-height: $content-row-height-comfortable;
      }

      &-helper {
        display: flex;
        align-items: center;
      }
    }

    &-item {
      position: relative;

      @extend %font-size-line-height;

      &.compact {
        padding-left: $row-header-hover-gap-compact;
      }

      &.regular {
        padding-left: $row-header-hover-gap-regular;
      }

      &.comfortable {
        padding-left: $row-header-hover-gap-comfortable;
      }

      &[is-hovered='true']::before {
        background-color: #2367ba;
      }

      &::before {
        position: absolute;
        left: 0;
        display: inline-block;
        content: '';
        width: 3px;
        height: 100%;
        margin-right: 8px;
      }
    }
  }

  .main {
    @include column;
    flex: 1;
    height: fit-content;
  }

  .column-header {
    display: flex;
    position: sticky;
    top: 0;
    color: $color-text-main;
    font-weight: bold;

    background-color: white;

    z-index: 1;

    &.scroll {
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    }

    &-group {
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: flex-end;

      &-row {
        display: flex;

        &.compact {
          height: $column-header-row-height-compact;
        }

        &.regular {
          height: $column-header-row-height-regular;
        }

        &.comfortable {
          height: $column-header-row-height-comfortable;
        }

        &.second {
          // second level is of different heights
          &.compact {
            height: 22px;
          }

          &.regular {
            height: 26px;
          }

          &.comfortable {
            height: 34px;
          }
        }

        &-group {
          display: flex;
          flex: 1;

          &.second {
            border-radius: 4px;
            padding-right: 6px;
          }
        }
      }
    }

    &-item-wrapper {
      display: flex;
      flex: 1;
      width: 0;
      align-items: center;
      justify-content: center;

      &.first {
        padding-left: 6px;
        justify-content: flex-start;
      }

      &.second {
        background-color: $color-bg-primary-dimmed;

        &:not(:first-child) {
          border-left: 1px solid $color-border-primary-light;
        }
      }

      @extend %font-size-line-height;

      &.compact {
        min-width: $min-compact-cell-width;
      }

      &.regular {
        min-width: $min-regular-cell-width;
      }

      &.comfortable {
        min-width: $min-comfortable-cell-width;
      }
    }
  }

  .content {
    display: flex;

    &-column {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 0;

      &.separator {
        border-right: 1px solid $separator-color;
      }

      &:first-child .content-row-wrapper {
        & > * {
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
      }

      &.compact {
        min-width: $min-compact-cell-width;
      }

      &.regular {
        min-width: $min-regular-cell-width;
      }

      &.comfortable {
        min-width: $min-comfortable-cell-width;
      }
    }

    &-row {
      height: 100%;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      border-top: 1px solid transparent;
      border-bottom: 1px solid transparent;

      &[is-striped] {
        background: $color-bg-main-dimmed;
      }

      &.compact {
        padding: 0 2px;
      }

      &.regular {
        padding: 0 4px;
      }

      &.comfortable {
        padding: 0 6px;
      }

      &[is-first] {
        border-left: 1px solid transparent;
      }

      &[is-last] {
        border-right: 1px solid transparent;
      }

      &-wrapper {
        @extend %font-size-line-height;

        &.compact {
          height: 22px;
        }

        &.regular {
          height: 26px;
        }

        &.comfortable {
          height: 34px;
        }

        &.separator {
          border-bottom: 1px solid $separator-color;
        }

        &.spaced {
          &.compact {
            margin-top: 22px;
          }

          &.regular {
            margin-top: 24px;
          }

          &.comfortable {
            margin-top: 32px;
          }
        }
      }

      &[is-hovered='true'] {
        background-color: $color-bg-primary-dimmed;

        border-top: 1px solid $color-border-primary-light;
        border-bottom: 1px solid $color-border-primary-light;

        &[is-first] {
          border-left: 1px solid $color-border-primary-light;
        }

        &[is-last] {
          border-right: 1px solid $color-border-primary-light;
        }
      }
    }
  }
</style>
