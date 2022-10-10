import { expect } from 'chai';

import InventoryUnit from 'components/inventory/InventoryUnit';
import { mountComponent, destroyComponent } from 'helpers/component';

describe('InventoryUnit', function() {
  let component;

  beforeEach(function() {
    component = mountComponent(InventoryUnit, {
      unit: {
        id: 1,
        stopSignal: 0,
        currentStopSignal: 1,
        numberOfOverbookedUnits: 2,
        numberOfFreeUnits: 0,
        checked: false
      },
      savedUnits: [
        {
          id: 1
        },
        {
          id: 2
        }
      ],
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
