import { groupBy } from 'lodash';
import UnitGroupRate from '@/classes/checkout/UnitGroupRate';
import Groups from '@/classes/checkout/Groups';

export default class GroupsRate extends Groups {
  constructor(rates) {
    super(rates);
  }

  groupByState() {
    const grouped = groupBy(this.units, rate => {
      return `${rate.currentPriceLevel}-${rate.newPriceLevel}-${rate.priceLevelMode}-${rate.newPriceLevelMode}-${rate.updatedStatus}--${rate.bookingDate}`;
    });
    return Object.keys(grouped).map(
      rateGroup => new UnitGroupRate(grouped[rateGroup])
    );
  }
}
