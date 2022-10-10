import { map, without } from 'lodash';
import { parseISO } from 'date-fns';
import { DateRange } from '@/models/groups/DateRange.model';
import { formatISODate } from '@/utils/date';
import { FinalOfferGroupUnit } from '@/models/groups/FinalOfferGroupUnit.model';

export class FinalOfferGroup {
  id: string;
  dateRange: DateRange;
  units: FinalOfferGroupUnit[];

  constructor({ id, dateRange, units }: Partial<FinalOfferGroup>) {
    this.id = id;
    this.dateRange = dateRange;
    this.units = units;
  }

  addUnit(unit: FinalOfferGroupUnit) {
    this.units.push(unit);
  }

  removeUnit(unit: FinalOfferGroupUnit) {
    this.units = without(this.units, unit);
  }

  serialize() {
    return {
      id: this.id,
      dateRange: {
        from: formatISODate(this.dateRange.from),
        to: formatISODate(this.dateRange.to)
      },
      offerGroupUnits: map(this.units, unit => unit.serialize())
    };
  }

  static deserialize({ id, dateRange, finalOfferGroupUnits }, configuration) {
    return new FinalOfferGroup({
      id,
      dateRange: { from: parseISO(dateRange.from), to: parseISO(dateRange.to) },
      units: map(finalOfferGroupUnits, unit =>
        FinalOfferGroupUnit.deserialize(unit, configuration)
      )
    });
  }
}
