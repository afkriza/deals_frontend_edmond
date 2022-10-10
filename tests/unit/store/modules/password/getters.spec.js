import { expect } from 'chai';

import getters from 'store/modules/password/getters';

describe('Getters/password', () => {
  let state;

  beforeEach(() => {
    const password = {
      isSaving: false,
      isSaved: true
    };

    state = {
      password
    };
  });

  it('returns if password is saving', () => {
    const isPasswordSaving = getters.isPasswordSaving(state);
    expect(isPasswordSaving).to.equal(false);
  });

  it('returns if password is saved', () => {
    const isPasswordSaved = getters.isPasswordSaved(state);
    expect(isPasswordSaved).to.equal(true);
  });
});
