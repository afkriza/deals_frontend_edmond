import PouchDB from 'pouchdb';

import { environments } from 'enums/environments';

// NOTE: Used for debugging (Chrome extension)
if (process.env.NODE_ENV === environments.DEVELOPMENT) {
  window.PouchDB = PouchDB;
}

class Database {
  constructor(databaseName) {
    this.databaseName = databaseName;

    this.create();
  }

  async truncate() {
    await this.drop();
    this.create();
  }

  create() {
    this.db = new PouchDB(this.databaseName, {
      auto_compaction: true
    });
  }

  drop() {
    return this.db.destroy();
  }

  getAll() {
    return this.db.allDocs({ include_docs: true }).then(({ rows }) => rows);
  }

  addAll(docs = []) {
    return this.db.bulkDocs(docs);
  }

  remove(docID, docRev) {
    return this.db.remove(docID, docRev);
  }

  get(docID) {
    return this.db.get(docID);
  }

  put(doc) {
    return this.db.put(doc);
  }
}

export default {
  rates: new Database('rates'),
  inventory: new Database('inventory'),
  checkoutRates: new Database('checkout_rates'),
  checkoutInventory: new Database('checkout_inventory')
};
