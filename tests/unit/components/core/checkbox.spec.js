import { expect } from 'chai';

import Checkbox from 'components/core/Checkbox';
import { mountComponent, destroyComponent } from 'helpers/component';

describe('Checkbox', function() {
  let component;

  beforeEach(function() {
    component = mountComponent(Checkbox, { checked: true });
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
