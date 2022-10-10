import { map } from 'lodash';
import filtersFactory from '@/components/filters/models/filter.factory';

export class FilterSet {
  constructor({ id, name, configuration, isDefault, isPublic, domain, owner }) {
    this.id = id;
    this.name = name;
    this.configuration = configuration;
    this.default = isDefault;
    this.public = isPublic;
    this.domain = domain;
    this.owner = owner;
  }

  static deserialize(filterSetDto) {
    return new FilterSet({
      ...filterSetDto,
      isDefault: filterSetDto.default,
      isPublic: filterSetDto.public,
      configuration: {
        filters: map(filterSetDto.configuration.filters, filtersFactory)
      }
    });
  }
}
