let token;

export function setToken(newToken) {
  token = newToken;
}

export function login({ email, password }) {
  return new Promise((resolve, reject) => {
    if (email === 'test@test.com' && password === 'test') {
      resolve({
        user: {
          id: 1
        },
        token: 'ttookkeenn'
      });
    } else {
      reject({});
    }
  });
}

export function currentUser() {
  return new Promise((resolve, reject) => {
    if (token === 'ttookkeenn') {
      resolve({
        id: 1,
        name: 'Dummy user'
      });
    } else {
      reject();
    }
  });
}

export function fetchBookingPlans() {
  return Promise.resolve([
    {
      id: 'asdasd',
      type: 'bookingPlans',
      roomPlan: 50,
      revenuePlan: 150,
      pricePlan: 250
    }
  ]);
}

export function fetchBookingFulfillments() {
  return Promise.resolve([
    {
      id: 'asdasd',
      type: 'bookingFulfillments',
      roomFulfillment: 50,
      revenueFulfillment: 150,
      priceFulfillment: 250
    }
  ]);
}

export function fetchBookingSnapshots() {
  return Promise.resolve([
    {
      id: 'ndfsdg',
      type: 'bookingDateWithSnapshots',
      bookingDate: '2017-03-03'
    }
  ]);
}

export function fetchRates() {
  return Promise.resolve([
    {
      id: '123',
      type: 'rate'
    }
  ]);
}

export function fetchRatesFilters() {
  return Promise.resolve({
    data: [
      {
        id: 'booking-date-range'
      }
    ]
  });
}

export function fetchForecasts() {
  return Promise.resolve([
    {
      data: [
        {
          id: 'forecasts'
        }
      ]
    }
  ]);
}

export function fetchInventory() {
  return Promise.resolve([
    {
      id: '312',
      type: 'inventories'
    }
  ]);
}

export function fetchInventoryFilters() {
  return Promise.resolve({
    data: [
      {
        id: 'booking-date-range'
      }
    ]
  });
}

export function sendRatesCheckout() {
  return Promise.resolve({
    data: [
      {
        id: 1
      }
    ]
  });
}

export function sendInventoryCheckout() {
  return Promise.resolve({
    data: [
      {
        id: 1
      }
    ]
  });
}

export function fetchRatesCheckoutActivity() {
  return Promise.resolve({
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
}

export function fetchInventoryCheckoutActivity() {
  return Promise.resolve({
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
}

export function fetchHistoryFilters() {
  return Promise.resolve({
    data: [
      {
        id: 'booking-date-range'
      }
    ]
  });
}

export function fetchRateHistory() {
  return Promise.resolve({
    data: [
      {
        type: 'RATE'
      }
    ]
  });
}

export function fetchInventoryHistory() {
  return Promise.resolve({
    data: [
      {
        type: 'RATE'
      }
    ]
  });
}

export function fetchMemberFilters() {
  return Promise.resolve({
    data: [
      {
        id: 33
      }
    ]
  });
}

export function fetchAllMembers() {
  return Promise.resolve({
    data: [
      {
        id: 1101
      }
    ]
  });
}

export function fetchAllProperties() {
  return Promise.resolve({
    data: [
      {
        id: 33
      }
    ]
  });
}

export function fetchDashboards() {
  return Promise.resolve({
    data: [
      {
        name: 'Novi dashboard'
      }
    ]
  });
}

export function fetchAnalyticsFilters() {
  return Promise.resolve({
    data: [
      {
        id: 'booking-date-range',
        type: 'filters-dashboard-booking_date_ranges'
      }
    ]
  });
}

export function fetchDashboard() {
  return Promise.resolve({
    data: [
      {
        id: 11
      }
    ]
  });
}

export function deleteDashboard() {
  return Promise.resolve({
    data: [
      {
        id: 11
      }
    ]
  });
}

export function editDashboard() {
  return Promise.resolve({
    data: [
      {
        id: 11
      }
    ]
  });
}

export function fetchWidget() {
  return Promise.resolve({
    data: [
      {
        id: 11
      }
    ]
  });
}

export function createWidget() {
  return Promise.resolve({
    data: [
      {
        id: 11
      }
    ]
  });
}

export function deleteWidget() {
  return Promise.resolve({
    data: {
      id: 1101
    }
  });
}

export function editWidget() {
  return Promise.resolve({
    data: [
      {
        id: 11
      }
    ]
  });
}

export function bulkEditWidgetPlacement() {
  return Promise.resolve({
    data: [
      {
        id: 11
      },
      {
        id: 12
      }
    ]
  });
}

export function fetchCategories() {
  return Promise.resolve({
    data: [
      {
        id: 11
      },
      {
        id: 12
      }
    ]
  });
}

export function setFilterPin() {
  return Promise.resolve({
    data: {
      id: 1101
    }
  });
}

export function updateUser() {
  return Promise.resolve({
    data: {
      id: 1101
    }
  });
}

export function updateSubscriber() {
  return Promise.resolve({
    data: {
      id: 1101
    }
  });
}

export function createUser() {
  return Promise.resolve({
    data: {
      id: 1101
    }
  });
}

export function createSubscriber() {
  return Promise.resolve({
    data: {
      id: 1101
    }
  });
}

export function deleteUser() {
  return Promise.resolve({
    data: {
      id: 1101
    }
  });
}

export function deleteSubscriber() {
  return Promise.resolve({
    data: {
      id: 1101
    }
  });
}

export function setPassword() {
  return Promise.resolve();
}

export function createDashboard() {
  return Promise.resolve({
    data: [
      {
        name: 'Novi dashboard'
      }
    ]
  });
}

export async function fetchWidgetName() {
  return {
    data: {
      id: null,
      type: 'widget_name',
      attributes: {
        name: 'Widget (1)'
      }
    }
  };
}
