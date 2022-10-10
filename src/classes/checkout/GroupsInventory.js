import { groupBy } from 'lodash';
import UnitGroupInventory from '@/classes/checkout/UnitGroupInventory';
import Groups from '@/classes/checkout/Groups';

export default class GroupsInventory extends Groups {
  constructor(inventories) {
    super(inventories);
  }

  groupByState() {
    const grouped = groupBy(
      this.units,
      inventory =>
        `${inventory.currentNoOfPlacedUnits}-${inventory.newNoOfPlacedUnits}-${inventory.placedUnitsMode}-${inventory.newPlacedUnitsMode}-${inventory.updatedStatus}-${inventory.bookingDate}`
    );
    return Object.keys(grouped).map(
      inventoryGroup => new UnitGroupInventory(grouped[inventoryGroup])
    );
  }
}
