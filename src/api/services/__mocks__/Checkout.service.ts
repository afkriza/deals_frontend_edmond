export const sendRatesCheckout = () =>
  Promise.resolve({
    data: [
      {
        id: 1
      }
    ]
  });

export const sendInventoriesCheckout = () =>
  Promise.resolve({
    data: [
      {
        id: 1
      }
    ]
  });

export const fetchRatesCheckoutActivity = () =>
  Promise.resolve({
    data: [
      {
        id: 1,
        type: 'activity_logs',
        bookingDate: '2017-06-13',
        stopSignal: false,
        updatedAt: '2017-06-12T09:18:32.327Z',
        priceLevel: 100,
        priceAmount: '300.0',
        property: {
          id: 321
        },
        channel: {
          id: 412
        },
        aggregateRoomType: {
          id: 214
        }
      }
    ]
  });

export const fetchInventoriesCheckoutActivity = () =>
  Promise.resolve({
    data: [
      {
        id: 1,
        type: 'activity_logs',
        bookingDate: '2017-06-13',
        stopSignal: false,
        updatedAt: '2017-06-12T09:18:32.327Z',
        noOfPlacedUnits: 50,
        property: {
          id: 321
        },
        channel: {
          id: 412
        },
        aggregateRoomType: {
          id: 214
        }
      }
    ]
  });
