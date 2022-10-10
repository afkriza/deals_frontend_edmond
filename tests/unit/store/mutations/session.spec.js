/* eslint-disable new-cap */
import { expect } from 'chai';

import * as mutationTypes from 'store/mutation-types';
import mutations from 'store/mutations';

describe('Mutations/session', function() {
  it(mutationTypes.SESSION_SUCCESS, function() {
    const state = {
      session: {
        isLoading: true
      }
    };

    const user = { id: 5 };

    mutations.SESSION_SUCCESS(state, { user, token: 'ttookkeenn' });

    expect(state.session.isLoading).to.equal(false);
    expect(state.session.isLoaded).to.equal(true);
    expect(state.session.user).to.equal(user);
    expect(state.session.token).to.equal('ttookkeenn');
  });

  it(mutationTypes.SESSION_REQUEST, function() {
    const state = {
      session: {
        isLoading: false
      }
    };

    mutations.SESSION_REQUEST(state);

    expect(state.session.isLoading).to.equal(true);
  });

  it(mutationTypes.SESSION_FAILURE, function() {
    const state = {
      session: {
        isLoading: true
      }
    };

    mutations.SESSION_FAILURE(state);

    expect(state.session.isLoaded).to.equal(true);
    expect(state.session.isLoading).to.equal(false);
  });

  it(mutationTypes.SESSION_DESTROY, function() {
    const state = {
      session: {
        user: {
          id: '12',
          name: 'Dummy User'
        },
        token: 'ttookkeenn'
      }
    };

    mutations.SESSION_DESTROY(state);

    expect(state.session.user).to.be.null;
    expect(state.session.user).to.not.be.ok;
  });

  it(mutationTypes.UNAUTHENTICATED_REQUEST, function() {
    const state = {
      session: {}
    };

    mutations.UNAUTHENTICATED_REQUEST(state, 'pagePath');

    expect(state.session.nextPathName).to.equal('pagePath');
  });
});

/* eslint-enable new-cap */
