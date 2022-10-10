import { expect } from 'chai';

import MultiSwitch from 'components/core/MultiSwitch';
import { mountComponent, destroyComponent } from 'helpers/component';

describe('MultiSwitch', function() {
  let component;

  beforeEach(function() {
    component = mountComponent(MultiSwitch, {
      label: 'Switch',
      value: true
    });
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
