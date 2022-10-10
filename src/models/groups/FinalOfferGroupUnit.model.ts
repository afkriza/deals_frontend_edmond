import { find } from 'lodash';

import { RoomType } from '@/models/groups/RoomType.model';
import { Package } from '@/models/groups/Package.model';

export class FinalOfferGroupUnit {
  id: string;
  roomType: RoomType;
  quantity: number;
  package: Package;
  price: number;

  constructor({
    id,
    roomType,
    quantity,
    package: service,
    price
  }: Partial<FinalOfferGroupUnit>) {
    this.id = id;
    this.roomType = roomType;
    this.quantity = quantity;
    this.package = service;
    this.price = price;
  }

  duplicate() {
    return new FinalOfferGroupUnit({
      ...this,
      id: null
    });
  }

  serialize() {
    return {
      id: this.id,
      quantity: this.quantity,
      price: this.price,
      roomType: this.roomType.id,
      package: this.package.id
    };
  }

  static deserialize(finalOfferGroupUnitDto, configuration) {
    return new FinalOfferGroupUnit({
      id: finalOfferGroupUnitDto.id,
      roomType: find(configuration.roomTypes, [
        'id',
        finalOfferGroupUnitDto.roomType
      ]),
      quantity: finalOfferGroupUnitDto.quantity,
      package: find(configuration.packages, [
        'id',
        finalOfferGroupUnitDto.package
      ]),
      price: finalOfferGroupUnitDto.price
    });
  }
}
