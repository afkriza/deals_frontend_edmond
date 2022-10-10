import Rate from 'models/Rate';
import unitsStorageActionsGenerator from 'utils/unit/storage-actions-generator';
import unitsFetchActionsGenerator from 'utils/unit/fetch-actions-generator';
import { fetchRates } from 'api/services/Rates.service';

const MODULE_PREFIX = 'RATES';

export default function ({ databases }) {
  return {
    ...unitsFetchActionsGenerator({ databases }, MODULE_PREFIX, {
      databaseName: 'rates',
      UnitModel: Rate,
      checkoutRootGetter: 'checkout/rates',
      fetchAction: fetchRates
    }),
    ...unitsStorageActionsGenerator({ databases }, MODULE_PREFIX, 'rates', Rate)
  };
}
