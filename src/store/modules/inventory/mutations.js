import unitFilterMutationGenerator from 'utils/unit/filter-mutation-generator';
import unitStorageMutationGenerator from 'utils/unit/storage-mutation-generator';
import unitMutationGenerator from 'utils/unit/unit-mutation-generator';

import Inventory from 'models/Inventory';

const MODULE_PREFIX = 'INVENTORY';

export default {
  ...unitMutationGenerator(MODULE_PREFIX, 'inventory'),
  ...unitFilterMutationGenerator(MODULE_PREFIX),
  ...unitStorageMutationGenerator(MODULE_PREFIX, 'inventory', Inventory)
};
