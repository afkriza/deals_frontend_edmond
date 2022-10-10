<template>
  <div :class="$style.container">
    <template v-for="{ id, weekday, day } in intervalDays">
      <div
        :key="id"
        :class="[$style.item, { [$style.active]: activeDateISO === id }]"
      >
        <span>
          {{ weekday }}
        </span>
        <span @click="onDayClick(id)">
          {{ day }}
        </span>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
  import {
    Interval,
    eachDayOfInterval,
    getDate,
    format,
    formatISO,
    parseISO
  } from 'date-fns';
  import { map } from 'lodash';

  @Component({
    model: {
      event: 'update'
    }
  })
  export default class DayByDayTabs extends Vue {
    @Prop({
      type: Date,
      required: true
    })
    readonly dateFrom: Date;

    @Prop({
      type: Date,
      required: true
    })
    readonly dateTo: Date;

    @Prop({
      type: Date
    })
    readonly value: Date | null;

    activeDateId = '';

    get getDate() {
      return getDate;
    }

    get activeDateISO() {
      return this.toIsoDate(this.value);
    }

    get interval(): Interval {
      return { start: this.dateFrom, end: this.dateTo };
    }

    get intervalDays() {
      return map(eachDayOfInterval(this.interval), date => ({
        id: this.toIsoDate(date),
        weekday: format(date, 'EEEEE'),
        day: getDate(date)
      }));
    }

    toIsoDate(date: Date): string | null {
      if (!date) {
        return null;
      }

      return formatISO(date, { representation: 'date' });
    }

    @Emit('update')
    onDayClick(dateId) {
      this.activeDateId = dateId;

      return parseISO(dateId);
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';
  .container {
    @include row;

    flex-wrap: wrap;
    row-gap: 18px;
  }

  .item {
    @include column;

    align-items: center;
    justify-content: center;

    &.active span:last-child {
      border: 1px solid $color-border-main-light;
      border-bottom: none;
    }

    span:first-child {
      color: $color-text-main-lighter;
      line-height: 16px;
      margin-bottom: 2px;
    }

    span:last-child {
      @include flex-center;

      cursor: pointer;

      width: 40px;
      height: 36px;
      margin-top: 2px;
      color: $color-text-main-light;
      line-height: 20px;
      border-radius: 4px 4px 0 0;
      border-bottom: 1px solid $color-border-main-light;

      &:hover {
        color: $color-text-primary;
        background-color: $color-bg-primary-dimmed;
        font-weight: bold;
      }
    }
  }
</style>
