import { expect } from 'chai';

import MockDatabases from 'mocks/databases';
import testAction from 'helpers/action';
import actionsGenerator from 'store/modules/rates/actions';
import * as mutationTypes from 'store/mutation-types';

import mockRateGenerator from 'mocks/models/rate';

jest.mock('api/services/Rates.service');

describe('Actions/rates', () => {
  let actions;
  let rateA;

  const getters = {
    filtersQuery: {},
    filterTabs: [{ id: '1' }]
  };

  beforeEach(() => {
    rateA = mockRateGenerator();

    actions = actionsGenerator({
      databases: MockDatabases
    });
  });

  it('fetches rates', async () => {
    await MockDatabases.rates.addAll([rateA]);

    let hasStarted = false;
    const commit = (type, data) => {
      if (hasStarted) {
        expect(type).to.be.equal(mutationTypes.RATES_FILTER_TAB_CHANGE);
        expect(data).to.be.equal('1');
      } else {
        expect(type).to.be.equal(mutationTypes.RATES_REQUEST);
        hasStarted = true;
      }
    };

    const dispatch = type => {
      expect(type).to.be.equal('saveUnits');
    };

    await actions.fetchUnits({ commit, dispatch, getters });

    const dataInDatabase = await MockDatabases.rates.getAll();
    expect(dataInDatabase).to.be.deep.equal([]);
  });

  it('save rates to storage', () => {
    return testAction(actions.saveToStorage, {
      state: {
        rates: {
          isLoading: false,
          isLoaded: false,
          data: [],
          filters: []
        }
      },
      getters,
      expectedMutations: [
        {
          type: mutationTypes.RATES_STORAGE_SAVE_START
        },
        {
          type: mutationTypes.RATES_STORAGE_SAVE_END
        }
      ]
    });
  });

  it('updates single rate unit to storage', async () => {
    testAction(actions.saveSingleToStorage, {
      payload: rateA,
      state: {
        rates: {
          isLoading: false,
          isLoaded: false,
          data: [],
          filters: []
        }
      },
      getters,
      expectedMutations: [
        {
          type: mutationTypes.RATES_STORAGE_SAVE_START
        },
        {
          type: mutationTypes.RATES_STORAGE_SAVE_END
        }
      ]
    });

    const doc = await MockDatabases.rates.get(rateA._id);
    expect(doc).to.exist;
  });

  it('save rates to storage', async () => {
    const state = {
      rates: {
        isLoading: false,
        isLoaded: false,
        data: [rateA],
        filters: []
      },
      storage: {
        hasData: true,
        isLoading: false
      }
    };

    let hasStarted = false;
    const commit = type => {
      if (hasStarted) {
        expect(type).to.be.equal(mutationTypes.RATES_STORAGE_SAVE_END);
      } else {
        expect(type).to.be.equal(mutationTypes.RATES_STORAGE_SAVE_START);
        hasStarted = true;
      }
    };

    actions.saveToStorage({ commit, state });
    const data = await MockDatabases.rates.getAll();
    expect(data).to.have.lengthOf(1);
    expect(data[0].doc.id).to.be.deep.equal(rateA.id);
  });

  it('load rates from storage', () => {
    return testAction(actions.loadFromStorage, {
      state: {
        rates: {
          isLoading: false,
          isLoaded: false,
          data: [],
          filters: []
        },
        storage: {
          hasData: true
        }
      },
      getters,
      expectedMutations: [
        {
          type: mutationTypes.RATES_STORAGE_LOAD_START
        },
        {
          type: mutationTypes.RATES_STORAGE_LOAD_END
        }
      ]
    });
  });

  it('load rates from storage', () => {
    return testAction(actions.loadFromStorage, {
      state: {
        rates: {
          isLoading: false,
          isLoaded: false,
          data: [],
          filters: []
        },
        storage: {
          hasData: false
        }
      },
      getters,
      expectedMutations: []
    });
  });
});
