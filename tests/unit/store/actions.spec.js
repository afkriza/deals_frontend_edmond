import * as MockLocalStorage from 'mocks/local-storage';
import actionsGenerator from 'store/actions';
import testAction from 'helpers/action';
import * as mutationTypes from 'store/mutation-types';

jest.mock('api/services/Authorization.service');
jest.mock('api/services/Users.service');

describe('Actions', () => {
  let actions;

  beforeEach(function () {
    actions = actionsGenerator({
      localStorage: MockLocalStorage
    });

    MockLocalStorage.setItem('api-token', 'ttookkeenn');
  });

  afterEach(function () {
    MockLocalStorage.removeItem('api-token');
  });

  it('makes successful login', function () {
    return testAction(actions.login, {
      payload: {
        email: 'test@test.com',
        password: 'test'
      },
      state: {
        session: {}
      },
      expectedMutations: [
        {
          type: mutationTypes.SESSION_REQUEST
        },
        {
          type: mutationTypes.SESSION_SUCCESS
        }
      ]
    });
  });

  it('makes unsuccessful login', function () {
    return testAction(actions.login, {
      payload: {
        email: 'test+wrong@test.com',
        password: 'test'
      },
      state: {
        session: {}
      },
      expectedMutations: [
        {
          type: mutationTypes.SESSION_REQUEST
        },
        {
          type: mutationTypes.SESSION_FAILURE
        }
      ]
    });
  });

  it('makes successful session check', function () {
    return testAction(actions.checkSession, {
      state: {
        session: {}
      },
      expectedMutations: [
        {
          type: mutationTypes.SESSION_REQUEST
        },
        {
          type: mutationTypes.SESSION_SUCCESS
        }
      ]
    });
  });

  it('makes unsuccessful session check', function () {
    MockLocalStorage.setItem('api-token', 'wrong');
    return testAction(actions.checkSession, {
      state: {
        session: {}
      },
      expectedMutations: [
        {
          type: mutationTypes.SESSION_REQUEST
        },
        {
          type: mutationTypes.SESSION_FAILURE
        }
      ]
    });
  });

  it('makes logout', function () {
    return testAction(actions.logout, {
      state: {
        session: {
          user: {
            id: '67',
            name: 'Dummy User'
          }
        }
      },
      expectedMutations: [
        {
          type: mutationTypes.SESSION_DESTROY
        }
      ]
    });
  });

  it('updates current user', function () {
    return testAction(actions.updateCurrentUser, {
      state: {
        session: {
          user: {
            firstName: 'Infinum',
            lastName: 'Test',
            id: '67',
            email: 'test@example.com',
            password: 'something'
          }
        }
      },
      payload: {
        firstName: 'NewInfinum',
        lastName: 'NewTest',
        id: 67,
        email: 'test@example.com',
        password: 'something'
      },
      expectedMutations: [
        {
          type: mutationTypes.USER_UPDATE_REQUEST
        },
        {
          type: mutationTypes.USER_UPDATE_SUCCESS
        }
      ]
    });
  });
});
