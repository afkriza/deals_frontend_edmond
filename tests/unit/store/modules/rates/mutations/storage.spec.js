/* eslint-disable new-cap */
import { expect } from 'chai';

import * as mutationTypes from 'store/mutation-types';
import mutations from 'store/modules/rates/mutations';
import Rate from 'models/Rate';

import mockRateGenerator from 'mocks/models/rate';

describe('Mutations/rates/storage', () => {
  let rateA;

  beforeEach(() => {
    rateA = mockRateGenerator();
  });

  it(mutationTypes.RATES_STORAGE_SAVE_START, () => {
    const state = {
      storage: {
        isLoading: false
      }
    };

    mutations.RATES_STORAGE_SAVE_START(state);

    expect(state.storage.isLoading).to.be.true;
  });

  it(mutationTypes.RATES_STORAGE_SAVE_END, () => {
    const state = {
      storage: {
        isLoading: true,
        hasData: false
      },
      rates: {
        isLoaded: true,
        data: [rateA]
      }
    };

    mutations.RATES_STORAGE_SAVE_END(state);

    expect(state.storage.isLoading).to.be.false;
    expect(state.storage.hasData).to.be.true;
    expect(state.rates.isLoaded).to.be.false;
    expect(state.rates.data).to.be.deep.equal([]);
  });

  it(mutationTypes.RATES_STORAGE_LOAD_START, () => {
    const state = {
      rates: {
        isLoading: false
      }
    };

    mutations.RATES_STORAGE_LOAD_START(state);

    expect(state.rates.isLoading).to.be.true;
  });

  it(mutationTypes.RATES_STORAGE_LOAD_END, () => {
    const state = {
      rates: {
        data: [],
        isLoading: true,
        isLoaded: false
      }
    };

    const units = [];

    mutations.RATES_STORAGE_LOAD_END(state, { units });

    expect(state.rates.isLoading).to.be.false;
    expect(state.rates.isLoaded).to.be.false;
    expect(state.rates.data).to.be.deep.equal([]);
  });

  it(mutationTypes.RATES_STORAGE_LOAD_END, () => {
    const state = {
      rates: {
        data: [],
        isLoading: true,
        isLoaded: false
      }
    };

    const units = [{ doc: { id: rateA.id } }];

    mutations.RATES_STORAGE_LOAD_END(state, { units });

    expect(state.rates.isLoading).to.be.false;
    expect(state.rates.isLoaded).to.be.true;
    expect(state.rates.data).to.have.lengthOf(1);
    expect(state.rates.data[0])
      .to.have.property('id')
      .that.is.equal(rateA.id);
    expect(state.rates.data[0]).to.be.instanceof(Rate);
  });
});

/* eslint-enable new-cap */
