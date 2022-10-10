import Filter from './Filter';

export default class MeasureFilter extends Filter {
  constructor({
    numerator,
    denominator,
    denominatorOptions,
    numeratorOptions,
    ...filter
  }) {
    super(filter);
    this.numerator = numerator;
    this.numeratorOptions = numeratorOptions;
    this.denominator = denominator;
    this.denominatorOptions = denominatorOptions;

    if (!this.numerator || !this.denominator) {
      this.setDefaults();
    }
  }

  get component() {
    return 'PinnedMeasureFilter';
  }

  get value() {
    return {
      numerator_option: this.numerator.id,
      denominator_option: this.denominator.id
    };
  }

  setDefaults() {
    const { numeratorOption, denominatorOption } = this.defaultValue;

    this.numerator = this.numeratorOptions.find(
      ({ id }) => id === numeratorOption
    );
    this.denominator = this.denominatorOptions.find(
      ({ id }) => id === denominatorOption
    );
  }
}
