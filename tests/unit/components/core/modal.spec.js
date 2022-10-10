import { expect } from 'chai';

import Modal from 'components/core/Modal';
import { mountComponent, destroyComponent } from 'helpers/component';

describe('Modal', function() {
  let component;

  beforeEach(function() {
    component = mountComponent(Modal);
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
