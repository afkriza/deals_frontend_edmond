import { expect } from 'chai';

import BasicDropdown from 'components/core/BasicDropdown';
import { mountComponent, destroyComponent } from 'helpers/component';

describe('BasicDropdown', function() {
  let component;

  beforeEach(function() {
    component = mountComponent(BasicDropdown, { isOpen: true });
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
