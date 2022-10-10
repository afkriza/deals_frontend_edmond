import { expect } from 'chai';

import getters from 'store/modules/rates/getters';
import unitScopes from 'enums/unit-scopes';

import mockRateGenerator from 'mocks/models/rate';

describe('Getters/rates', () => {
  let state;
  let rateA;
  let rateB;
  let rateC;

  beforeEach(() => {
    rateA = mockRateGenerator();
    rateB = mockRateGenerator();
    rateC = mockRateGenerator();

    rateA.accepted = true;
    rateC.accepted = true;

    state = {
      rates: {
        isLoading: false,
        isLoaded: true,
        data: [rateA, rateB, rateC]
      },
      activeFilterTabID: rateA.property.id,
      filters: {
        data: [
          {
            id: 1
          }
        ]
      },
      unitScope: unitScopes.ALL,
      visibleChannels: [rateA.channel.id]
    };
  });

  it('returns list of all units for channel and property', () => {
    const units = getters.units(state);
    expect(units).to.have.lengthOf(3);
  });

  it('returns if data for rates is loaded', () => {
    expect(getters.isRatesDataLoaded(state)).to.equal(true);
  });

  it('returns if data for rates is loading', () => {
    expect(getters.isRatesDataLoading(state)).to.equal(false);
  });
});
