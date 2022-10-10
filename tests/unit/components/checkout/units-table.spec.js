import { expect } from 'chai';

import UnitsTable from 'components/checkout/UnitsTable';
import { mountComponent, destroyComponent } from 'helpers/component';

import { unitsTableHeaderTypes } from 'enums/units-table-header-types';
import mockRateGenerator from 'mocks/models/rate';

describe('UnitsTable', function() {
  let component;

  beforeEach(function() {
    const rateA = mockRateGenerator();
    rateA.accepted = true;
    rateA.confirmed = true;

    component = mountComponent(UnitsTable, {
      isRatesTab: true,
      units: [rateA],
      headerItems: [
        {
          type: unitsTableHeaderTypes.LABEL.id,
          label: 'AAA'
        },
        {
          type: unitsTableHeaderTypes.LABEL.id,
          label: ''
        },
        {
          type: unitsTableHeaderTypes.CHECKBOX.id
        }
      ],
      property: {
        id: 33,
        name: 'Hotel Infinum'
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
