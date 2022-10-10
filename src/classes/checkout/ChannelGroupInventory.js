import ChannelGroup from '@/classes/checkout/ChannelGroup';

export default class ChannelGroupInventory extends ChannelGroup {
  constructor(channels) {
    super(channels);
  }

  getCriteria() {
    const firstUnit = this.channels[0].units[0];

    return `${firstUnit.currentNoOfPlacedUnits}-${firstUnit.newNoOfPlacedUnits}-${firstUnit.placedUnitsMode}-${firstUnit.newPlacedUnitsMode}-${firstUnit.updatedStatus}`;
  }
}
