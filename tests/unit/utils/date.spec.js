import { expect } from 'chai';

import * as dateUtil from 'utils/date';

describe('utils/date', () => {
  describe('getDateWithoutYear', () => {
    it('should extract everything but the year from an ISO string date or datetime', () => {
      expect(dateUtil.getDateWithoutYear('2015-01-01')).to.equal('01-01');
      expect(dateUtil.getDateWithoutYear('1993-05-16T01:01:00')).to.equal(
        '05-16T01:01:00'
      );
    });
  });

  describe('getYear', () => {
    it('should extract the year (as a number) from an ISO date or datetime', () => {
      expect(dateUtil.getYear('2015-01-01')).to.equal(2015);
      expect(dateUtil.getYear('1993-05-16T01:01:00')).to.equal(1993);
    });
  });
});
