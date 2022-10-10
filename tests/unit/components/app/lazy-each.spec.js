import { expect } from 'chai';

import LazyEach from 'components/app/LazyEach';
import { mountComponent, destroyComponent } from 'helpers/component';

describe('LazyEach', function() {
  const mockFunction = function() {
    return;
  };

  let component;

  beforeEach(function() {
    component = mountComponent(LazyEach, {
      items: ['item1', 'item2'],
      scrollableContainerSelector: '#selector',
      action: mockFunction
    });
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
