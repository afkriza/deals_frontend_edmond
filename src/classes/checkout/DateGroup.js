import { flatMap, groupBy } from 'utils/collection';

export default class DateGroup {
  constructor(group) {
    this.group = group;
    this.units = this.getUnits();
    this.dates = this.getDates();
    this.channelGroups = this.getAllChannelGroups();
    this.groupedChannelGroups = this.getGroupedChannelGroups();
  }

  getUnits() {
    return flatMap(this.group, ({ units }) => units);
  }

  getDates() {
    return flatMap(this.group, ({ dates }) => dates);
  }

  getAllChannelGroups() {
    return flatMap(
      this.group,
      ({ groupedChannelByUnitType }) => groupedChannelByUnitType
    );
  }

  getGroupedChannelGroups() {
    const grouped = groupBy(
      this.channelGroups,
      channelGroup => channelGroup.accumulatedCriteria
    );
    return Object.keys(grouped).map(group =>
      flatMap(grouped[group], channelGroup => channelGroup.units)
    );
  }
}
