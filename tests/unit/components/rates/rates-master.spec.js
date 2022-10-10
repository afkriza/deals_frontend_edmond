import { expect } from 'chai';

import RatesMaster from 'components/rates/RatesMaster';
import { mountComponent, destroyComponent } from 'helpers/component';
import mockRateGenerator from 'mocks/models/rate';

describe('RatesMaster', function() {
  let component;
  const unitA = mockRateGenerator();
  const unitB = mockRateGenerator();
  const unitC = mockRateGenerator();

  beforeEach(function() {
    component = mountComponent(RatesMaster, {
      channel: {
        name: 'A'
      },
      allAccepted: false,
      units: [unitA, unitB, unitC],
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
