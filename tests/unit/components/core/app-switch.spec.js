import { expect } from 'chai';

import AppSwitch from 'components/core/AppSwitch';
import { mountComponent, destroyComponent } from 'helpers/component';

describe('AppSwitch', function() {
  let component;

  beforeEach(function() {
    component = mountComponent(AppSwitch, { isActive: true });
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
