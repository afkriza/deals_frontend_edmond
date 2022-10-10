import { groupBy } from 'lodash';

import UnitChannel from './UnitChannel';

export default class UnitGroup {
  constructor(units) {
    this.units = units;
    this.dates = this.getDates();
    this.groupedByChannel = this.groupByChannel();
    this.groupedChannelByUnitType = this.groupChannelByUnitType();
    this.accumulatedCriteria = this.getAccumulatedCriteria();
  }

  groupByChannel() {
    const grouped = groupBy(this.units, unit => unit.channel.id);
    return Object.keys(grouped).map(
      channel => new UnitChannel(channel, grouped[channel])
    );
  }

  groupChannelByUnitType() {
    throw new Error('Method groupChannelByUnitType not implemented!');
  }

  getAccumulatedCriteria() {
    return this.groupedChannelByUnitType
      .map(({ accumulatedCriteria }) => accumulatedCriteria)
      .join('-');
  }

  getDates() {
    return [...new Set(this.units.map(unit => unit.bookingDate))];
  }
}
