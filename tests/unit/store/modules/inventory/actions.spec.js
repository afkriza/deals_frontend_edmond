import { expect } from 'chai';

import MockDatabases from 'mocks/databases';
import testAction from 'helpers/action';
import actionsGenerator from 'store/modules/inventory/actions';
import * as mutationTypes from 'store/mutation-types';

import mockInventoryGenerator from 'mocks/models/inventory';

jest.mock('api/services/Inventories.service');

describe('Actions/inventory', () => {
  let actions;
  let inventoryA;

  const getters = {
    filtersQuery: {},
    filterTabs: [{ id: '1' }]
  };

  beforeEach(() => {
    inventoryA = mockInventoryGenerator();

    actions = actionsGenerator({
      databases: MockDatabases
    });
  });

  it('fetches inventory', async () => {
    await MockDatabases.inventory.addAll([inventoryA]);

    let hasStarted = false;
    const commit = (type, data) => {
      if (hasStarted) {
        expect(type).to.be.equal(mutationTypes.INVENTORY_FILTER_TAB_CHANGE);
        expect(data).to.be.equal('1');
      } else {
        expect(type).to.be.equal(mutationTypes.INVENTORY_REQUEST);
        hasStarted = true;
      }
    };

    const dispatch = type => {
      expect(type).to.be.equal('saveUnits');
    };

    await actions.fetchUnits({ commit, dispatch, getters });

    const dataInDatabase = await MockDatabases.inventory.getAll();
    expect(dataInDatabase).to.be.deep.equal([]);
  });

  it('updates single inventory unit to storage', async () => {
    await testAction(actions.saveSingleToStorage, {
      payload: inventoryA,
      state: {
        inventory: {
          isLoading: false,
          isLoaded: false,
          data: [],
          filters: []
        }
      },
      getters,
      expectedMutations: [
        {
          type: mutationTypes.INVENTORY_STORAGE_SAVE_START
        },
        {
          type: mutationTypes.INVENTORY_STORAGE_SAVE_END
        }
      ]
    });
    const doc = await MockDatabases.inventory.get(inventoryA._id);
    expect(doc).to.exist;
  });
});
