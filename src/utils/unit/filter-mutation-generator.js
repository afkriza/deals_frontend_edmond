import * as mutationTypes from 'store/mutation-types';

export default function(prefix) {
  return {
    [mutationTypes[`${prefix}_VISIBLE_CHANNELS_UPDATE`]](
      state,
      visibleChannels
    ) {
      if (visibleChannels.value) {
        state.visibleChannels.push(visibleChannels.channelID);
      } else {
        const channelIndex = state.visibleChannels.indexOf(
          visibleChannels.channelID
        );
        state.visibleChannels.splice(channelIndex, 1);
      }
    },

    [mutationTypes[`${prefix}_UNIT_SCOPE_UPDATE`]](state, unitScope) {
      state.unitScope = unitScope;
    },

    [mutationTypes[`${prefix}_FILTER_TAB_CHANGE`]](state, filterTabID) {
      state.activeFilterTabID = filterTabID;
    }
  };
}
