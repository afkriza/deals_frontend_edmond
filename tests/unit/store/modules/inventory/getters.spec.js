import { expect } from 'chai';

import getters from 'store/modules/inventory/getters';
import unitScopes from 'enums/unit-scopes';

import mockInventoryGenerator from 'mocks/models/rate';

describe('Getters/inventory', () => {
  let state;
  let inventoryA;
  let inventoryB;
  let inventoryC;

  beforeEach(() => {
    inventoryA = mockInventoryGenerator();
    inventoryB = mockInventoryGenerator();
    inventoryC = mockInventoryGenerator();

    inventoryA.accepted = true;
    inventoryC.accepted = true;

    state = {
      inventory: {
        isLoading: false,
        isLoaded: true,
        data: [inventoryA, inventoryB, inventoryC]
      },
      activeFilterTabID: 12,
      filters: {
        data: [
          {
            id: 1
          }
        ]
      },
      unitScope: unitScopes.ALL,
      visibleChannels: [inventoryA.channel.id]
    };
  });

  it('returns list of all units for channel and property', () => {
    const units = getters.units(state);
    expect(units).to.have.lengthOf(3);
  });

  it('returns if data for inventory is loaded', () => {
    expect(getters.isInventoryDataLoaded(state)).to.equal(true);
  });

  it('returns if data for inventory is loading', () => {
    expect(getters.isInventoryDataLoading(state)).to.equal(false);
  });
});
