import Category from './Category';

export default class CategoryInstance extends Category {
  constructor({
    id,
    name,
    timeGranulation = [],
    granulation = 'month',
    sort = 'asc'
  }) {
    super({ id, name, timeGranulation });

    this.sort = sort;

    if (this.hasTimeGranulation) {
      this.granulation = granulation;
    }
  }

  get hasTimeGranulation() {
    return Boolean(this.timeGranulation.length);
  }

  static from(category) {
    return new CategoryInstance(category);
  }

  static adaptKeys({ id, granulation, sort }) {
    return {
      name: id,
      granulation,
      sort
    };
  }

  setGranulation(granulation) {
    this.granulation = granulation;
  }
}
