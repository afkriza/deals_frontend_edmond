import unitFilterMutationGenerator from 'utils/unit/filter-mutation-generator';
import unitStorageMutationGenerator from 'utils/unit/storage-mutation-generator';
import unitMutationGenerator from 'utils/unit/unit-mutation-generator';

import Rate from 'models/Rate';

const MODULE_PREFIX = 'RATES';

export default {
  ...unitMutationGenerator(MODULE_PREFIX, 'rates'),
  ...unitFilterMutationGenerator(MODULE_PREFIX),
  ...unitStorageMutationGenerator(MODULE_PREFIX, 'rates', Rate)
};
