import { expect } from 'chai';

import ActionFooter from 'components/app/ActionFooter';
import { mountComponent, destroyComponent } from 'helpers/component';

describe('ActionFooter', function() {
  let component;

  beforeEach(function() {
    component = mountComponent(ActionFooter, {
      label: 'Summy'
    });
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
