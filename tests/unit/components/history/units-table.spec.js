import { expect } from 'chai';

import UnitsTable from 'components/history/UnitsTable';
import { mountComponent, destroyComponent } from 'helpers/component';

import { unitsTableHeaderTypes } from 'enums/units-table-header-types';

describe('UnitsTable', function() {
  let component;

  beforeEach(function() {
    const historyItemA = {
      id: 'A',
      activityType: 'RATE',
      channels: 'ALL',
      createdAt: '2017-01-01',
      endDate: '2017-01-01',
      noOfPlacedUnits: null,
      priceLEvel: 100,
      startDate: '2017-01-01',
      stopSignal: false,
      unitTypes: 'ALL'
    };

    const historyItemB = {
      id: 'B',
      activityType: 'INVENTORY',
      channels: 'B2B',
      createdAt: '2017-01-01',
      endDate: '2017-01-01',
      noOfPlacedUnits: 3,
      priceLevel: null,
      startDate: '2017-01-01',
      stopSignal: true,
      unitTypes: 'A21M,B2'
    };

    component = mountComponent(UnitsTable, {
      units: [historyItemA, historyItemB],
      headerItems: [
        {
          type: unitsTableHeaderTypes.LABEL.id,
          label: 'AAA'
        },
        {
          type: unitsTableHeaderTypes.LABEL.id,
          label: 'BB'
        }
      ]
    });
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
