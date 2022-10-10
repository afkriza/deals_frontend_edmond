export default class Filter {
  constructor({
    id,
    name,
    type,
    prefix,
    required,
    placeholder,
    pinned,
    defaultValue,
    options
  }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.prefix = prefix;
    this.required = required;
    this.placeholder = placeholder;
    this.pinned = pinned;
    this.defaultValue = defaultValue;
    this.options = options;
  }
}
