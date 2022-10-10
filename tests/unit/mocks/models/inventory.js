import { defaultsDeep, uniqueId } from 'lodash';

import Inventory from 'models/Inventory';
import { channels } from 'enums/channels';

function getDefaultRateData() {
  const id = uniqueId();
  return {
    id,
    _id: id,
    _rev: uniqueId(),
    bookingDate: '2017-01-01',
    numberOfPlacedUnits: 125,
    currentNumberOfPlacedUnits: 120,
    placedUnitsMode: 'manual',
    stopSignal: false,
    currentStopSignal: false,
    property: {
      id: uniqueId(),
      name: 'Hotel Infinum'
    },
    unitType: {
      id: uniqueId(),
      name: 'AZ42'
    },
    channel: {
      id: channels.B2B.id,
      name: 'Bussiness'
    }
  };
}

export default function(data = {}) {
  const params = defaultsDeep(data, getDefaultRateData());
  return new Inventory(params);
}
