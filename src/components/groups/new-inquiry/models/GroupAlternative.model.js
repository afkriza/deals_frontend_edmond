import {
  cloneDeep,
  every,
  forEach,
  head,
  map,
  groupBy,
  keys,
  first
} from 'lodash';

import DateRange from './DateRange.model';
import { generateRandomHex } from '@/utils/string';
import GroupAlternativeItem from '@/components/groups/new-inquiry/models/GroupAlternativeItem.model';

export default class GroupAlternative {
  constructor({ id, dateRange, properties, groupAlternativeItems, saved }) {
    this.id = id || generateRandomHex();

    this.dateRange = new DateRange(dateRange);
    this.properties = properties;
    this.groupAlternativeItems = map(
      groupAlternativeItems,
      item => new GroupAlternativeItem(item)
    );
    this.saved = saved;
  }

  duplicate() {
    return new GroupAlternative({
      dateRange: cloneDeep(this.dateRange),
      properties: cloneDeep(this.properties),
      groupAlternativeItems: map(this.groupAlternativeItems, item =>
        item.duplicate()
      ),
      saved: true
    });
  }

  addAlternativeItem(item) {
    this.groupAlternativeItems.push(new GroupAlternativeItem(item));
  }

  update({ dateRange, properties, groupAlternativeItems }) {
    this.dateRange = dateRange;
    this.properties = properties;
    this.groupAlternativeItems = groupAlternativeItems;
  }

  applyToAllDays(entries) {
    this.groupAlternativeItems = map(
      this.groupAlternativeItems,
      item => new GroupAlternativeItem({ ...item, entries })
    );
  }

  updateAllEntries(entries) {
    forEach(this.groupAlternativeItems, groupAlternativeItem =>
      groupAlternativeItem.updateEntries(entries)
    );
  }

  save() {
    this.saved = true;
  }

  areAllEntriesEqual() {
    const firstGroupAlternativeItem = head(this.groupAlternativeItems);

    return every(this.groupAlternativeItems, groupAlternativeItem =>
      groupAlternativeItem.equals(firstGroupAlternativeItem)
    );
  }

  serialize() {
    return {
      dateRange: this.dateRange.serialize(),
      properties: map(this.properties, 'id'),
      groupAlternativeItems: map(
        this.groupAlternativeItems,
        groupAlternativeItem => groupAlternativeItem.serialize()
      )
    };
  }

  static deserialize(
    { id, properties, dateRange, groupAlternativeItems },
    configuration
  ) {
    const groupAlternativeItemsByBookingDate = groupBy(
      groupAlternativeItems,
      'bookingDate'
    );

    return new GroupAlternative({
      id,
      properties,
      dateRange: DateRange.deserialize(dateRange),
      groupAlternativeItems: map(
        keys(groupAlternativeItemsByBookingDate),
        bookingDate => {
          const groupAlternativeItems =
            groupAlternativeItemsByBookingDate[bookingDate];

          return GroupAlternativeItem.deserialize(
            {
              id: first(groupAlternativeItems).id,
              bookingDate,
              entries: groupAlternativeItems
            },
            configuration
          );
        }
      )
    });
  }

  static default({ roomType, packages }) {
    return new GroupAlternative({
      dateRange: { from: null, to: null },
      properties: [],
      groupAlternativeItems: [
        GroupAlternativeItem.default({ roomType, packages })
      ],
      saved: false
    });
  }
}
