import { expect } from 'chai';

import Spinner from 'components/core/Spinner';
import { mountComponent, destroyComponent } from 'helpers/component';

describe('Spinner', function() {
  let component;

  beforeEach(function() {
    component = mountComponent(Spinner);
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
