import { expect } from 'chai';

import UnitRow from 'components/checkout/items/UnitRow';
import { mountComponent, destroyComponent } from 'helpers/component';

import mockRateGenerator from 'mocks/models/rate';

describe('UnitRow', function() {
  let component;

  beforeEach(function() {
    const rateA = mockRateGenerator();
    rateA.accepted = true;
    rateA.confirmed = true;

    component = mountComponent(UnitRow, {
      dateGroup: {
        dates: ['2018-11-28', '2018-11-29'],
        group: [
          {
            groupedChannelByUnitType: [
              {
                channelIds: '4108,4113',
                channels: [
                  {
                    channelId: '4108',
                    unitTypes: ['A2', 'CC2', 'FA2']
                  },
                  {
                    channelId: '4113',
                    unitTypes: ['A2', 'CC2', 'FA2']
                  }
                ]
              }
            ]
          }
        ],
        groupedChannelGroups: [rateA]
      }
    });
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
