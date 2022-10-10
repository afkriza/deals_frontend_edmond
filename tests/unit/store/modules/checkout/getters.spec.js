import { expect } from 'chai';

import getters from 'store/modules/checkout/getters';
import { checkoutTabsEnum } from 'enums/checkout-tabs';

import mockRateGenerator from 'mocks/models/rate';
import mockInventoryGenerator from 'mocks/models/inventory';

describe('Getters/checkout', () => {
  const ERROR_EXAMPLE = 'Error example';
  let state;
  let rateA;
  let rateB;
  let rateC;
  let inventoryA;
  let inventoryB;
  let inventoryC;

  beforeEach(() => {
    rateA = mockRateGenerator();
    rateB = mockRateGenerator();
    rateC = mockRateGenerator();

    inventoryA = mockInventoryGenerator();
    inventoryB = mockInventoryGenerator();
    inventoryC = mockInventoryGenerator();

    rateA.accepted = true;
    rateB.accepted = true;
    rateC.accepted = true;

    state = {
      rates: [rateA, rateB, rateC],
      inventory: [inventoryA, inventoryB, inventoryC],
      activeTabID: '',
      error: ''
    };
  });

  it('returns rates', () => {
    const rates = getters.rates(state);
    expect(rates).to.deep.equal([rateA, rateB, rateC]);
  });

  it('returns inventory', () => {
    const inventory = getters.inventory(state);
    expect(inventory).to.deep.equal([inventoryA, inventoryB, inventoryC]);
  });

  it('returns error', () => {
    state.error = ERROR_EXAMPLE;
    const error = getters.error(state);

    expect(error).to.equal(state.error);
  });

  it('returns tabs', () => {
    const rates = state.rates;
    const inventory = state.inventory;
    const tabs = getters.tabs(state, { rates, inventory });
    expect(tabs).to.have.lengthOf(2);
    expect(tabs[0])
      .to.have.property('id')
      .that.is.equal(checkoutTabsEnum.RATES.id);
    expect(tabs[0])
      .to.have.property('quantity')
      .that.is.equal(3);
    expect(tabs[1])
      .to.have.property('id')
      .that.is.equal(checkoutTabsEnum.INVENTORIES.id);
    expect(tabs[1])
      .to.have.property('quantity')
      .that.is.equal(3);
  });

  it('returns units for rates', () => {
    const rates = state.rates;
    const inventory = state.inventory;
    const activeTabID = checkoutTabsEnum.RATES.id;
    const units = getters.units(state, { rates, inventory, activeTabID });
    expect(units).to.deep.equal(rates);
  });

  it('returns units for rates', () => {
    const rates = state.rates;
    const inventory = state.inventory;
    const activeTabID = checkoutTabsEnum.INVENTORIES.id;
    const units = getters.units(state, { rates, inventory, activeTabID });
    expect(units).to.deep.equal(inventory);
  });

  it('returns if rates is current active tab', () => {
    expect(
      getters.isRatesTab({}, { activeTabID: checkoutTabsEnum.INVENTORIES.id })
    ).to.be.false;
    expect(getters.isRatesTab({}, { activeTabID: checkoutTabsEnum.RATES.id }))
      .to.be.true;
  });

  it('returns if inventory is current active tab', () => {
    expect(
      getters.isInventoryTab(
        {},
        { activeTabID: checkoutTabsEnum.INVENTORIES.id }
      )
    ).to.be.true;
    expect(
      getters.isInventoryTab({}, { activeTabID: checkoutTabsEnum.RATES.id })
    ).to.be.false;
  });

  it('returns active tab on initial state', () => {
    const activeTabID = getters.activeTabID(state);
    expect(activeTabID).to.equal(checkoutTabsEnum.RATES.id);
  });

  it('returns active tab', () => {
    state.activeTabID = checkoutTabsEnum.INVENTORIES.id;
    const activeTabID = getters.activeTabID(state);
    expect(activeTabID).to.equal(checkoutTabsEnum.INVENTORIES.id);
  });

  it('returns confirmed rate units', () => {
    state.rates[0].confirmed = true;
    state.rates[1].confirmed = true;
    state.rates[2].confirmed = false;

    const confirmedRates = getters.confirmedRateUnits(state);
    expect(confirmedRates).to.deep.equal([state.rates[0], state.rates[1]]);
  });

  it('returns confirmed inventory units', () => {
    state.inventory[0].confirmed = true;
    state.inventory[1].confirmed = true;
    state.inventory[2].confirmed = false;

    const confirmedInventory = getters.confirmedInventoryUnits(state);
    expect(confirmedInventory).to.deep.equal([
      state.inventory[0],
      state.inventory[1]
    ]);
  });

  it('returns activity filters as set by the selected rate data', () => {
    const rates = state.rates;
    const activityFilters = getters.activityFilters(state, {
      rates,
      isRatesTab: true
    });

    // units have unique property IDs
    const expectedActivityFilters = state.rates.map(unit => {
      return {
        property: unit.property.id,
        channel: [unit.channel.id],
        unit_type: [unit.unitType.id],
        start_date: unit.bookingDate,
        end_date: unit.bookingDate
      };
    });

    expect(activityFilters.length).to.equal(3);
    expect(activityFilters).to.deep.equal(expectedActivityFilters);
  });
});
