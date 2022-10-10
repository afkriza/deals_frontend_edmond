import { isoToDate } from 'utils/date';
import { generateRandomHex } from 'utils/string';

export default class DateRange {
  constructor({ id = generateRandomHex(), from, to }) {
    this.id = id;
    this.from = from;
    this.to = to;
  }

  static from(dateRange = {}) {
    return new DateRange(dateRange);
  }

  static deserialize({ from, to }) {
    return DateRange.from({
      from: from && isoToDate(from),
      to: to && isoToDate(to)
    });
  }
}
