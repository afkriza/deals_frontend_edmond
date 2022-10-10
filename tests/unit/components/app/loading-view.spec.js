import { expect } from 'chai';

import LoadingView from 'components/app/LoadingView';
import { mountComponent, destroyComponent } from 'helpers/component';

describe('LoadingView', function() {
  let component;

  beforeEach(function() {
    component = mountComponent(LoadingView);
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
