import { map, size, without } from 'lodash';
import GroupAlternative from '@/components/groups/new-inquiry/models/GroupAlternative.model';
import { generateRandomHex } from '@/utils/string';

export default class Group {
  constructor({ id, name, groupAlternatives }) {
    this.id = id || generateRandomHex();
    this.name = name;

    this.groupAlternatives = map(
      groupAlternatives,
      alternative => new GroupAlternative(alternative)
    );
  }

  get size() {
    return size(this.groupAlternatives);
  }

  duplicate() {
    return new Group({
      id: null,
      name: '',
      groupAlternatives: map(this.groupAlternatives, alternative =>
        alternative.duplicate()
      )
    });
  }

  addAlternative(alternative) {
    this.groupAlternatives.push(alternative);

    return alternative;
  }

  addDefaultAlternative({ roomType, packages }) {
    const defaultAlternative = GroupAlternative.default({ roomType, packages });

    return this.addAlternative(defaultAlternative);
  }

  duplicateAlternative(alternative) {
    const duplicate = alternative.duplicate();

    this.groupAlternatives.push(duplicate);

    return duplicate;
  }

  deleteAlternative(alternative) {
    this.groupAlternatives = without(this.groupAlternatives, alternative);
  }

  serialize() {
    return {
      name: this.name,
      groupAlternatives: map(this.groupAlternatives, groupAlternative =>
        groupAlternative.serialize()
      )
    };
  }

  static deserialize({ id, name, groupAlternatives }, configuration) {
    return new Group({
      id,
      name,
      groupAlternatives: map(groupAlternatives, groupAlternative =>
        GroupAlternative.deserialize(groupAlternative, configuration)
      )
    });
  }

  static default({ name, roomType, packages }) {
    return new Group({
      name,
      groupAlternatives: [
        GroupAlternative.default({
          roomType,
          packages
        })
      ]
    });
  }
}
