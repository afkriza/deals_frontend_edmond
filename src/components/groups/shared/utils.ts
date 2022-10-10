import { format, isSameDay, isSameMonth, isSameYear } from 'date-fns';
import { map, join } from 'lodash';

export function formatDateRange(dateFrom: Date, dateTo: Date) {
  if (isSameDay(dateFrom, dateTo)) {
    return format(dateFrom, 'dd.MM.yyyy');
  }

  let dateFromFormatted = format(dateFrom, 'dd');

  if (!isSameMonth(dateFrom, dateTo)) {
    dateFromFormatted = format(dateFrom, 'dd.MM');
  }

  if (!isSameYear(dateFrom, dateTo)) {
    dateFromFormatted = format(dateFrom, 'dd.MM.yyyy');
  }

  const dateToFormatted = format(dateTo, 'dd.MM.yyyy');

  return `${dateFromFormatted} — ${dateToFormatted}`;
}

export function formatList(list, prop = 'name') {
  return join(map(list, prop), ', ');
}
