<template>
  <div :class="$style.grid" @click="onClick">
    <div>
      <div :class="[$style.column, $style.dateRange]">
        <span>{{ dateFromFormatted }} —</span>
        <span>{{ dateToFormatted }}</span>
      </div>
      <div :class="$style.column">
        <span v-for="propertyLabel in propertyLabels" :key="propertyLabel">{{
          propertyLabel
        }}</span>
      </div>
    </div>
    <div>
      <div v-if="!isWholeDateRange" :class="$style.dayByDay">
        <b>{{ dateFromDayFormatted }}</b>
        <span>{{ dateFromDayOfWeek }}</span>
        <i>Click to see other days</i>
      </div>
      <div :class="[$style.row, $style.table, $style.header]">
        <span>Unit type</span>
        <span>Services</span>
        <span>Quantity</span>
      </div>
      <div
        v-for="(item, idx) in items"
        :class="[$style.row, $style.table, $style.content]"
        :key="idx"
      >
        <span>{{ item.roomType.name }}</span>
        <span>{{ formatPackages(item.packages) }}</span>
        <span>{{ item.quantity }}</span>
      </div>
    </div>
    <div :class="[$style.column, $style.buttons]">
      <ButtonGhost
        text="Duplicate"
        type="button"
        @click.stop="onDuplicateClick"
      >
        <template #icon>
          <IconCopy />
        </template>
      </ButtonGhost>
      <ButtonGhost
        v-if="showDelete"
        :class="$style.btnDelete"
        destructive
        text="Delete"
        type="button"
        @click.stop="onDeleteClick"
      >
        <template #icon>
          <IconTrash />
        </template>
      </ButtonGhost>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
  import { format, isSameMonth, isSameYear } from 'date-fns';
  import { join, keyBy, map, size } from 'lodash';
  import ButtonGhost from '@/components/buttons/ButtonGhost.vue';
  import IconCopy from '@/assets/images/icons/Misc/ic-24-copy.svg';
  import IconTrash from '@/assets/images/icons/trash.svg';

  @Component({
    components: { ButtonGhost, IconCopy, IconTrash }
  })
  export default class AlternativeView extends Vue {
    @Prop({
      type: Array,
      default: () => []
    })
    readonly properties;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly roomTypes;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly packages;

    @Prop({
      type: Object,
      required: true
    })
    readonly alternative;

    @Prop({
      type: Boolean
    })
    readonly showDelete: boolean;

    get isWholeDateRange() {
      return this.alternative.areAllEntriesEqual();
    }

    get dateFrom(): Date {
      return this.alternative.dateRange.from;
    }

    get dateTo(): Date {
      return this.alternative.dateRange.to;
    }

    get dateFromDayFormatted() {
      return format(this.dateFrom, 'dd');
    }

    get dateFromDayOfWeek() {
      return format(this.dateFrom, 'EEEE');
    }

    get isDateRangeSameMonth() {
      return isSameMonth(this.dateFrom, this.dateTo);
    }

    get isDateRangeSameYear() {
      return isSameYear(this.dateFrom, this.dateTo);
    }

    get dateFromFormatted() {
      let dateFormat = format(this.dateFrom, 'dd');

      if (!this.isDateRangeSameMonth) {
        dateFormat = format(this.dateFrom, 'dd.MM');
      }

      if (!this.isDateRangeSameYear) {
        dateFormat = format(this.dateFrom, 'dd.MM.yyyy');
      }

      return dateFormat;
    }

    get dateToFormatted() {
      return format(this.alternative.dateRange.to, 'dd.MM.yyyy');
    }

    get propertyLabels() {
      return map(this.alternative.properties, 'name');
    }

    get items() {
      return this.alternative.groupAlternativeItems[0].entries;
    }

    formatPackages(packages) {
      if (size(packages) === 0) {
        return '-';
      }

      return join(map(packages, 'name'), ', ');
    }

    @Emit('edit')
    onClick() {
      return true;
    }

    @Emit('duplicate')
    onDuplicateClick() {
      return true;
    }

    @Emit('delete')
    onDeleteClick() {
      return true;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .grid {
    display: grid;
    grid-template-columns: auto 60% 110px;
    grid-gap: 40px;

    & > div:nth-child(2) {
      width: 85%;
    }

    &:hover {
      cursor: pointer;
      background-color: $color-bg-primary-dimmed;

      .buttons {
        display: block;
      }
    }
  }

  .column {
    @include column;

    &.buttons {
      display: none;
      justify-content: center;
    }
  }

  .day-by-day {
    margin-bottom: 24px;

    b {
      margin-right: 8px;
    }

    span {
      margin-right: 32px;
    }

    span,
    i {
      color: $color-text-main-light;
    }
  }

  .row {
    @include row;

    &.table {
      &.header {
        text-transform: uppercase;
        color: $color-text-main-light;
        font-size: 12px;
        line-height: 16px;
        margin-bottom: 10px;
      }

      &.content {
        padding: 6px 0;
      }

      &.content:not(:last-child) {
        border-bottom: 1px solid $color-border-main-light;
      }

      & > *:first-child {
        flex-basis: 30%;
      }

      & > *:nth-child(2) {
        flex-basis: 60%;
      }

      & > *:last-child {
        flex-basis: 10%;
        text-align: end;
      }
    }
  }

  .date-range {
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 24px;
  }

  .btn-delete {
    justify-content: flex-start;
  }
</style>
