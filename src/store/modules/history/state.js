import { initState } from 'utils/store';

const history = initState();

history.uniqueRequestGuids = 0;
history.isFullyLoaded = false;
history.activeTabID = '';

export default {
  history
};
