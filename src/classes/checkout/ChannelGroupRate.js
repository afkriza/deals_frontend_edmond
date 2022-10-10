import ChannelGroup from '@/classes/checkout/ChannelGroup';

export default class ChannelGroupRate extends ChannelGroup {
  constructor(channels) {
    super(channels);
  }

  getCriteria() {
    const firstUnit = this.channels[0].units[0];

    return `${firstUnit.currentPriceLevel}-${firstUnit.newPriceLevel}-${firstUnit.priceLevelMode}-${firstUnit.newPriceLevelMode}-${firstUnit.updatedStatus}`;
  }
}
