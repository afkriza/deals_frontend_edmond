import { groupBy } from 'lodash';
import DateGroup from './DateGroup';

export default class Groups {
  constructor(units) {
    this.units = units;
    this.groupedByState = this.groupByState();
    this.groupedByAccumulatedCriteria = this.groupByAccumulatedCriteria();
  }

  groupByState() {
    throw new Error('Method groupByState not implemented!');
  }

  groupByAccumulatedCriteria() {
    const grouped = groupBy(
      this.groupedByState,
      state => state.accumulatedCriteria
    );
    return Object.keys(grouped).map(
      dateGroup => new DateGroup(grouped[dateGroup])
    );
  }
}
