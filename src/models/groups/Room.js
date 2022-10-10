import { packageByPackageId, roomRepresentationByRoomId } from 'enums/rooms';
import { map, size } from 'lodash';

export default class Room {
  constructor({ type, quantity, price, packages }) {
    this.type = type;
    this.quantity = quantity;
    this.price = price;
    this.packages = packages || [];
  }

  get name() {
    return roomRepresentationByRoomId[this.type];
  }

  static from(room = {}) {
    return new Room(room);
  }

  static deserialize({ type, quantity, price, packages }) {
    return Room.from({ type, quantity, price, packages });
  }

  static format({ quantity, name, packages }) {
    let room = `${quantity} ${name}`;

    if (size(packages)) {
      room += ` (${map(packages, p => packageByPackageId[p]).join(', ')})`;
    }

    return room;
  }
}
