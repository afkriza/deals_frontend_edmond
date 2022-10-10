/* eslint-disable new-cap */
import { expect } from 'chai';

import * as mutationTypes from 'store/mutation-types';
import mutations from 'store/mutations';

describe('Mutations/user', function() {
  it(mutationTypes.USER_UPDATE_REQUEST, function() {
    const state = {
      forms: {
        user: {
          isLoading: false
        }
      }
    };

    mutations.USER_UPDATE_REQUEST(state);

    expect(state.forms.user.isLoading).to.equal(true);
  });

  it(mutationTypes.USER_UPDATE_SUCCESS, function() {
    const state = {
      session: {
        user: {
          id: 5,
          name: 'Ahoj'
        }
      },
      forms: {
        user: {
          isLoading: true
        }
      }
    };

    mutations.USER_UPDATE_SUCCESS(state, {
      user: { data: { id: 5, name: 'Name' } }
    });

    expect(state.forms.user.isLoading).to.equal(false);
    expect(state.session.user.name).to.equal('Name');
  });

  it(mutationTypes.USER_UPDATE_SUCCESS, function() {
    const state = {
      session: {
        user: {
          id: 4,
          name: 'Ahoj'
        }
      },
      forms: {
        user: {
          isLoading: true
        }
      }
    };

    mutations.USER_UPDATE_SUCCESS(state, {
      user: { data: { id: 5, name: 'Name' } }
    });

    expect(state.forms.user.isLoading).to.equal(false);
    expect(state.session.user.name).to.equal('Ahoj');
  });

  it(mutationTypes.USER_UPDATE_FAILURE, function() {
    const state = {
      forms: {
        user: {
          isLoading: true
        }
      }
    };

    mutations.USER_UPDATE_FAILURE(state);

    expect(state.forms.user.isLoading).to.equal(false);
  });
});

/* eslint-enable new-cap */
