export const fetchRatesHistory = () =>
  Promise.resolve({
    data: [
      {
        type: 'RATE'
      }
    ]
  });

export const fetchInventoriesHistory = () =>
  Promise.resolve({
    data: [
      {
        type: 'INVENTORY'
      }
    ]
  });
