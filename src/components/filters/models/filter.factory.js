import { DateRangeFilter } from './DateRangeFilter.model.js';
import { MultiSelectFilter } from './MultiSelectFilter.model.js';
import { ApiMultiSelectFilter } from './ApiMultiSelectFilter.model.js';
import { SelectFilter } from './SelectFilter.model';

const filterCtorByType = {
  'date-range': DateRangeFilter,
  'multi-select': MultiSelectFilter,
  'api-multi-select': ApiMultiSelectFilter,
  select: SelectFilter
};

export default function(filterDto) {
  const FilterClass = filterCtorByType[filterDto.type];

  if (!FilterClass) {
    throw new Error(`Unknown filter type: ${filterDto.type}`);
  }

  return FilterClass.deserialize(filterDto);
}
