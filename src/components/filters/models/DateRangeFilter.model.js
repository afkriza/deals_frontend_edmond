import { isEqual, map } from 'lodash';
import { format, formatISO, parseISO } from 'date-fns';

import IconCalendar from '@/assets/images/icons/calendar.svg';
import IconCalendarTime from '@/assets/images/icons/calendar-time.svg';

import { Filter } from './Filter.model';
import { DateRangeFilterPreset } from '@/components/filters/models/DateRangeFilterPreset.model';

export class DateRangeFilter extends Filter {
  constructor({ options, value, activePreset, ...filter }) {
    super(filter);
    this.options = options;
    this.value = value;

    this.activePreset = activePreset;

    if (activePreset) {
      this.value = activePreset.dateRange;
    }
  }

  get clearable() {
    return !this.defaultValue;
  }

  get reload() {
    return false;
  }

  get query() {
    return {
      ...(this.value.startDate && {
        [(this.prefix || '') + 'StartDate']: formatISO(this.value.startDate, {
          representation: 'date'
        })
      }),
      ...(this.value.endDate && {
        [(this.prefix || '') + 'EndDate']: formatISO(this.value.endDate, {
          representation: 'date'
        })
      })
    };
  }

  get icon() {
    if (this.prefix === 'snapshot') {
      return IconCalendarTime;
    }

    return IconCalendar;
  }

  get pinnedLabel() {
    return '';
  }

  get pinnedValueLabel() {
    const { startDate, endDate } = this.value;

    if (!startDate && !endDate) {
      return 'All time';
    }

    let dateRangeFormat = '';

    dateRangeFormat = startDate ? format(startDate, 'dd.MM.yyyy') : '?';
    dateRangeFormat += ' - ';
    dateRangeFormat += endDate ? format(endDate, 'dd.MM.yyyy') : '?';

    return dateRangeFormat;
  }

  get component() {
    return 'DateRangeFilter';
  }

  select(preset) {
    this.activePreset = preset;

    if (preset) {
      this.value = preset.dateRange;
    }
  }

  clear() {
    this.value = {
      startDate: null,
      endDate: null
    };

    this.activePreset = null;
  }

  copy() {
    return new DateRangeFilter({
      ...this,
      value: { ...this.value },
      activePreset: this.activePreset && this.activePreset.copy()
    });
  }

  merge(newFilter) {
    return this;
  }

  equals(otherFilter) {
    if (!otherFilter || !(otherFilter instanceof DateRangeFilter)) {
      return false;
    }

    if (otherFilter === this) {
      return true;
    }

    return isEqual(this.value, otherFilter.value);
  }

  static deserialize(filterDto) {
    const { options, value, activePreset, defaultValue } = filterDto;

    return new DateRangeFilter({
      ...filterDto,

      options: map(options, DateRangeFilterPreset.deserialize),

      activePreset:
        activePreset && DateRangeFilterPreset.deserialize(activePreset),

      value: value
        ? {
            startDate: parseISO(value.startDate),
            endDate: parseISO(value.endDate)
          }
        : {
            startDate: defaultValue ? parseISO(defaultValue.startDate) : null,
            endDate: defaultValue ? parseISO(defaultValue.endDate) : null
          }
    });
  }
}
