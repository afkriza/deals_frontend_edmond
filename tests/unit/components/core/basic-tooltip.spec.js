import { expect } from 'chai';

import BasicTooltip from 'components/core/BasicTooltip';
import { mountComponent, destroyComponent } from 'helpers/component';

describe('BasicTooltip', function() {
  let component;

  beforeEach(function() {
    component = mountComponent(BasicTooltip, {
      disabled: false
    });
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });

  it('switches state of tooltip', function() {
    expect(component.isTooltipOpen).to.equal(false);
    component.showTooltip();
    expect(component.isTooltipOpen).to.equal(true);
  });
});
