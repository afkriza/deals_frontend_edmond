import { groupBy } from 'lodash';

import UnitGroup from '@/classes/checkout/UnitGroup';
import ChannelGroupInventory from '@/classes/checkout/ChannelGroupInventory';

export default class UnitGroupInventory extends UnitGroup {
  constructor(units) {
    super(units);
  }

  groupChannelByUnitType() {
    const grouped = groupBy(this.groupedByChannel, channel =>
      channel.unitTypes.sort().join(',')
    );
    return Object.keys(grouped).map(
      channelGroupId => new ChannelGroupInventory(grouped[channelGroupId])
    );
  }
}
