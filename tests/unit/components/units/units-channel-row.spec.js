import { expect } from 'chai';

import UnitsChannelRow from 'components/units/UnitsChannelRow';
import { mountComponent, destroyComponent } from 'helpers/component';

describe('UnitsChannelRow', function() {
  let component;

  beforeEach(function() {
    component = mountComponent(UnitsChannelRow, {
      units: [],
      channel: {
        name: 'CH'
      },
      disabled: false
    });
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
