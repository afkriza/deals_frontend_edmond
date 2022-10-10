export class Filter {
  constructor({
    id,
    type,
    name,
    prefix,
    required,
    placeholder,
    pinned,
    defaultValue,
    searchApiUrl
  }) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.prefix = prefix;
    this.required = required;
    this.placeholder = placeholder;
    this.pinned = pinned;
    this.defaultValue = defaultValue;
    this.searchApiUrl = searchApiUrl;

    this.value = null;
  }

  get clearable() {
    return false;
  }

  togglePin() {
    this.pinned = !this.pinned;
  }
}
