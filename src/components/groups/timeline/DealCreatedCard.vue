<template>
  <TimelineMessage
    :class="$style.message"
    :current-user="currentUser"
    :message-creator="message.user"
    :timestamp="message.createdAt"
  >
    <template #heading>
      <span :class="$style.heading"
        >{{ message.user.firstName }} {{ message.user.lastName }} created a
        <b>deal</b></span
      >
    </template>
    <div :class="$style.card">
      <template v-for="group in deal.groups">
        <div :key="group.id" :class="$style.group">
          <div
            v-for="(alternative, idx) in group.groupAlternatives"
            :key="alternative.id"
          >
            <div v-if="idx > 0" :class="$style.alternative">
              <span>Alternative</span>
            </div>
            <div
              v-for="(part, idx) in parts(alternative)"
              :key="idx"
              :class="$style.part"
            >
              <div :class="[$style.column, $style.info]">
                <div :class="[$style.column, $style.dateRange]">
                  <span v-if="!isSameDay(part.dateRange)"
                    >{{ dateFromFormatted(part.dateRange) }} —</span
                  >
                  <span>{{ dateToFormatted(part.dateRange) }}</span>
                </div>
                <template v-if="idx === 0">
                  <span
                    v-for="property in alternative.properties"
                    :key="property.id"
                    >{{ property.name }}</span
                  >
                </template>
              </div>
              <div :class="$style.table">
                <div
                  v-for="(entry, idx) in part.entries"
                  :key="idx"
                  :class="$style.tableRow"
                >
                  <span>{{ entry.roomType.name }}</span>
                  <span>{{ formatPackages(entry.packages) }}</span>
                  <span>{{ entry.quantity }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div :class="$style.footer">
        <div :class="$style.budget">
          <div :class="$style.header">
            <IconBudget />
            <b>Budget</b>
          </div>
          <div :class="$style.row">
            <template v-if="deal.budget || deal.otherExpenses">
              <div :class="$style.column">
                <h5>Main budget</h5>
                <span>{{ budgetFormatted }}</span>
              </div>
              <div :class="$style.column">
                <h5>Ancillary expenses</h5>
                <span>{{ otherExpensesFormatted }}</span>
              </div>
            </template>
            <div v-else :class="$style.empty">
              <span>No budget entered</span>
            </div>
          </div>
        </div>
        <div :class="$style.note">
          <div :class="$style.header">
            <IconNote />
            <b>Note</b>
          </div>
          <div :class="$style.row">
            <p v-if="deal.note">
              {{ deal.note }}
            </p>
            <div v-else :class="$style.empty">
              <span>No note entered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TimelineMessage>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { forEach, join, last, map, size } from 'lodash';
  import {
    format,
    isSameMonth,
    isSameYear,
    parseISO,
    isSameDay
  } from 'date-fns';

  import { formatPriceNumberWithCurrency } from '@/utils/format';

  import IconGroup from '@/assets/images/icons/Deals/group.svg';
  import IconBudget from '@/assets/images/icons/groups/new-inquiry/budget.svg';
  import IconNote from '@/assets/images/icons/groups/new-inquiry/note-2px.svg';

  import { SubmittedRequestMessage } from '@/models/groups/Message';
  import TimelineMessage from '@/components/groups/deal/TimelineMessage.vue';

  @Component({
    components: { TimelineMessage, IconGroup, IconBudget, IconNote }
  })
  export default class DealCreatedCard extends Vue {
    @Prop({
      type: SubmittedRequestMessage,
      required: true
    })
    readonly message;

    @Prop({
      type: Object,
      required: true
    })
    readonly currentUser;

    get deal() {
      return this.message.deal;
    }

    get budgetFormatted() {
      return this.formatBudget(this.deal.budget);
    }

    get otherExpensesFormatted() {
      return this.formatBudget(this.deal.otherExpenses);
    }

    formatBudget(budget) {
      if (budget === null) {
        return '-';
      }

      return formatPriceNumberWithCurrency(budget);
    }

    dateFromDayFormatted(dateFrom: Date) {
      return format(dateFrom, 'dd');
    }

    dateFromDayOfWeek(dateFrom: Date) {
      return format(dateFrom, 'EEEE');
    }

    isDateRangeSameMonth(dateRange) {
      return isSameMonth(dateRange.from, dateRange.to);
    }

    isDateRangeSameYear(dateRange) {
      return isSameYear(dateRange.from, dateRange.to);
    }

    dateFromFormatted(dateRange) {
      let dateFormat = format(dateRange.from, 'dd');

      if (!this.isDateRangeSameMonth(dateRange)) {
        dateFormat = format(dateRange.from, 'dd.MM');
      }

      if (!this.isDateRangeSameYear(dateRange)) {
        dateFormat = format(dateRange.from, 'dd.MM.yyyy');
      }

      return dateFormat;
    }

    dateToFormatted(dateRange) {
      return format(dateRange.to, 'dd.MM.yyyy');
    }

    formatPackages(packages) {
      if (size(packages) === 0) {
        return '-';
      }

      return join(map(packages, 'name'), ', ');
    }

    isSameDay(dateRange) {
      const { from, to } = dateRange;

      return isSameDay(from, to);
    }

    parts(alternative) {
      const items = alternative.groupAlternativeItems;

      let lastItem = items[0];

      const parts = [
        {
          dateRange: {
            from: parseISO(lastItem.bookingDate),
            to: parseISO(lastItem.bookingDate)
          },
          entries: lastItem.entries
        }
      ];

      forEach(items, item => {
        if (item.equals(lastItem)) {
          last(parts).dateRange.to = parseISO(item.bookingDate);
        } else {
          parts.push({
            dateRange: {
              from: parseISO(item.bookingDate),
              to: parseISO(item.bookingDate)
            },
            entries: item.entries
          });

          lastItem = item;
        }
      });

      return parts;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .message {
    padding-bottom: 16px;
  }

  .card {
    padding-top: 8px;
  }

  .heading b {
    color: $color-text-main;
  }

  .group {
    @include column;

    padding: 16px 24px;
  }

  .group + .group {
    border-top: 1px solid $color-border-main-light;
  }

  .group-header hr {
    flex: 1;
    margin-left: 24px;
  }

  .part {
    @include row;
  }

  .part + .part {
    margin-top: 16px;
  }

  hr.solid {
    border: none;
    border-top: 1px solid $color-border-main-light;
    width: 100%;
  }

  .separator {
    margin: 32px 0;
  }

  .grid {
    display: grid;
    grid-template-columns: auto 60% 110px;
    grid-gap: 40px;

    & > div:nth-child(2) {
      width: 85%;
    }
  }

  .column {
    @include column;
  }

  .row {
    @include row;
  }

  .info {
    flex-basis: 188px;
  }

  .table {
    flex: 1;
    margin-left: 24px;

    &-row {
      @include row;
      align-items: center;
      padding: 6px 12px;
      border-radius: 4px;

      &:nth-child(2n + 1) {
        background-color: $color-bg-main-dimmed;
      }

      > :nth-child(1) {
        flex-basis: 120px;
      }

      > :nth-child(2) {
        flex: 1;
      }

      > :nth-child(3) {
        flex-basis: 72px;
        margin-left: 40px;

        text-align: end;

        white-space: nowrap;
      }
    }
  }

  .alternative {
    text-transform: uppercase;
    color: $color-text-main-light;
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 16px;
    margin-top: 22px;
  }

  .date-range {
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 24px;
  }

  .header {
    @include row;
    align-items: center;

    margin-bottom: 24px;

    b {
      margin-left: 12px;
    }
  }

  .budget {
    padding-right: 84px;
  }

  .budget h5:first-of-type {
    color: $color-text-main-light;
    text-transform: uppercase;
    margin-top: 0;
    margin-bottom: 4px;
  }

  .budget .column + .column {
    margin-left: 38px;
  }

  .note p {
    margin: 0;
    word-wrap: break-word;
    max-width: 50ch;
  }

  .footer {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: 'budget note';

    margin-top: 8px;

    border-top: 1px solid $color-border-main-light;
  }

  .budget,
  .note {
    padding: 24px;
  }

  .budget {
    grid-area: budget;
  }

  .note {
    grid-area: note;

    border-left: 1px solid $color-border-main-light;
  }

  .empty {
    @include flex-center;

    color: $color-text-main-lighter;
    background-color: $color-bg-main-dimmed;

    padding: 16px 0;

    border-radius: 4px;

    width: 100%;
  }
</style>
