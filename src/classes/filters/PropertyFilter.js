import Filter from './Filter';

export default class PropertyFilter extends Filter {
  constructor({ property, ...filter }) {
    super(filter);
    this.property = property;

    this.setDefaults();
  }

  get component() {
    return 'PinnedPropertyFilter';
  }

  get value() {
    return {
      property: this.property.id
    };
  }

  setDefaults() {
    const defaultPropertyId = this.defaultValue.toString();

    this.property = this.options.find(({ id }) => id === defaultPropertyId);
  }
}
