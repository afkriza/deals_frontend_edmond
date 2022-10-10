/* eslint-disable new-cap */
import { expect } from 'chai';

import * as mutationTypes from 'store/mutation-types';
import mutations from 'store/modules/history/mutations';

describe('History/mutations', function() {
  let state;

  it(mutationTypes.HISTORY_REQUEST, function() {
    state = {
      history: {
        isLoading: false
      }
    };

    mutations.HISTORY_REQUEST(state, true);

    expect(state.history.isLoading).to.equal(true);
  });

  it(mutationTypes.HISTORY_SUCCESS, function() {
    state = {
      history: {
        isLoading: true,
        data: []
      }
    };

    const data = [{ action: 'open' }];
    const links = { next: 'http://www.example.com' };
    mutations.HISTORY_SUCCESS(state, { data, links });

    expect(state.history.isLoading).to.equal(false);
    expect(state.history.isLoaded).to.equal(true);
    expect(state.history.data[0].action).to.equal(data[0].action);
  });

  it(mutationTypes.HISTORY_FAILURE, function() {
    state = {
      history: {
        isLoading: true,
        data: []
      }
    };

    mutations.HISTORY_FAILURE(state);

    expect(state.history.isLoading).to.equal(false);
  });

  it(mutationTypes.HISTORY_RESET, function() {
    state = {
      history: {
        isLoading: true,
        data: []
      }
    };

    mutations.HISTORY_RESET(state);

    expect(state.history.data).to.be.empty;
  });
});

/* eslint-enable new-cap */
