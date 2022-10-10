import testAction from 'helpers/action';
import * as actions from 'store/modules/history/actions';
import * as mutationTypes from 'store/mutation-types';

jest.mock('api/services/ActivityLogs.service');

describe('Actions/history', function () {
  const getters = {
    filtersQuery: {}
  };

  it('fetches history', function () {
    return testAction(actions.fetchHistory, {
      state: {
        history: {
          isLoading: false,
          isLoaded: false,
          data: []
        }
      },
      getters,
      expectedMutations: [
        {
          type: mutationTypes.HISTORY_REQUEST
        },
        {
          type: mutationTypes.HISTORY_SUCCESS
        }
      ]
    });
  });
});
