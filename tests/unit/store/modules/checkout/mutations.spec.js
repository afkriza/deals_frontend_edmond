/* eslint-disable new-cap */
import { expect } from 'chai';

import * as mutationTypes from 'store/mutation-types';
import mutations from 'store/modules/checkout/mutations';

import { checkoutTabsEnum } from 'enums/checkout-tabs';

import mockRateGenerator from 'mocks/models/rate';
import mockInventoryGenerator from 'mocks/models/inventory';

describe('Mutations/checkout', () => {
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

    rateA.accepted = true;
    rateB.accepted = true;
    rateC.accepted = true;

    rateA.confirmed = false;
    rateB.confirmed = false;
    rateC.confirmed = false;

    inventoryA = mockInventoryGenerator();
    inventoryB = mockInventoryGenerator();
    inventoryC = mockInventoryGenerator();

    inventoryA.accepted = true;
    inventoryB.accepted = true;
    inventoryC.accepted = true;

    inventoryA.confirmed = false;
    inventoryB.confirmed = false;
    inventoryC.confirmed = false;

    state = {
      rates: [rateA, rateB, rateC],
      inventory: [inventoryA, inventoryB, inventoryC],
      activeTabID: '',
      localDatabaseLoaded: false,
      isDataSaving: false,
      isDataSaved: false
    };
  });

  it(mutationTypes.CHECKOUT_ACTIVE_TAB_UPDATE, () => {
    mutations.CHECKOUT_ACTIVE_TAB_UPDATE(state, checkoutTabsEnum.RATES.id);
    expect(state.activeTabID).to.equal(checkoutTabsEnum.RATES.id);

    mutations.CHECKOUT_ACTIVE_TAB_UPDATE(
      state,
      checkoutTabsEnum.INVENTORIES.id
    );
    expect(state.activeTabID).to.equal(checkoutTabsEnum.INVENTORIES.id);
  });

  it(mutationTypes.LOCAL_DATABASE_LOADED, () => {
    mutations.LOCAL_DATABASE_LOADED(state);
    expect(state.localDatabaseLoaded).to.equal(true);

    mutations.LOCAL_DATABASE_LOADED(state);
    expect(state.localDatabaseLoaded).to.equal(true);
  });

  it(mutationTypes.CHECKOUT_UNIT_REMOVE, () => {
    state.activeTabID = checkoutTabsEnum.RATES.id;
    mutations.CHECKOUT_UNIT_REMOVE(state, rateA.id);
    expect(state.rates).to.deep.equal([rateB, rateC]);
  });

  it(mutationTypes.CHECKOUT_UNIT_REMOVE, () => {
    state.activeTabID = checkoutTabsEnum.RATES.id;
    mutations.CHECKOUT_UNIT_REMOVE(state, 'dummy');
    expect(state.rates).to.deep.equal([rateA, rateB, rateC]);
  });

  it(mutationTypes.CHECKOUT_UNIT_UPDATE, () => {
    state.activeTabID = checkoutTabsEnum.RATES.id;
    mutations.CHECKOUT_UNIT_UPDATE(state, {
      unitID: rateA.id,
      value: {
        confirmed: true,
        something: 4
      }
    });

    expect(state.rates[0]).to.have.property('confirmed').that.is.true;
    expect(state.rates[0]).not.to.have.property('something');
  });

  it(mutationTypes.CHECKOUT_UNIT_REMOVE, () => {
    state.activeTabID = checkoutTabsEnum.INVENTORIES.id;
    mutations.CHECKOUT_UNIT_REMOVE(state, inventoryA.id);
    expect(state.inventory).to.deep.equal([inventoryB, inventoryC]);
  });

  it(mutationTypes.CHECKOUT_UNIT_REMOVE, () => {
    state.activeTabID = checkoutTabsEnum.INVENTORIES.id;
    mutations.CHECKOUT_UNIT_REMOVE(state, 'dummy');
    expect(state.inventory).to.deep.equal([inventoryA, inventoryB, inventoryC]);
  });

  it(mutationTypes.CHECKOUT_UNIT_UPDATE, () => {
    state.activeTabID = checkoutTabsEnum.INVENTORIES.id;
    mutations.CHECKOUT_UNIT_UPDATE(state, {
      unitID: inventoryA.id,
      value: {
        confirmed: true,
        something: 4
      }
    });

    expect(state.inventory[0]).to.have.property('confirmed').that.is.true;
    expect(state.inventory[0]).not.to.have.property('something');
  });

  it(mutationTypes.CHECKOUT_UNITS_SAVING, () => {
    mutations.CHECKOUT_UNITS_SAVING(state);

    expect(state.isDataSaved).to.be.false;
    expect(state.isDataSaving).to.be.true;
  });

  it(mutationTypes.CHECKOUT_UNITS_SAVED, () => {
    mutations.CHECKOUT_UNITS_SAVED(state);

    expect(state.isDataSaved).to.be.true;
    expect(state.isDataSaving).to.be.false;
  });

  it(mutationTypes.CHECKOUT_UNITS_SAVED, () => {
    state.isDataSaving = true;
    state.isDataSaved = true;

    mutations.CHECKOUT_UNITS_RESET(state);

    expect(state.isDataSaved).to.be.false;
    expect(state.isDataSaving).to.be.false;
  });

  it(mutationTypes.CHECKOUT_UNITS_ERROR, () => {
    const error = {
      message: 'Random error message'
    };

    state.isDataSaving = true;
    state.isDataSaved = true;

    mutations.CHECKOUT_UNITS_ERROR(state, error);

    expect(state.isDataSaved).to.be.false;
    expect(state.isDataSaving).to.be.false;
    expect(state.error).to.equal(error.message);
  });

  it(mutationTypes.CHECKOUT_CLEAR_UNITS_ERROR, () => {
    state.error = 'Random error message';

    mutations.CHECKOUT_CLEAR_UNITS_ERROR(state);

    expect(state.error).to.equal('');
  });

  it(mutationTypes.CHECKOUT_ACTIVITY, () => {
    const activities = state.rates.map(unit => {
      return {
        unitType: {
          id: unit.unitType.id
        },
        channel: {
          id: unit.channel.id
        },
        property: {
          id: unit.property.id
        },
        bookingDate: unit.bookingDate
      };
    });

    mutations.CHECKOUT_ACTIVITY(state, { activities, activeTab: 'rates' });

    state.rates.forEach((unit, index) => {
      expect(unit.isMatchingActivity(activities[index])).to.be.true;
    });
  });
});

/* eslint-enable new-cap */
