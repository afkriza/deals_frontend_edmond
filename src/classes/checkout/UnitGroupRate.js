import { groupBy } from 'lodash';
import UnitGroup from '@/classes/checkout/UnitGroup';
import ChannelGroupRate from '@/classes/checkout/ChannelGroupRate';

export default class UnitGroupRate extends UnitGroup {
  constructor(units) {
    super(units);
  }

  groupChannelByUnitType() {
    const grouped = groupBy(this.groupedByChannel, channel =>
      channel.unitTypes.sort().join(',')
    );
    return Object.keys(grouped).map(
      channelGroupId => new ChannelGroupRate(grouped[channelGroupId])
    );
  }
}
