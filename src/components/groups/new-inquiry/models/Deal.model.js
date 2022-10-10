import { forEach, map, size, without, find } from 'lodash';
import Group from '@/components/groups/new-inquiry/models/Group.model';
import { generateRandomHex } from '@/utils/string';

export default class Deal {
  constructor({
    id,
    name,
    budget,
    otherExpenses,
    priority,
    partner,
    note,
    groups,
    user,
    department
  }) {
    this.id = id || generateRandomHex();
    this.name = name;
    this.budget = budget;
    this.otherExpenses = otherExpenses;
    this.priority = priority;
    this.partner = partner;
    this.note = note;
    this.groups = map(groups, group => new Group(group));
    this.user = user;
    this.department = department;
  }

  get size() {
    return size(this.groups);
  }

  addGroup(group) {
    this.groups.push(group);

    this.updateGroupNames();

    return group;
  }

  addDefaultGroup({ name, roomType, packages }) {
    const defaultGroup = Group.default({ name, roomType, packages });

    return this.addGroup(defaultGroup);
  }

  duplicateGroup(group) {
    const duplicatedGroup = group.duplicate();

    return this.addGroup(duplicatedGroup);
  }

  deleteGroup(group) {
    this.groups = without(this.groups, group);

    this.updateGroupNames();
  }

  updateGroupNames() {
    forEach(this.groups, (group, idx) => {
      group.name = `Group ${idx + 1}`;
    });
  }

  serialize() {
    return {
      inquiry: {
        name: this.name,
        budget: this.budget,
        otherExpenses: this.otherExpenses,
        note: this.note,
        priority: this.priority,
        partnerId: this.partner.id,
        groups: map(this.groups, group => group.serialize()),
        department: this.department
      }
    };
  }

  static deserialize(
    {
      id,
      name,
      budget,
      otherExpenses,
      note,
      priority,
      groups,
      user,
      department
    },
    configuration
  ) {
    return new Deal({
      id,
      name,
      budget,
      otherExpenses,
      priority,
      note,
      groups: map(groups, (group, idx) =>
        Group.deserialize({ name: `Group ${idx + 1}`, ...group }, configuration)
      ),
      user
    });
  }

  static default({ roomType, packages, department }) {
    return new Deal({
      name: '',
      budget: null,
      otherExpenses: null,
      priority: false,
      partner: null,
      note: '',
      groups: [Group.default({ name: 'Group 1', roomType, packages })],
      department
    });
  }
}
