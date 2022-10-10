import { expect } from 'chai';

import CheckoutRatesItem from 'components/checkout/items/Rate';
import { mountComponent, destroyComponent } from 'helpers/component';

import mockRateGenerator from 'mocks/models/rate';

describe('CheckoutRatesItem', function() {
  let component;

  beforeEach(function() {
    const rateA = mockRateGenerator();
    rateA.accepted = true;
    rateA.confirmed = true;

    component = mountComponent(CheckoutRatesItem, {
      channelGroup: [
        {
          channelId: '4108',
          unitTypes: ['A2', 'CC2', 'FA2', 'G2']
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
