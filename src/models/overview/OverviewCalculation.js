import { parseISO } from 'date-fns';

export class OverviewCalculation {
  constructor({
    bookingPeriod,
    periodStartDate,
    periodEndDate,
    progress,
    total,
    hasDetails,
    notifications
  }) {
    this.bookingPeriod = bookingPeriod;
    this.periodStartDate = parseISO(periodStartDate);
    this.periodEndDate = parseISO(periodEndDate);
    this.progress = progress;
    this.total = total;
    this.hasDetails = hasDetails;
    this.notifications = notifications;
  }

  static deserialize(data) {
    return new OverviewCalculation(data);
  }
}
