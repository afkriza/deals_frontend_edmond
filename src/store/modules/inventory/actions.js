import Inventory from 'models/Inventory';
import unitsStorageActionsGenerator from 'utils/unit/storage-actions-generator';
import unitsFetchActionsGenerator from 'utils/unit/fetch-actions-generator';
import { fetchInventories } from 'api/services/Inventories.service';

const MODULE_PREFIX = 'INVENTORY';

export default function ({ databases }) {
  return {
    ...unitsFetchActionsGenerator({ databases }, MODULE_PREFIX, {
      databaseName: 'inventory',
      UnitModel: Inventory,
      checkoutRootGetter: 'checkout/inventory',
      fetchAction: fetchInventories
    }),

    ...unitsStorageActionsGenerator(
      { databases },
      MODULE_PREFIX,
      'inventory',
      Inventory
    )
  };
}
