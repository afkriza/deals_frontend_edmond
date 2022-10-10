import { unitsTableHeaderTypes } from 'enums/units-table-header-types';

export function createHeaderItems(propertyLabels) {
  return [
    ...propertyLabels.map(label => ({
      type: unitsTableHeaderTypes.LABEL.id,
      label
    }))
  ];
}
