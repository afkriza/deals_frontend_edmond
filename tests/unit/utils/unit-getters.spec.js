import { expect } from 'chai';

import getters from 'utils/unit/getters';
import rateTypes from 'enums/unit-scopes';

import mockRateGenerator from 'mocks/models/rate';

describe('Utils/unit/getters', () => {
  let state;
  let rateA;
  let rateB;
  let rateC;
  let checkoutRate;

  beforeEach(() => {
    rateA = mockRateGenerator();
    rateB = mockRateGenerator();
    rateC = mockRateGenerator();

    rateA.accepted = true;
    rateC.accepted = true;

    checkoutRate = rateA.clone();
    checkoutRate.newPriceLevel = 200;

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
      rateType: rateTypes.ALL,
      visibleChannels: [rateA.channel.id]
    };
  });

  it('returns list of all units for channel', () => {
    rateB.channel.id = 'DUMMY';

    const units = state.rates.data;
    const unitsForChannel = getters.unitsForChannel(state, { units });
    expect(unitsForChannel).to.have.lengthOf(2);
    expect(unitsForChannel[0])
      .to.have.property('id')
      .that.is.equal(rateA.id);
    expect(unitsForChannel[1])
      .to.have.property('id')
      .that.is.equal(rateC.id);
  });

  it('returns rates that can be saved', () => {
    const units = state.rates.data;
    const unitsInCheckout = [checkoutRate];
    const savableRates = getters.savableUnits(state, {
      units,
      unitsInCheckout
    });
    expect(savableRates).to.have.lengthOf(2);
    expect(savableRates[1])
      .to.have.property('id')
      .that.is.equal(rateC.id);
  });

  it('returns rates that can be saved', () => {
    rateA.newPriceLevel = 12;
    const units = state.rates.data;
    const unitsInCheckout = [checkoutRate];
    const savableRates = getters.savableUnits(state, {
      units,
      unitsInCheckout
    });
    expect(savableRates).to.have.lengthOf(2);
    expect(savableRates[0])
      .to.have.property('id')
      .that.is.equal(rateA.id);
    expect(savableRates[1])
      .to.have.property('id')
      .that.is.equal(rateC.id);
  });

  it('returns rates that are dirty but not savable', () => {
    rateA.accepted = false;
    rateA.newPriceLevel = 75;
    rateB.newPriceLevel = 100;
    const unitsForChannel = state.rates.data;
    const unitsInCheckout = [checkoutRate];
    const dirtyNotSaved = getters.dirtyNotSaved(state, {
      unitsForChannel,
      unitsInCheckout
    });

    expect(dirtyNotSaved).to.have.lengthOf(2);
    expect(dirtyNotSaved[0])
      .to.have.property('id')
      .that.is.equal(rateA.id);
    expect(dirtyNotSaved[1])
      .to.have.property('id')
      .that.is.equal(rateB.id);
  });

  it('returns filter tabs', () => {
    rateA.property.id = 'propertyA';
    rateA.property.name = 'ZZ';
    rateB.property.id = 'propertyA';
    rateB.property.name = 'ZZ';
    rateC.property.id = 'propertyC';
    rateC.property.name = 'AA';

    rateA.accepted = false;
    rateB.accepted = false;
    rateC.accepted = false;

    const unitsForChannel = [rateA, rateB, rateC];

    const tabs = getters.filterTabs(state, { unitsForChannel });
    expect(tabs).to.have.lengthOf(2);

    expect(tabs[0])
      .to.have.property('id')
      .that.is.equal(rateC.property.id);
    expect(tabs[0])
      .to.have.property('quantity')
      .that.is.equal(1);

    expect(tabs[1])
      .to.have.property('id')
      .that.is.equal(rateA.property.id);
    expect(tabs[1])
      .to.have.property('quantity')
      .that.is.equal(2);
  });
});
