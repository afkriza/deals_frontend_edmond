import testAction from 'helpers/action';
import * as actions from 'store/modules/password/actions';
import * as mutationTypes from 'store/mutation-types';

jest.mock('api/services/Authorization.service');

describe('Actions/password', function () {
  it('sets password', function () {
    return testAction(actions.setPassword, {
      payload: {
        invitationToken: 'tttoken',
        password: '1111'
      },
      state: {
        password: {
          isSaving: false,
          isSaved: false
        }
      },
      expectedMutations: [
        {
          type: mutationTypes.PASSWORD_CREATE
        },
        {
          type: mutationTypes.PASSWORD_CREATE_SUCCESS
        }
      ]
    });
  });
});
