import { generateRandomHex } from '@/utils/string';
import { cloneDeep, isEqual, omit, map, find } from 'lodash';

export default class GroupAlternativeItemEntry {
  constructor({ id, roomType, quantity, packages }) {
    this.id = id || generateRandomHex();

    this.roomType = roomType;
    this.quantity = quantity;
    this.packages = packages;
  }

  duplicate() {
    const clone = cloneDeep(this);

    return new GroupAlternativeItemEntry({ ...clone, id: null });
  }

  update({ roomType, quantity, packages }) {
    this.roomType = roomType;
    this.quantity = quantity;
    this.packages = packages;
  }

  equals(otherEntry) {
    if (!otherEntry) {
      return false;
    }
    return isEqual(omit(this, 'id'), omit(otherEntry, 'id'));
  }

  serialize() {
    return {
      roomType: this.roomType.id,
      quantity: this.quantity,
      packages: map(this.packages, 'id')
    };
  }

  static deserialize({ id, roomType, quantity, packages }, configuration) {
    packages = map(packages, pkg => find(configuration.packages, ['id', pkg]));
    roomType = find(configuration.roomTypes, ['id', roomType]);

    return new GroupAlternativeItemEntry({
      id,
      roomType,
      quantity,
      packages
    });
  }

  static default({ roomType, packages }) {
    return new GroupAlternativeItemEntry({
      roomType: roomType,
      quantity: 1,
      packages: packages
    });
  }
}
