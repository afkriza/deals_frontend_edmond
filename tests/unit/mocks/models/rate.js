import { defaultsDeep, uniqueId } from 'lodash';

import Rate from 'models/Rate';
import { channels } from 'enums/channels';

function getDefaultRateData() {
  const id = uniqueId();
  return {
    id,
    _id: id,
    _rev: uniqueId(),
    bookingDate: '2017-01-01',
    priceLevel: 100,
    currentPriceLevel: 120,
    priceAmount: 110,
    currentPriceAmount: 130,
    priceLevelMode: 'manual',
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
  return new Rate(params);
}
