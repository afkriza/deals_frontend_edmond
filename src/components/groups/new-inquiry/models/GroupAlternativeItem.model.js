import { cloneDeep, every, map, zip, find } from 'lodash';
import { generateRandomHex } from '@/utils/string';
import GroupAlternativeItemEntry from '@/components/groups/new-inquiry/models/GroupAlternativeItemEntry.model';

export default class GroupAlternativeItem {
  constructor({ id, bookingDate, entries }) {
    this.id = id || generateRandomHex();

    this.bookingDate = bookingDate;
    this.entries = map(entries, entry => new GroupAlternativeItemEntry(entry));
  }

  duplicate() {
    return new GroupAlternativeItem({
      bookingDate: cloneDeep(this.bookingDate),
      entries: map(this.entries, entry => entry.duplicate())
    });
  }

  updateEntries(entries) {
    this.entries = map(
      entries,
      entry => new GroupAlternativeItemEntry({ ...entry, id: null })
    );
  }

  equals(otherItem) {
    return every(
      zip(this.entries, otherItem.entries),
      ([entry, otherEntry]) => {
        if (!(entry && otherEntry)) {
          return false;
        }
        return entry.equals(otherEntry);
      }
    );
  }

  serialize() {
    return {
      bookingDate: this.bookingDate,
      items: map(this.entries, entry => entry.serialize())
    };
  }

  static deserialize({ id, bookingDate, entries }, configuration) {
    return new GroupAlternativeItem({
      id,
      bookingDate,
      entries: map(entries, entry =>
        GroupAlternativeItemEntry.deserialize(entry, configuration)
      )
    });
  }

  static default({ roomType, packages }) {
    return new GroupAlternativeItem({
      entries: [GroupAlternativeItemEntry.default({ roomType, packages })]
    });
  }
}
