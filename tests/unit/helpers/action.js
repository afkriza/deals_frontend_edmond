import { expect } from 'chai';

export default function(
  action,
  { payload, state, expectedMutations, getters, actions }
) {
  return new Promise((resolve, reject) => {
    let count = 0;
    const dispatch = (name, actionPayload) => {
      return actions[name](actionPayload);
    };

    function commit(type) {
      const mutation = expectedMutations[count];
      if (typeof type === 'object') {
        expect(mutation.type).to.equal(type.type);
      } else {
        expect(mutation.type).to.equal(type);
      }

      count++;
      if (count === expectedMutations.length) {
        resolve();
      }
    }

    try {
      action({ commit, state, getters, dispatch }, payload);
    } catch (e) {
      reject(e.message);
    }

    if (expectedMutations.length === 0) {
      expect(count).to.equal(0);
      resolve();
    }
  });
}
