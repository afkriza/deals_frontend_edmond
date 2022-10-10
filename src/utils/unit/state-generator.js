import unitScopes from 'enums/unit-scopes';
import channels from 'enums/channels';

import { initState } from 'utils/store';
import { prop } from 'utils/function';

export default function(moduleName) {
  return {
    [moduleName]: initState(),
    storage: {
      isLoading: false,
      hasData: false
    },
    activeFilterTabID: '',
    visibleChannels: channels.map(prop('id')),
    unitScope: unitScopes.ALL,
    unitTypeByRanking: []
  };
}
