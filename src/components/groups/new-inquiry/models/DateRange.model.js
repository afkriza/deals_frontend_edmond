import { formatISODate } from '@/utils/date';
import { parseISO } from 'date-fns';

export default class DateRange {
  constructor({ from, to }) {
    this.from = from;
    this.to = to;
  }

  serialize() {
    return {
      from: formatISODate(this.from),
      to: formatISODate(this.to)
    };
  }

  static deserialize({ from, to }) {
    return new DateRange({
      from: parseISO(from),
      to: parseISO(to)
    });
  }
}
