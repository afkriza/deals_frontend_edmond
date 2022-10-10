let data = {};

function createDummyDatabase(name) {
  return {
    getAll() {
      const dataForName = data[name] || [];
      return Promise.resolve(dataForName.map(item => ({ doc: item })));
    },

    addAll(docs = []) {
      data[name] = docs;
      return Promise.resolve();
    },

    truncate() {
      data[name] = [];
      return Promise.resolve();
    },

    get(docID) {
      const doc = (data[name] || []).find(({ _id }) => _id === docID);
      return Promise.resolve({ doc });
    },

    remove(docID) {
      data[name] = (data[name] || []).filter(({ _id }) => _id !== docID);
      return Promise.resolve();
    },

    put(doc) {
      this.remove(doc._id);
      data[name].push(doc);
      return Promise.resolve();
    }
  };
}

function truncateAll() {
  data = {};
}

export default {
  rates: createDummyDatabase('rates'),
  inventory: createDummyDatabase('inventory'),
  checkoutRates: createDummyDatabase('checkoutRates'),
  checkoutInventory: createDummyDatabase('checkoutInventory'),
  truncateAll
};
