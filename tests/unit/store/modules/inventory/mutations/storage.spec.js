/* eslint-disable new-cap */
import { expect } from 'chai';

import * as mutationTypes from 'store/mutation-types';
import mutations from 'store/modules/inventory/mutations';
import Inventory from 'models/Inventory';

import mockInventoryGenerator from 'mocks/models/rate';

describe('Mutations/inventory/storage', () => {
  let inventoryA;

  beforeEach(() => {
    inventoryA = mockInventoryGenerator();
  });

  it(mutationTypes.INVENTORY_STORAGE_SAVE_START, () => {
    const state = {
      storage: {
        isLoading: false
      }
    };

    mutations.INVENTORY_STORAGE_SAVE_START(state);

    expect(state.storage.isLoading).to.be.true;
  });

  it(mutationTypes.INVENTORY_STORAGE_SAVE_END, () => {
    const state = {
      storage: {
        isLoading: true,
        hasData: false
      },
      inventory: {
        isLoaded: true,
        data: [inventoryA]
      }
    };

    mutations.INVENTORY_STORAGE_SAVE_END(state);

    expect(state.storage.isLoading).to.be.false;
    expect(state.storage.hasData).to.be.true;
    expect(state.inventory.isLoaded).to.be.false;
    expect(state.inventory.data).to.be.deep.equal([]);
  });

  it(mutationTypes.INVENTORY_STORAGE_LOAD_START, () => {
    const state = {
      inventory: {
        isLoading: false
      }
    };

    mutations.INVENTORY_STORAGE_LOAD_START(state);

    expect(state.inventory.isLoading).to.be.true;
  });

  it(mutationTypes.INVENTORY_STORAGE_LOAD_END, () => {
    const state = {
      inventory: {
        data: [],
        isLoading: true,
        isLoaded: false
      }
    };

    const units = [];

    mutations.INVENTORY_STORAGE_LOAD_END(state, { units });

    expect(state.inventory.isLoading).to.be.false;
    expect(state.inventory.isLoaded).to.be.false;
    expect(state.inventory.data).to.be.deep.equal([]);
  });

  it(mutationTypes.INVENTORY_STORAGE_LOAD_END, () => {
    const state = {
      inventory: {
        data: [],
        isLoading: true,
        isLoaded: false
      }
    };

    const units = [{ doc: { id: inventoryA.id } }];

    mutations.INVENTORY_STORAGE_LOAD_END(state, { units });

    expect(state.inventory.isLoading).to.be.false;
    expect(state.inventory.isLoaded).to.be.true;
    expect(state.inventory.data).to.have.lengthOf(1);
    expect(state.inventory.data[0])
      .to.have.property('id')
      .that.is.equal(inventoryA.id);
    expect(state.inventory.data[0]).to.be.instanceof(Inventory);
  });
});

/* eslint-enable new-cap */
