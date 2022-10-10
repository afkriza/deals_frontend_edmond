/* eslint-disable new-cap */
import { expect } from 'chai';

import * as mutationTypes from 'store/mutation-types';
import mutations from 'store/modules/inventory/mutations';

import Inventory from 'models/Inventory';

describe('Mutations/inventory', function() {
  it(mutationTypes.INVENTORY_REQUEST, function() {
    const state = {
      inventory: {
        isLoaded: false,
        isLoading: false,
        data: []
      }
    };

    mutations.INVENTORY_REQUEST(state);

    expect(state.inventory.isLoading).to.equal(true);
    expect(state.inventory.isLoaded).to.equal(false);
  });

  it(mutationTypes.INVENTORY_SUCCESS, function() {
    const state = {
      inventory: {
        isLoaded: false,
        isLoading: true,
        data: []
      }
    };

    const units = [
      {
        id: 1,
        name: 'test'
      }
    ];

    mutations.INVENTORY_SUCCESS(state, { units });

    expect(state.inventory.isLoaded).to.equal(true);
    expect(state.inventory.isLoading).to.equal(false);
    expect(state.inventory.data).to.have.lengthOf(1);
    expect(state.inventory.data[0].id).to.equal(1);
  });

  it(mutationTypes.INVENTORY_FAILURE, function() {
    const state = {
      inventory: {
        isLoaded: false,
        isLoading: true,
        data: []
      }
    };

    mutations.INVENTORY_FAILURE(state);

    expect(state.inventory.isLoading).to.equal(false);
    expect(state.inventory.isLoaded).to.equal(false);
  });

  it(mutationTypes.INVENTORY_BULK_UPDATE, function() {
    const state = {
      inventory: {
        data: [
          new Inventory({
            id: 2,
            checked: false
          }),
          new Inventory({
            id: 3,
            checked: true
          })
        ]
      }
    };

    mutations.INVENTORY_BULK_UPDATE(state, {
      unitIDs: [2, 3],
      value: {
        checked: true
      }
    });

    expect(state.inventory.data[0].checked).to.be.true;
    expect(state.inventory.data[1].checked).to.be.true;

    mutations.INVENTORY_BULK_UPDATE(state, {
      unitIDs: [2, 3],
      value: {
        checked: false
      }
    });

    expect(state.inventory.data[0].checked).to.be.false;
    expect(state.inventory.data[1].checked).to.be.false;
  });

  it(mutationTypes.INVENTORY_FILTER_TAB_CHANGE, function() {
    const state = {
      activeFilterTabID: '',
      inventory: {
        isLoaded: false,
        isLoading: true,
        data: []
      }
    };

    mutations.INVENTORY_FILTER_TAB_CHANGE(state, '1');

    expect(state.activeFilterTabID).to.equal('1');
  });
});
/* eslint-enable new-cap */
