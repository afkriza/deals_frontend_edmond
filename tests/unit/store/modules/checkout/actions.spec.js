import { expect } from 'chai';

import MockDatabases from 'mocks/databases';
import mockRateGenerator from 'mocks/models/rate';
import mockInventoryGenerator from 'mocks/models/inventory';

import Rate from 'models/Rate';
import Inventory from 'models/Inventory';
import actionsGenerator from 'store/modules/checkout/actions';
import * as mutationTypes from 'store/mutation-types';

jest.mock('api/services/Checkout.service');

describe('Actions/checkout', () => {
  let actions;
  let rateA;
  let inventoryA;

  beforeEach(() => {
    actions = actionsGenerator({
      databases: MockDatabases
    });

    MockDatabases.truncateAll();

    rateA = mockRateGenerator();
    inventoryA = mockInventoryGenerator();

    rateA.accepted = true;
  });

  it('loads inventory', async () => {
    await MockDatabases.checkoutInventory.addAll([inventoryA]);

    const commit = (type, data) => {
      if (type === mutationTypes.CHECKOUT_UNIT_LOAD) {
        expect(data.inventory).to.be.deep.equal([inventoryA]);
      } else {
        expect.fail(
          type,
          mutationTypes.CHECKOUT_UNIT_LOAD,
          'Wrong mutation type called!'
        );
      }
    };

    return actions.loadInventory({ commit });
  });

  it('loads rate', async () => {
    await MockDatabases.checkoutRates.addAll([rateA]);

    const commit = (type, data) => {
      if (type === mutationTypes.CHECKOUT_UNIT_LOAD) {
        expect(data.rates).to.be.deep.equal([rateA]);
      } else {
        expect.fail(
          type,
          mutationTypes.CHECKOUT_UNIT_LOAD,
          'Wrong mutation type called!'
        );
      }
    };

    return actions.loadRate({ commit });
  });

  it('saves inventory', async () => {
    const dispatch = type => {
      expect(type).to.be.equal('loadInventory');
    };

    const inventories = [inventoryA];

    const getters = {
      inventory: []
    };

    await actions.saveInventory({ dispatch, getters }, inventories);
    const databaseData = await MockDatabases.checkoutInventory.getAll();
    const data = databaseData.map(({ doc }) => new Inventory(doc));
    expect(data).to.have.lengthOf(1);
    expect(inventoryA.isEqual(data[0])).to.be.true;
  });

  it('saves rates', async () => {
    const dispatch = type => {
      expect(type).to.be.equal('loadRate');
    };

    const rates = [rateA];

    const getters = {
      rates: []
    };

    await actions.saveRate({ dispatch, getters }, rates);
    const databaseData = await MockDatabases.checkoutRates.getAll();
    const data = databaseData.map(({ doc }) => new Rate(doc));
    expect(data).to.have.lengthOf(1);
    expect(rateA.isEqual(data[0])).to.be.true;
  });

  it('loads data', async () => {
    function* dispatchTester() {
      yield type => {
        expect(type).to.be.equal('loadRate');
        return Promise.resolve();
      };

      yield type => {
        expect(type).to.be.equal('loadInventory');
        return Promise.resolve();
      };
    }

    const tester = dispatchTester();
    const dispatch = type => {
      return tester.next().value(type);
    };

    const commit = type => {
      expect(type).to.be.equal(mutationTypes.LOCAL_DATABASE_LOADED);
    };

    await actions.loadData({ dispatch, commit });
  });

  it('removes rate unit when unit exists in database', async () => {
    const getters = {
      isRatesTab: true,
      units: [rateA]
    };

    const commit = (type, unitID) => {
      expect(type).to.be.equal(mutationTypes.CHECKOUT_UNIT_REMOVE);
      expect(unitID).to.be.equal(rateA.id);
    };

    await MockDatabases.rates.addAll([rateA]);

    await actions.removeUnit({ commit, getters }, rateA.id);
    const { doc } = await MockDatabases.rates.get(rateA.id);
    expect(doc.accepted).to.be.false;
    expect(await MockDatabases.checkoutRates.getAll()).to.deep.equal([]);
  });

  it('removes rate unit when unit does not exist in database', async () => {
    const getters = {
      isRatesTab: true,
      units: [rateA]
    };

    const commit = (type, unitID) => {
      expect(type).to.be.equal(mutationTypes.CHECKOUT_UNIT_REMOVE);
      expect(unitID).to.be.equal(rateA.id);
    };

    await MockDatabases.rates.addAll([]);

    await actions.removeUnit({ commit, getters }, rateA.id);
    expect(await MockDatabases.checkoutRates.getAll()).to.deep.equal([]);
  });

  it('removes inventory unit when unit exists in database', async () => {
    const getters = {
      isRatesTab: false,
      units: [inventoryA]
    };

    const commit = (type, unitID) => {
      expect(type).to.be.equal(mutationTypes.CHECKOUT_UNIT_REMOVE);
      expect(unitID).to.be.equal(inventoryA.id);
    };

    await MockDatabases.rates.addAll([inventoryA]);

    await actions.removeUnit({ commit, getters }, inventoryA.id);
    const { doc } = await MockDatabases.rates.get(inventoryA.id);
    expect(doc.accepted).to.be.false;
    expect(await MockDatabases.checkoutRates.getAll()).to.deep.equal([]);
  });

  it('removes inventory unit when unit does not exist in database', async () => {
    const getters = {
      isRatesTab: false,
      units: [inventoryA]
    };

    const commit = (type, unitID) => {
      expect(type).to.be.equal(mutationTypes.CHECKOUT_UNIT_REMOVE);
      expect(unitID).to.be.equal(inventoryA.id);
    };

    await MockDatabases.rates.addAll([]);

    await actions.removeUnit({ commit, getters }, inventoryA.id);
    expect(await MockDatabases.checkoutRates.getAll()).to.deep.equal([]);
  });

  it('sends units to checkout', () => {
    const commitedMutations = [];
    const expectedMutations = [
      mutationTypes.CHECKOUT_UNITS_SAVED,
      mutationTypes.CHECKOUT_UNITS_SAVING
    ];

    const getters = {
      isRatesTab: true,
      confirmedRateUnits: [
        {
          id: 1
        },
        {
          id: 2
        }
      ],
      confirmedInventoryUnits: [
        {
          id: 1
        },
        {
          id: 2
        }
      ]
    };

    const commit = mutationName => {
      commitedMutations.push(mutationName);
    };

    const dispatch = (actionName, payload) => {
      expect(actionName).to.equal('removeUnit');
    };

    actions.checkoutUnits({ commit, getters, dispatch }).then(() => {
      expect(commitedMutations).to.have.ordered.members(expectedMutations);
    });
  });
});
