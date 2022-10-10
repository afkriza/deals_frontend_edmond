import { expect } from 'chai';

import ChoiceChip from 'components/core/ChoiceChip';
import { mountComponent, destroyComponent } from 'helpers/component';

describe('ChoiceChip', function() {
  let component;

  beforeEach(function() {
    component = mountComponent(ChoiceChip, {
      label: 'Chip',
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
