import { expect } from 'chai';

import getters from 'store/modules/history/getters';

describe('Getters/history', () => {
  let state;

  beforeEach(() => {
    const history = {
      isLoaded: true,
      isLoading: false,
      isFullyLoaded: false,
      data: [
        {
          activityType: 'RATE'
        }
      ]
    };

    state = {
      history
    };
  });

  it('returns units', () => {
    const units = getters.units(state);
    expect(units).to.have.lengthOf(1);
    expect(units[0])
      .to.have.property('activityType')
      .that.is.equal('RATE');
  });

  it('returns if history data is fully loaded', () => {
    const isHistoryFullyLoaded = getters.isHistoryFullyLoaded(state);
    expect(isHistoryFullyLoaded).to.equal(false);
  });

  it('returns if history data is loading', () => {
    const isHistoryDataLoading = getters.isHistoryDataLoading(state);
    expect(isHistoryDataLoading).to.equal(false);
  });
});
