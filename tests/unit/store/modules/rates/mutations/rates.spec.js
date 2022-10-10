/* eslint-disable new-cap */
import { expect } from 'chai';

import * as mutationTypes from 'store/mutation-types';
import mutations from 'store/modules/rates/mutations';

import Rate from 'models/Rate';

import unitScopes from 'enums/unit-scopes';

describe('Mutations/rates/rates', function() {
  it(mutationTypes.RATES_REQUEST, function() {
    const state = {
      rates: {
        isLoaded: false,
        isLoading: false,
        data: []
      }
    };

    mutations.RATES_REQUEST(state);

    expect(state.rates.isLoading).to.equal(true);
    expect(state.rates.isLoaded).to.equal(false);
  });

  it(mutationTypes.RATES_SUCCESS, function() {
    const state = {
      rates: {
        isLoaded: false,
        isLoading: true,
        data: []
      }
    };

    const units = [
      {
        id: 1,
        name: 'test'
      }
    ];

    mutations.RATES_SUCCESS(state, { units });

    expect(state.rates.isLoaded).to.equal(true);
    expect(state.rates.isLoading).to.equal(false);
    expect(state.rates.data).to.have.lengthOf(1);
    expect(state.rates.data[0].id).to.equal(1);
  });

  it(mutationTypes.RATES_FAILURE, function() {
    const state = {
      rates: {
        isLoaded: false,
        isLoading: true,
        data: []
      }
    };

    mutations.RATES_FAILURE(state);

    expect(state.rates.isLoading).to.equal(false);
    expect(state.rates.isLoaded).to.equal(false);
  });

  it(mutationTypes.RATES_UPDATE, function() {
    const state = {
      rates: {
        data: [
          new Rate({
            id: 2,
            newPriceLevel: 10
          })
        ]
      }
    };

    mutations.RATES_UPDATE(state, {
      unitID: 2,
      value: {
        newPriceLevel: 100,
        accepted: true
      }
    });

    expect(state.rates.data[0].newPriceLevel).to.equal(100);
    expect(state.rates.data[0].isAccepted).to.be.true;
  });

  it(mutationTypes.RATES_UPDATE, function() {
    const state = {
      rates: {
        data: [
          new Rate({
            id: 2,
            newPriceLevel: 10
          })
        ]
      }
    };

    mutations.RATES_UPDATE(state, {
      unitID: 2,
      value: {
        accepted: false
      }
    });

    expect(state.rates.data[0].newPriceLevel).to.equal(10);
    expect(state.rates.data[0].isAccepted).to.be.false;
  });

  it(mutationTypes.RATES_BULK_UPDATE, function() {
    const state = {
      rates: {
        data: [
          new Rate({
            id: 2,
            checked: false
          }),
          new Rate({
            id: 3,
            checked: true
          })
        ]
      }
    };

    mutations.RATES_BULK_UPDATE(state, {
      unitIDs: [2, 3],
      value: {
        checked: true
      }
    });

    expect(state.rates.data[0].checked).to.be.true;
    expect(state.rates.data[1].checked).to.be.true;

    mutations.RATES_BULK_UPDATE(state, {
      unitIDs: [2, 3],
      value: {
        checked: false
      }
    });

    expect(state.rates.data[0].checked).to.be.false;
    expect(state.rates.data[1].checked).to.be.false;
  });

  it(mutationTypes.RATES_VISIBLE_CHANNELS_UPDATE, function() {
    const state = {
      rates: {
        data: [
          new Rate({
            id: 2,
            newPriceLevel: 10
          })
        ]
      },
      visibleChannels: [1, 2],
      unitScope: unitScopes.SUGGESTIONS
    };

    mutations.RATES_VISIBLE_CHANNELS_UPDATE(state, {
      value: false,
      channelID: 1
    });

    expect(state.visibleChannels).not.to.contain(1);
  });

  it(mutationTypes.RATES_VISIBLE_CHANNELS_UPDATE, function() {
    const state = {
      rates: {
        data: [
          new Rate({
            id: 2,
            newPriceLevel: 10
          })
        ]
      },
      visibleChannels: [1, 2],
      unitScope: unitScopes.SUGGESTIONS
    };

    mutations.RATES_VISIBLE_CHANNELS_UPDATE(state, {
      value: true,
      channelID: 3
    });

    expect(state.visibleChannels).to.contain(3);
  });

  it(mutationTypes.RATES_UNIT_SCOPE_UPDATE, function() {
    const state = {
      rates: {
        data: [
          new Rate({
            id: 2,
            newPriceLevel: 10
          })
        ]
      },
      visibleChannels: [1, 2],
      unitScope: unitScopes.SUGGESTIONS
    };

    mutations.RATES_UNIT_SCOPE_UPDATE(state, unitScopes.ALL);

    expect(state.unitScope).to.equal(unitScopes.ALL);
  });

  it(mutationTypes.RATES_UNIT_SCOPE_UPDATE, function() {
    const state = {
      rates: {
        data: [
          new Rate({
            id: 2,
            newPriceLevel: 10
          })
        ]
      },
      visibleChannels: [1, 2],
      unitScope: unitScopes.SUGGESTIONS
    };

    mutations.RATES_UNIT_SCOPE_UPDATE(state, unitScopes.SUGGESTIONS);

    expect(state.unitScope).to.equal(unitScopes.SUGGESTIONS);
  });
});

/* eslint-enable new-cap */
