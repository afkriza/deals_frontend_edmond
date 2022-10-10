export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
export const DAYS = [
  { name: 'Monday', abbr: 'MON' },
  { name: 'Tuesday', abbr: 'TUE' },
  { name: 'Wednesday', abbr: 'WED' },
  { name: 'Thursday', abbr: 'THU' },
  { name: 'Friday', abbr: 'FRI' },
  { name: 'Saturday', abbr: 'SAT' },
  { name: 'Sunday', abbr: 'SUN' }
];

export const TimeGranulations = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month'
};

export const TIME_GRANULATION_LIST = [
  { name: 'Days', abbr: 'D', value: TimeGranulations.DAY, view: 'daily' },
  { name: 'Weeks', abbr: 'W', value: TimeGranulations.WEEK, view: 'weekly' },
  { name: 'Months', abbr: 'M', value: TimeGranulations.MONTH, view: 'monthly' }
];

export const DEFAULT_TIME_GRANULATION = TimeGranulations.DAY;

const today = new Date();
export const CURRENT_MONTH = today.getMonth() + 1;
export const CURRENT_YEAR = today.getFullYear();
export const CURRENT_DAY = today.getDate();
