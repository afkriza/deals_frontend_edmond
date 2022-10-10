import {
  endOfMonth,
  parseISO,
  startOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  startOfToday,
  startOfDay,
  addDays
} from 'date-fns';
import { camelCase } from 'lodash';

// TODO: This is a temporary solution while waiting for complete filter set specification.
// Also, try to find a better way of robust client side preset formatting
const PresetFormatters = {
  currentMonth: () => {
    const today = startOfToday();

    return {
      startDate: startOfMonth(today),
      endDate: startOfDay(endOfMonth(today))
    };
  },
  currentYear: () => {
    const today = startOfToday();

    return {
      startDate: startOfYear(today),
      endDate: startOfDay(endOfYear(today))
    };
  },
  lastMonth: () => {
    const today = startOfToday();

    const lastDayOfLastMonth = subDays(startOfMonth(today), 1);

    return {
      startDate: startOfMonth(lastDayOfLastMonth),
      endDate: lastDayOfLastMonth
    };
  },

  lastXDays: numberOfDays => {
    const today = startOfToday();

    return {
      startDate: subDays(today, numberOfDays),
      endDate: today
    };
  },

  nextXDays: numberOfDays => {
    const today = startOfToday();

    return {
      startDate: today,
      endDate: addDays(today, numberOfDays)
    };
  },

  today: () => PresetFormatters.lastXDays(0),
  yesterday: () => PresetFormatters.lastXDays(1),

  last7Days: () => PresetFormatters.lastXDays(7),
  last15Days: () => PresetFormatters.lastXDays(15),
  last30Days: () => PresetFormatters.lastXDays(30),
  next30Days: () => PresetFormatters.nextXDays(30),
  beginningOfYear: () => {
    const today = startOfToday();

    return {
      startDate: startOfYear(today),
      endDate: today
    };
  }
};

export class DateRangeFilterPreset {
  constructor({ id, name, startDate, endDate, available }) {
    this.id = id;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.available = available;
  }

  get dateRangeFixed() {
    return {
      startDate: this.startDate,
      endDate: this.endDate
    };
  }

  get dateRange() {
    if (this.isRelative) {
      const key = camelCase(this.id);

      const presetFormatter = PresetFormatters[key];

      if (!presetFormatter) {
        console.warn(
          `Preset formatter not implemented for key ${key}! Fallback to fixed value.`
        );
        return this.dateRangeFixed;
      }

      return presetFormatter();
    }

    return this.dateRangeFixed;
  }

  get isRelative() {
    return /last|beginning|current|today|yesterday|next/.test(this.id);
  }

  copy() {
    return new DateRangeFilterPreset(this);
  }

  static deserialize(presetDto) {
    const { startDate, endDate } = presetDto;

    return new DateRangeFilterPreset({
      ...presetDto,
      startDate: parseISO(startDate),
      endDate: parseISO(endDate)
    });
  }
}
