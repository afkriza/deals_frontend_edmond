/* eslint-disable new-cap */
import { expect } from 'chai';

import * as mutationTypes from 'store/mutation-types';
import mutations from 'store/modules/password/mutations';

describe('Password/mutations', function() {
  let state;

  it(mutationTypes.PASSWORD_CREATE, function() {
    state = {
      password: {
        isSaving: false
      }
    };

    mutations.PASSWORD_CREATE(state);

    expect(state.password.isSaving).to.equal(true);
  });

  it(mutationTypes.PASSWORD_CREATE_SUCCESS, function() {
    state = {
      password: {
        isSaving: true,
        isSaved: false
      }
    };

    mutations.PASSWORD_CREATE_SUCCESS(state);

    expect(state.password.isSaving).to.equal(false);
    expect(state.password.isSaved).to.equal(true);
  });

  it(mutationTypes.PASSWORD_CREATE_FAILURE, function() {
    state = {
      password: {
        isSaving: true,
        isSaved: false
      }
    };

    mutations.PASSWORD_CREATE_FAILURE(state);

    expect(state.password.isSaving).to.equal(false);
    expect(state.password.isSaved).to.equal(false);
  });
});
