import * as mutationTypes from 'store/mutation-types';
import { uniqBy } from 'lodash';

const UNIQUE_GUID_THRESHOLD = 25;

export default {
  [mutationTypes.HISTORY_REQUEST](state, withReset) {
    if (withReset) {
      state.history.isLoading = true;
    } else {
      state.history.isLazyLoading = true;
    }
  },

  [mutationTypes.HISTORY_SUCCESS](state, { data }) {
    state.history.isLoaded = true;
    state.history.isLoading = false;
    state.history.isLazyLoading = false;
    state.history.uniqueRequestGuids = uniqBy(data, 'requestGuid').length;
    state.history.data.push(...data);
    if (state.history.uniqueRequestGuids < UNIQUE_GUID_THRESHOLD) {
      state.history.isFullyLoaded = true;
    }
  },

  [mutationTypes.HISTORY_FAILURE](state) {
    state.history.isLoading = false;
    state.history.isLazyLoading = false;
  },

  [mutationTypes.HISTORY_RESET](state) {
    state.history.data = [];
    state.history.uniqueRequestGuids = 0;
    state.history.isFullyLoaded = false;
  },

  [mutationTypes.HISTORY_ACTIVE_TAB_UPDATE](state, newTabID) {
    state.history.activeTabID = newTabID;
  }
};
