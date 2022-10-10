import { expect } from 'chai';

import Unit from 'models/Unit';

describe('models/Unit', () => {
  let unitA;

  beforeEach(() => {
    unitA = new Unit({
      id: 'R1',
      bookingDate: '2017-07-01',
      property: {
        id: '1p'
      },
      unitType: {
        id: '1u'
      },
      channel: {
        id: '1c'
      },
      stopSignal: true,
      currentStopSignal: true,
      newStopSignal: false,
      stopSignalMode: 'manual'
    });
  });

  it('should return if unit is set to active', () => {
    expect(unitA.isActive).to.be.equal(true);
  });

  it('should return if unit is set stopped', () => {
    expect(unitA.isStopped).to.be.equal(false);
  });

  it('should return if rate is accepted', () => {
    expect(unitA.isAccepted).to.be.equal(false);
  });

  it('should return updated status', () => {
    expect(unitA.updatedStatus).to.be.equal('Open');
  });
});
