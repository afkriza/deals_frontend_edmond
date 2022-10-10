import { expect } from 'chai';

import Inventory from 'models/Inventory';

describe('models/Inventory', () => {
  let inventory;

  beforeEach(() => {
    inventory = new Inventory({
      id: 1495,
      bookingDate: '2017-05-01',
      stopSignal: 1,
      currentStopSignal: null,
      noOfPlacedUnits: 50,
      currentNoOfPlacedUnits: 2,
      placedUnitsMode: 'manual',
      property: {
        id: 662
      },
      channel: {},
      unitType: {}
    });
  });

  it('should return create an Inventory instance', () => {
    expect(inventory).to.exist;
  });

  it('should set Inventory values', () => {
    inventory.setValue({
      newNoOfPlacedUnits: 10,
      newStopSignal: true,
      accepted: true
    });

    expect(inventory.newNoOfPlacedUnits).to.equal(10);
    expect(inventory.newStopSignal).to.equal(true);
    expect(inventory.accepted).to.equal(true);
  });

  it('should check if object is equal', () => {
    const inventoryB = new Inventory({
      id: inventory.id,
      newNoOfPlacedUnits: inventory.newNoOfPlacedUnits,
      newStopSignal: inventory.newStopSignal
    });

    const inventoryC = new Inventory({
      id: 'dummy',
      newNoOfPlacedUnits: inventory.newNoOfPlacedUnits,
      newStopSignal: inventory.newStopSignal
    });

    const inventoryD = {
      id: inventory.id,
      newNoOfPlacedUnits: inventory.newNoOfPlacedUnits,
      newStopSignal: inventory.newStopSignal
    };

    expect(inventory.isEqual(inventoryB)).to.be.true;
    expect(inventory.isEqual(inventoryC)).to.be.false;
    expect(inventory.isEqual(inventoryD)).to.be.false;
  });

  it('should clone existing object', () => {
    const clone = inventory.clone();

    expect(clone).to.be.an.instanceof(Inventory);
    expect(clone.newNoOfPlacedUnits).to.be.equal(inventory.newNoOfPlacedUnits);
    expect(clone.newStopSignal).to.be.equal(inventory.newStopSignal);
  });

  it('should return Inventory suggestions', () => {
    expect(inventory.hasSuggestion).to.equal(true);
  });

  it('should return Inventory activity flag', () => {
    expect(inventory.isActive).to.equal(true);
  });

  it('should return Inventory stopped flag', () => {
    expect(inventory.isStopped).to.equal(false);
  });

  it('should return Inventory accepted flag', () => {
    expect(inventory.isAccepted).to.equal(false);
  });

  it('should return if rate is dirty', () => {
    expect(inventory.isDirty).to.be.equal(false);
    inventory.setValue({
      newNoOfPlacedUnits: 5
    });
    expect(inventory.isDirty).to.be.equal(true);
  });

  it('should return if rate is dirty', () => {
    expect(inventory.isDirty).to.be.equal(false);
    inventory.setValue({
      accepted: true
    });
    expect(inventory.isDirty).to.be.equal(false);
  });

  it('should return if inventory has fixed state', () => {
    expect(inventory.hasFixedState).to.be.equal(false);
  });
});
