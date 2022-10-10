import { expect } from 'chai';

import Tag from 'components/core/Tag';
import { mountComponent, destroyComponent } from 'helpers/component';

describe('Tag', function() {
  let component;

  beforeEach(function() {
    component = mountComponent(Tag, {
      label: 'Tag',
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
