import {
  filter,
  first,
  groupBy,
  intersectionBy,
  isEqual,
  keyBy,
  map,
  reject,
  size
} from 'lodash';

import { Filter } from './Filter.model';

export class MultiSelectFilter extends Filter {
  constructor({ options, subFilter, value, ...filter }) {
    super(filter);
    this.options = options;
    this.subFilter = subFilter && new MultiSelectFilter(subFilter);
    this.value = value || [];

    if (!value && this.defaultValue) {
      const optionsById = keyBy(this.options, 'id');
      this.value = map(this.defaultValue, id => optionsById[id]);
    }
  }

  get selectedOptionsById() {
    return keyBy(this.value, 'id');
  }

  get subOptionsByOptionId() {
    if (!this.subFilter) {
      return {};
    }

    return groupBy(this.subFilter.options, 'propertyId');
  }

  get availableOptions() {
    return filter(this.options, 'available');
  }

  get reload() {
    return true;
  }

  get query() {
    return {
      [this.id]: map(this.value, 'id'),
      ...(this.subFilter && this.subFilter.query)
    };
  }

  get pinnedLabel() {
    return this.name;
  }

  get pinnedValueLabel() {
    const numberOfSelectedOptions = size(this.value);

    if (!numberOfSelectedOptions) {
      return '';
    }

    if (numberOfSelectedOptions === 1) {
      return first(this.value).name;
    }

    if (numberOfSelectedOptions === size(this.availableOptions)) {
      return 'All';
    }

    return numberOfSelectedOptions.toString();
  }

  get component() {
    return 'MultiSelectFilter';
  }

  deselectAll() {
    this.value = [];

    if (this.subFilter) {
      this.subFilter.deselectAll();
    }
  }

  select(option) {
    if (this.selectedOptionsById[option.id]) {
      return;
    }

    this.value.push(option);
  }

  deselect(option) {
    this.value = reject(this.value, ['id', option.id]);
  }

  clear() {
    this.deselectAll();

    if (this.subFilter) {
      this.subFilter.clear();
    }
  }

  copy() {
    return new MultiSelectFilter({
      ...this,
      subFilter: this.subFilter && this.subFilter.copy(),
      value: [...this.value]
    });
  }

  equals(otherFilter) {
    if (!otherFilter || !(otherFilter instanceof MultiSelectFilter)) {
      return false;
    }

    if (otherFilter === this) {
      return true;
    }

    return (
      isEqual(
        new Set(map(this.value, 'id')),
        new Set(map(otherFilter.value, 'id'))
      ) &&
      (this.subFilter ? this.subFilter.equals(otherFilter.subFilter) : true)
    );
  }

  merge(newFilter) {
    this.options = newFilter.options;

    this.subFilter &&
      newFilter.subFilter &&
      this.subFilter.merge(newFilter.subFilter);
  }

  static deserialize({ subfilter, ...filter }) {
    return new MultiSelectFilter({
      subFilter: subfilter,
      ...filter
    });
  }
}
