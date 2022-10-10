import { expect } from 'chai';

import CheckoutInventoryItem from 'components/checkout/items/Inventory';
import { mountComponent, destroyComponent } from 'helpers/component';

import mockInventoryGenerator from 'mocks/models/rate';

describe('CheckoutInventoryItem', function() {
  let component;

  beforeEach(function() {
    const rateA = mockInventoryGenerator();
    rateA.accepted = true;
    rateA.confirmed = true;

    component = mountComponent(CheckoutInventoryItem, {
      channelGroup: [
        {
          channelId: '4113',
          unitTypes: ['A2', 'CC2', 'HA2B', 'FA2', 'G2']
        }
      ],
      currentUser: {},
      isRatesTab: true,
      showLoader: false,
      units: [rateA]
    });
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
