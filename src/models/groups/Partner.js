export default class Partner {
  constructor({ id, name, address, postcode, city, country, phone, email }) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.postcode = postcode;
    this.city = city;
    this.country = country;
    this.phone = phone;
    this.email = email;
  }

  static from(partner = {}) {
    return new Partner(partner);
  }

  static deserialize({
    id,
    name,
    address,
    postcode,
    city,
    country,
    phone,
    email
  }) {
    return Partner.from({
      id,
      name,
      address,
      postcode,
      city,
      country,
      phone,
      email
    });
  }
}
