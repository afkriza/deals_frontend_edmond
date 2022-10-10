import { expect } from 'chai';

import InventoryMaster from 'components/inventory/InventoryMaster';
import { mountComponent, destroyComponent } from 'helpers/component';
import mockInventoryGenerator from 'mocks/models/inventory';

describe('InventoryMaster', function() {
  let component;
  const unitA = mockInventoryGenerator();
  const unitB = mockInventoryGenerator();
  const unitC = mockInventoryGenerator();

  beforeEach(function() {
    component = mountComponent(InventoryMaster, {
      channel: {
        id: 1,
        name: 'CH'
      },
      allAccepted: false,
      units: [unitA, unitB, unitC],
      allowedPlacedUnits: [1, 2]
    });
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
