import { expect } from 'chai';

import UnitsContainer from 'components/units/UnitsContainer';
import { mountComponent, destroyComponent } from 'helpers/component';

describe('UnitsContainer', function() {
  let component;

  beforeEach(function() {
    component = mountComponent(UnitsContainer, {
      dates: [],
      units: [],
      unitsByDate: {},
      isUnitTypeCheckboxPresent: false,
      unitTypes: [],
      checkedUnitTypes: [],
      checkedDates: [],
      initialUnitsWithSuggestionByDate: {},
      unitScope: ''
    });
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
