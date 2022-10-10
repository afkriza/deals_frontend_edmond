import { pick } from 'lodash';

export class PartnerContact {
  constructor({ id, firstName, lastName, email, phoneNumber, primary, title }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.primary = primary;
    this.title = title;
  }

  duplicate() {
    return new PartnerContact(this);
  }

  serialize() {
    return pick(this, [
      'id',
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'primary',
      'title'
    ]);
  }

  static deserialize(partnerContactDto) {
    return new PartnerContact(partnerContactDto);
  }

  static default(primary = false) {
    return new PartnerContact({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      primary,
      title: null
    });
  }
}
