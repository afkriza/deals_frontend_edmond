import { expect } from 'chai';

import Rate from 'models/Rate';

describe('models/Rate', () => {
  let rateA;

  beforeEach(() => {
    rateA = new Rate({
      id: 'R1',
      bookingDate: '2017-07-01',
      priceLevel: '120',
      currentPriceLevel: '100',
      priceAmount: 110,
      currentPriceAmount: 90,
      priceLevelMode: 'manual',
      property: {
        id: '1p'
      },
      unitType: {
        id: '1u'
      },
      channel: {
        id: '1c'
      },
      stopSignal: false,
      currentStopSignal: false,
      priceLevels: ['0', '10', '20', '100', '120'],
      priceAmounts: [0, 60, 60, 100, 120]
    });
  });

  it('should set new price level', () => {
    expect(rateA.newPriceLevel).to.be.equal('100');
  });

  it('should set new price amount', () => {
    rateA.currentPriceAmount = 100;
    rateA.currentPriceLevel = '10';
    rateA.newPriceLevel = '20';

    expect(rateA.newPriceAmount).to.be.equal(60);
  });

  it('should set new price amount', () => {
    rateA.currentPriceAmount = 100;
    rateA.currentPriceLevel = '0';
    rateA.newPriceLevel = '20';

    expect(rateA.newPriceAmount).to.be.equal(60);
  });

  it('should set new price amount', () => {
    rateA.currentPriceAmount = 30;
    rateA.currentPriceLevel = '80';
    rateA.newPriceLevel = '20';

    expect(rateA.newPriceAmount).to.be.equal(60);
  });

  it('should set new stop signal', () => {
    expect(rateA.newStopSignal).to.be.equal(false);
  });

  it('should set accepted', () => {
    expect(rateA.accepted).to.be.equal(false);
  });

  it('should set checked', () => {
    expect(rateA.checked).to.be.equal(false);
  });

  it('should set correct value to rate', () => {
    rateA.setValue({
      newPriceLevel: 123,
      newStopSignal: true,
      accepted: true,
      checked: true,
      dummy: true
    });

    expect(rateA.newPriceLevel).to.be.equal(123);
    expect(rateA.newStopSignal).to.be.equal(true);
    expect(rateA.accepted).to.be.equal(true);
    expect(rateA.checked).to.be.equal(true);
    expect(rateA).not.to.have.property('dummy');
  });

  it("should be invalid if priceLevel equals to ''", () => {
    rateA.setValue({
      newPriceLevel: ''
    });

    expect(rateA.isValid).to.equal(false);
  });

  it('should check if object is equal', () => {
    const rateB = new Rate({
      id: rateA.id,
      newPriceLevel: rateA.newPriceLevel,
      newStopSignal: rateA.newStopSignal
    });

    const rateC = new Rate({
      id: 'dummy',
      newPriceLevel: rateA.newPriceLevel,
      newStopSignal: rateA.newStopSignal
    });

    const rateD = {
      id: rateA.id,
      newPriceLevel: rateA.newPriceLevel,
      newStopSignal: rateA.newStopSignal
    };

    expect(rateA.isEqual(rateB)).to.be.true;
    expect(rateA.isEqual(rateC)).to.be.false;
    expect(rateA.isEqual(rateD)).to.be.false;
  });

  it('should clone existing object', () => {
    const clone = rateA.clone();

    expect(clone).to.be.an.instanceof(Rate);
    expect(clone.newPriceLevel).to.be.equal(rateA.newPriceLevel);
    expect(clone.newPriceAmount).to.be.equal(rateA.newPriceAmount);
    expect(clone.newStopSignal).to.be.equal(rateA.newStopSignal);
  });

  it('should return if rate has a suggestion', () => {
    expect(rateA.hasSuggestion).to.be.equal(true);
    rateA.accepted = true;
    expect(rateA.hasSuggestion).to.be.equal(false);
  });

  it('should return if rate has a suggestion', () => {
    expect(rateA.hasSuggestion).to.be.equal(true);
    rateA.priceLevel = rateA.currentPriceLevel;
    expect(rateA.hasSuggestion).to.be.equal(false);
  });

  it('should return if rate is dirty', () => {
    expect(rateA.isDirty).to.be.equal(false);
    rateA.setValue({
      newPriceLevel: 75
    });
    expect(rateA.isDirty).to.be.equal(true);
  });

  it('should return if rate is dirty', () => {
    expect(rateA.isDirty).to.be.equal(false);
    rateA.setValue({
      accepted: true
    });
    expect(rateA.isDirty).to.be.equal(false);
  });

  it('should return if rate is valid', () => {
    expect(rateA.isValid).to.be.equal(true);
    rateA.setValue({
      newPriceLevel: 'string'
    });
    expect(rateA.isValid).to.be.equal(false);
  });

  it('should return if rate is valid', () => {
    expect(rateA.isValid).to.be.equal(true);
    rateA.setValue({
      newPriceLevel: '-10'
    });
    expect(rateA.isValid).to.be.equal(false);
  });

  it('should return if rate has fixed state', () => {
    expect(rateA.hasFixedState).to.be.equal(false);
  });

  it('should return if price level mode is dirty', () => {
    expect(rateA.isPriceLevelModeDirty).to.be.equal(false);

    rateA.setValue({
      newPriceLevelMode: 'auto'
    });

    expect(rateA.isPriceLevelModeDirty).to.be.equal(true);
  });
});
