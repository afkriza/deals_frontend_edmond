import { find, get, isEqual, isNumber, map } from 'lodash';

import { Filter } from './Filter.model';

const appendOptionCount = option => ({
  ...option,
  name: isNumber(option.count)
    ? `${option.name} (${option.count})`
    : option.name
});

export class SelectFilter extends Filter {
  constructor({ options, value, ...filter }) {
    super(filter);
    this.options = options;
    this.value = value;

    if (!this.value && this.defaultValue) {
      this.value = find(this.options, ['id', this.defaultValue]);
    }
  }

  get clearable() {
    return !this.defaultValue;
  }

  get reload() {
    return true;
  }

  get query() {
    return {
      [this.id]: get(this.value, 'id')
    };
  }

  get pinnedLabel() {
    return this.name;
  }

  get pinnedValueLabel() {
    return this.value ? this.value.name : 'None';
  }

  get component() {
    return 'SelectFilter';
  }

  select(option) {
    this.value = option;
  }

  clear() {
    this.value = null;
  }

  copy() {
    return new SelectFilter({
      ...this
    });
  }

  equals(otherFilter) {
    if (!otherFilter || !(otherFilter instanceof SelectFilter)) {
      return false;
    }

    if (otherFilter === this) {
      return true;
    }

    return isEqual(this.value, otherFilter.value);
  }

  merge(newFilter) {
    if (this.value) {
      this.value = find(newFilter.options, ['id', this.value.id]);
    }
    this.options = newFilter.options;
  }

  static deserialize(filterDto) {
    return new SelectFilter({
      ...filterDto,
      options: map(filterDto.options, appendOptionCount)
    });
  }
}
