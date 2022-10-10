import {
  PLUS,
  MINUS,
  MULTIPLY,
  DIVIDE,
  COMMA,
  BRACKETS_CLOSE,
  BRACKETS_OPEN,
  MIN,
  MAX,
  SUM,
  AVG,
  COALESCE
} from 'constants/widget-operators';

export const widgetOperatorSymbols = {
  [PLUS]: '+',
  [MINUS]: '-',
  [MULTIPLY]: '*',
  [DIVIDE]: '/',
  [COMMA]: ',',
  [BRACKETS_OPEN]: '(',
  [BRACKETS_CLOSE]: ')',
  [MIN]: 'MIN',
  [MAX]: 'MAX',
  [SUM]: 'SUM',
  [AVG]: 'AVG',
  [COALESCE]: 'CLS'
};
