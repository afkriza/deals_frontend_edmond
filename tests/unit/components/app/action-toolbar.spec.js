import { expect } from 'chai';

import ActionToolbar from 'components/toolbars/AppToolbar';
import unitChannels from 'enums/channels';
import { mountComponent, destroyComponent } from 'helpers/component';
import unitModes from 'enums/unit-modes';

describe('AppToolbar', function() {
  let component;

  beforeEach(function() {
    component = mountComponent(ActionToolbar, {
      primaryButtonText: 'Primary',
      secondaryButtonText: 'Secondary',
      filterOptions: unitChannels,
      selectedFilterOptions: ['B2B', 'IND'],
      switcherModes: Object.values(unitModes)
    });
  });

  afterEach(function() {
    destroyComponent(component);
  });

  it('renders ok', function() {
    expect(component.$el).to.be.ok;
  });
});
