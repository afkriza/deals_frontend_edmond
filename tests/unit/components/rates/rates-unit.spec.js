import { expect } from 'chai';

import RatesUnit from 'components/rates/RatesUnit';
import { mountComponent, destroyComponent } from 'helpers/component';

describe('RatesUnit', function() {
  let component;

  beforeEach(function() {
    component = mountComponent(RatesUnit, {
      unit: {
        baseBlock: 100,
        price: 100,
        suggestedBlock: 0,
        suggestedPrice: 0,
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
      allowedPriceLevels: [100, 130]
    });
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
