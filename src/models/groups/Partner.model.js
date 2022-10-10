import { forEach, map, pick, size, uniqueId, without } from 'lodash';
import { PartnerContact } from '@/models/groups/PartnerContact.model';

export class Partner {
  constructor({
    id,
    name,
    address,
    postcode,
    city,
    country,
    partnerIdentifier,
    partnerContacts,
    createdAt
  }) {
    this.id = id || uniqueId();
    this.name = name;
    this.address = address;
    this.postcode = postcode;
    this.city = city;
    this.country = country;
    this.partnerIdentifier = partnerIdentifier;
    this.partnerContacts = partnerContacts;
    this.createdAt = createdAt;
  }

  get size() {
    return size(this.partnerContacts);
  }

  addContact() {
    this.partnerContacts.push(PartnerContact.default());
  }

  removeContact(contact) {
    this.partnerContacts = without(this.partnerContacts, contact);

    // If removing primary contact, new primary contact becomes a first contact in the contacts list
    if (contact.primary) {
      this.setPrimaryContact(this.partnerContacts[0]);
    }
  }

  setPrimaryContact(contact) {
    forEach(this.partnerContacts, c => {
      c.primary = false;
    });

    contact.primary = true;
  }

  duplicate() {
    return new Partner({
      ...this,
      partnerContacts: map(this.partnerContacts, partnerContact =>
        partnerContact.duplicate()
      )
    });
  }

  serialize() {
    return {
      ...pick(this, [
        'name',
        'address',
        'postcode',
        'city',
        'country',
        'partnerIdentifier'
      ]),
      partnerContactsAttributes: map(this.partnerContacts, contact =>
        contact.serialize()
      )
    };
  }

  static deserialize(partnerDto) {
    return new Partner({
      ...partnerDto,
      partnerContacts: map(
        partnerDto.partnerContacts,
        PartnerContact.deserialize
      )
    });
  }

  static default() {
    return new Partner({
      name: '',
      address: '',
      postcode: '',
      city: '',
      country: '',
      partnerIdentifier: '',
      partnerContacts: [PartnerContact.default(true)]
    });
  }
}
