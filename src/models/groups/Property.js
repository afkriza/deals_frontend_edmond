export default class Property {
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }

  static from(property = {}) {
    return new Property(property);
  }

  static deserialize({ id, name }) {
    return Property.from({ id, name });
  }
}
