export default class UnitChannel {
  constructor(channelId, units) {
    this.channelId = channelId;
    this.units = units;
    this.unitTypes = this.getUnitTypes();
  }

  getUnitTypes() {
    return [...new Set(this.units.map(unit => unit.aggregateUnitType.name))];
  }
}
