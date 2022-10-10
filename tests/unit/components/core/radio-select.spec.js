import { expect } from 'chai';

import RadioSelect from 'components/core/RadioSelect';
import { mountComponent, destroyComponent } from 'helpers/component';

describe('RadioSelect', function() {
  let component;

  beforeEach(function() {
    component = mountComponent(RadioSelect, {
      options: []
    });
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
