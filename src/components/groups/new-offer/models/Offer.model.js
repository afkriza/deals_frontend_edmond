import {
  uniqueId,
  map,
  last,
  forEach,
  first,
  without,
  size,
  camelCase
} from 'lodash';
import OfferGroup from '@/components/groups/new-offer/models/OfferGroup.model';
import OfferGroupUnit from '@/components/groups/new-offer/models/OfferGroupUnit.model';
import { parseISO } from 'date-fns';
import DateRange from '@/components/groups/new-inquiry/models/DateRange.model';
import { formatDateRange } from '@/components/groups/shared/utils';

export default class Offer {
  constructor({ id, dealId, property, groups, numberOfFinalOffers, status }) {
    this.id = id || uniqueId();
    this.dealId = dealId;
    this.property = property;
    this.groups = groups;
    this.numberOfFinalOffers = numberOfFinalOffers;
    this.status = status;
  }

  get title() {
    const [firstGroup, lastGroup] = [first(this.groups), last(this.groups)];

    return `${this.property.name}, ${formatDateRange(
      firstGroup.dateRange.from,
      lastGroup.dateRange.to
    )}`;
  }

  addGroup(group) {
    this.groups.push(group);

    return group;
  }

  duplicateGroup(group) {
    const duplicatedGroup = group.duplicate();

    return this.addGroup(duplicatedGroup);
  }

  deleteGroup(group) {
    this.groups = without(this.groups, group);
  }

  serialize() {
    return {
      dealId: this.dealId,
      propertyId: this.property.id,
      offerGroups: map(this.groups, group => group.serialize())
    };
  }

  duplicate() {
    return new Offer({
      dealId: this.dealId,
      property: this.property,
      groups: map(this.groups, group => group.duplicate())
    });
  }

  static deserialize(
    { id, property, offerGroups, finalOffers, status },
    configuration
  ) {
    return new Offer({
      id,
      property,
      groups: map(offerGroups, group =>
        OfferGroup.deserialize(group, configuration)
      ),
      numberOfFinalOffers: size(finalOffers),
      status: camelCase(status)
    });
  }

  static from(dealId, deal, configuration) {
    const groups = [];

    forEach(deal.groups, group => {
      const [mainAlternative] = group.groupAlternatives;

      let previous = null;
      forEach(mainAlternative.groupAlternativeItems, item => {
        if (!previous) {
          groups.push([item]);
        } else {
          if (item.equals(previous)) {
            last(groups).push(item);
          } else {
            groups.push([item]);
          }
        }

        previous = item;
      });
    });

    return new Offer({
      dealId,
      property:
        deal.groups[0].groupAlternatives[0].properties[0] ||
        first(configuration.properties),
      groups: map(groups, group => {
        const f = first(group);
        const l = last(group);

        const dateRange = new DateRange({
          from: parseISO(f.bookingDate),
          to: parseISO(l.bookingDate)
        });

        const offerGroupUnits = map(
          f.entries,
          entry =>
            new OfferGroupUnit({
              unitType: entry.roomType,
              quantity: entry.quantity,
              service: entry.packages[0] || first(configuration.packages),
              price: null
            })
        );

        return new OfferGroup({
          dateRange,
          offerGroupUnits
        });
      })
    });
  }
}
