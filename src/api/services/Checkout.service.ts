import httpClient from '@/api/http-client';

import serialize from '@/api/json-api/serializer';

const RATES_CHECKOUT_ENDPOINT = 'rates/checkout';
const INVENTORIES_CHECKOUT_ENDPOINT = 'inventories/checkout';
const UNIT_TYPES_ENDPOINT = 'unit-types';

export const sendRatesCheckout = units => {
  const remappedRates = units.map(unit => {
    return {
      propertyId: unit.property.id,
      unitTypeId: unit.unitType.id,
      channelId: unit.channel.id,
      priceLevel: unit.newPriceLevel,
      stopSignal: unit.newStopSignal,
      bookingDate: unit.bookingDate,
      stopSignalMode: unit.newStopSignalMode,
      priceLevelMode: unit.newPriceLevelMode
    };
  });

  const payload = serialize(remappedRates, {
    attributes: [
      'propertyId',
      'unitTypeId',
      'channelId',
      'priceLevel',
      'stopSignal',
      'bookingDate',
      'stopSignalMode',
      'priceLevelMode'
    ]
  });

  return httpClient.post(RATES_CHECKOUT_ENDPOINT, payload);
};

export const sendInventoriesCheckout = units => {
  const remappedUnits = units.map(unit => {
    return {
      propertyId: unit.property.id,
      unitTypeId: unit.unitType.id,
      channelId: unit.channel.id,
      noOfPlacedUnits: unit.newNoOfPlacedUnits,
      stopSignal: unit.newStopSignal,
      bookingDate: unit.bookingDate,
      stopSignalMode: unit.newStopSignalMode,
      placedUnitsMode: unit.newPlacedUnitsMode
    };
  });

  const payload = serialize(remappedUnits, {
    attributes: [
      'propertyId',
      'unitTypeId',
      'channelId',
      'noOfPlacedUnits',
      'stopSignal',
      'bookingDate',
      'stopSignalMode',
      'placedUnitsMode'
    ]
  });

  return httpClient.post(INVENTORIES_CHECKOUT_ENDPOINT, payload);
};

export const fetchRatesCheckoutActivity = filter =>
  httpClient.get(RATES_CHECKOUT_ENDPOINT, {
    params: {
      filter
    }
  });

export const fetchInventoriesCheckoutActivity = filter =>
  httpClient.get(INVENTORIES_CHECKOUT_ENDPOINT, {
    params: {
      filter
    }
  });

export const fetchAllUnitTypesForProperty = (propertyId: string) =>
  httpClient.get(UNIT_TYPES_ENDPOINT, {
    params: {
      filter: {
        property: propertyId
      }
    }
  });
