import Category from 'components/analytics/models/Category';
import instantiate from 'components/analytics/models/instantiate';

export const valuesCategory = Object.freeze(
  instantiate(
    Category.from({
      id: 'values',
      name: 'Values'
    })
  )
);
