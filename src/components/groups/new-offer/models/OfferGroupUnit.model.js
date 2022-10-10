import { isEqual, pick, uniqueId, find } from 'lodash';

export default class OfferGroupUnit {
  constructor({ id, unitType, quantity, service, price }) {
    this.id = id || uniqueId();
    this.unitType = unitType;
    this.quantity = quantity;
    this.service = service;
    this.price = price;
  }

  duplicate() {
    return new OfferGroupUnit({
      ...this,
      id: null
    });
  }

  equals(otherUnit) {
    if (!otherUnit) {
      return false;
    }
    const attrs = ['unitType', 'quantity', 'service', 'price'];

    return isEqual(pick(this, ...attrs), pick(otherUnit, ...attrs));
  }

  serialize() {
    return {
      roomType: this.unitType.id,
      quantity: this.quantity,
      package: this.service.id,
      price: this.price
    };
  }

  static deserialize(
    { id, roomType: unitType, quantity, package: service, price },
    configuration
  ) {
    return new OfferGroupUnit({
      id,
      unitType: find(configuration.roomTypes, ['id', unitType]),
      quantity,
      service: find(configuration.packages, ['id', service]),
      price
    });
  }
}
