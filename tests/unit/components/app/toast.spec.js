import { expect } from 'chai';

import Toast from 'components/app/Toast';
import { mountComponent, destroyComponent } from 'helpers/component';

describe('Toast', function() {
  let component;

  beforeEach(function() {
    component = mountComponent(Toast, {
      message: 'Successful toast message!',
      type: 'success'
    });
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
