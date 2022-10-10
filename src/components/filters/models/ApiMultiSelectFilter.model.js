import { MultiSelectFilter } from '@/components/filters/models/MultiSelectFilter.model';

export class ApiMultiSelectFilter extends MultiSelectFilter {
  constructor(filter) {
    super(filter);
  }

  get component() {
    return 'ApiMultiSelectFilter';
  }

  copy() {
    return new ApiMultiSelectFilter({ ...this, value: [...this.value] });
  }

  static deserialize(filterDto) {
    return new ApiMultiSelectFilter(filterDto);
  }
}
