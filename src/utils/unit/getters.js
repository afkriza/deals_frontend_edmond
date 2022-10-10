import { uniqBy, countBy, identity, clone } from 'lodash';

import { nameComparator } from 'utils/sort';

export default {
  unitsForChannel(state, getters) {
    return getters.units.filter(unit =>
      state.visibleChannels.includes(unit.channel.id)
    );
  },

  filterTabs(state, getters) {
    const unitsWithSuggestion = getters.unitsForChannel.filter(
      unit => unit.hasSuggestion || unit.isAccepted
    );
    const properties = unitsWithSuggestion.map(({ property }) => property);
    const propertyIDs = properties.map(({ id }) => id);
    const propertyCounts = countBy(propertyIDs, identity);
    return uniqBy(properties, 'id')
      .map(property => {
        const newProperty = clone(property);
        newProperty.quantity = propertyCounts[newProperty.id];
        return newProperty;
      })
      .sort(nameComparator);
  },

  dirtyNotSaved(state, getters) {
    return getters.unitsForChannel.filter(unit => {
      const checkoutUnit = getters.unitsInCheckout.find(
        ({ id }) => id === unit.id
      );
      if (checkoutUnit) {
        return !unit.isEqual(checkoutUnit) && !unit.isAccepted;
      }

      return unit.isDirty && !unit.isAccepted;
    });
  },

  savableUnits(state, getters) {
    return getters.units.filter(unit => {
      const checkoutUnit = getters.unitsInCheckout.find(
        ({ id }) => id === unit.id
      );
      if (checkoutUnit) {
        return !unit.isEqual(checkoutUnit) && unit.isAccepted;
      }
      return unit.isAccepted;
    });
  }
};
