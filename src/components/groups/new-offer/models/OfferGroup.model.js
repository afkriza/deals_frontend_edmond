import { cloneDeep, map, uniqueId, without } from 'lodash';
import DateRange from '@/components/groups/new-inquiry/models/DateRange.model';
import OfferGroupUnit from '@/components/groups/new-offer/models/OfferGroupUnit.model';

export default class OfferGroup {
  constructor({ id, dateRange, offerGroupUnits }) {
    this.id = id || uniqueId();
    this.dateRange = dateRange;
    this.units = offerGroupUnits;
  }

  addUnit(unit) {
    this.units.push(unit);
  }

  removeUnit(unit) {
    this.units = without(this.units, unit);
  }

  duplicate() {
    return new OfferGroup({
      dateRange: cloneDeep(this.dateRange),
      offerGroupUnits: map(this.units, unit => unit.duplicate()),
      saved: true
    });
  }

  serialize() {
    return {
      dateRange: this.dateRange.serialize(),
      offerGroupUnits: map(this.units, unit => unit.serialize())
    };
  }

  static deserialize({ id, dateRange, offerGroupUnits }, configuration) {
    return new OfferGroup({
      id,
      dateRange: DateRange.deserialize(dateRange),
      offerGroupUnits: map(offerGroupUnits, unit =>
        OfferGroupUnit.deserialize(unit, configuration)
      )
    });
  }
}
