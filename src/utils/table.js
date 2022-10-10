import displayDensities from 'enums/table-display-densities';
import {
  DEFAULT_CHAR_DENSITY,
  COMPACT_CHAR_DENSITY,
  COMFORTABLE_CHAR_DENSITY,
  MEDIUM_ASIDE_MAX_WIDTH,
  WIDE_ASIDE_MAX_WIDTH
} from 'constants/table';

function determineCharDensity(displayDensity) {
  switch (displayDensity) {
    case displayDensities.COMPACT:
      return COMPACT_CHAR_DENSITY;
    case displayDensities.COMFORTABLE:
      return COMFORTABLE_CHAR_DENSITY;

    default:
      return DEFAULT_CHAR_DENSITY;
  }
}

function determineAsideMaxWidth(rowsAmount) {
  return rowsAmount > 2 ? WIDE_ASIDE_MAX_WIDTH : MEDIUM_ASIDE_MAX_WIDTH;
}

export { determineCharDensity, determineAsideMaxWidth };
