export default class Category {
  constructor({ id, name, timeGranulation }) {
    this.id = id;
    this.name = name;
    this.timeGranulation = timeGranulation;
  }

  static from(category) {
    return new Category(category);
  }

  static deserialize({ id, name, timeGranulation }) {
    return Category.from({
      id,
      name,
      timeGranulation
    });
  }
}
