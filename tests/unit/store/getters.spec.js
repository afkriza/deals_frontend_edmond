import { expect } from 'chai';

import getters from 'store/getters';

describe('Getters', function() {
  it('calculates isAuthenticated', function() {
    const state = {
      session: {
        isLoading: false,
        user: null,
        token: ''
      }
    };

    expect(
      getters.isAuthenticated(state, { currentUser: state.session.user })
    ).to.equal(false);
  });

  it('calculates isAuthenticated', function() {
    const state = {
      session: {
        isLoading: false,
        user: {
          id: '43',
          name: 'Dummy User'
        },
        token: 'ttookkeenn'
      }
    };

    expect(
      getters.isAuthenticated(state, { currentUser: state.session.user })
    ).to.equal(true);
  });

  it('returns current user', function() {
    const user = {
      id: '43',
      name: 'Dummy User'
    };
    const state = {
      session: {
        isLoading: false,
        token: 'ttookkeenn',
        user
      }
    };

    expect(getters.currentUser(state)).to.equal(user);
  });
});
