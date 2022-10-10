import { expect } from 'chai';

import FilterTabs from 'components/app/FilterTabs';
import { mountComponent, destroyComponent } from 'helpers/component';

describe('FilterTabs', function() {
  let component;

  beforeEach(function() {
    component = mountComponent(FilterTabs, {
      activeTabID: '10',
      tabs: [
        {
          id: '10',
          quantity: 10,
          name: 'Test'
        }
      ]
    });
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
