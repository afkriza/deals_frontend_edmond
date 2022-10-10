import { expect } from 'chai';

import UnitsDateRow from 'components/units/UnitsDateRow';
import { mountComponent, destroyComponent } from 'helpers/component';

describe('UnitsDateRow', function() {
  let component;

  beforeEach(function() {
    component = mountComponent(UnitsDateRow, {
      units: [],
      date: '',
      disabled: false,
      isChecked: false
    });
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
