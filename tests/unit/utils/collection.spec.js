import { expect } from 'chai';

import * as collectionUtil from 'utils/collection';

describe('Utils/collection', function() {
  describe('groupBy', () => {
    it('groups collection with string as key', function() {
      const collection = [
        {
          name: 'a',
          date: '2017-07-06'
        },
        {
          name: 'b',
          date: '2017-07-06'
        }
      ];

      expect(collectionUtil.groupBy(collection, 'name')).to.deep.equal({
        a: [
          {
            name: 'a',
            date: '2017-07-06'
          }
        ],
        b: [
          {
            name: 'b',
            date: '2017-07-06'
          }
        ]
      });
    });

    it('groups collection with string as key', function() {
      const collection = [
        {
          name: 'a',
          date: '2017-07-06'
        },
        {
          name: 'b',
          date: '2017-07-06'
        }
      ];

      expect(collectionUtil.groupBy(collection, 'date')).to.deep.equal({
        '2017-07-06': [
          {
            name: 'a',
            date: '2017-07-06'
          },
          {
            name: 'b',
            date: '2017-07-06'
          }
        ]
      });
    });

    it('groups collection with function as key', function() {
      const collection = [
        {
          name: 'a',
          date: '2017-07-06'
        },
        {
          name: 'b',
          date: '2017-07-06'
        }
      ];

      expect(
        collectionUtil.groupBy(collection, item => item.date)
      ).to.deep.equal({
        '2017-07-06': [
          {
            name: 'a',
            date: '2017-07-06'
          },
          {
            name: 'b',
            date: '2017-07-06'
          }
        ]
      });
    });
  });

  describe('unique', () => {
    it('returns unique items in collection', function() {
      const collection = [1, 2, 2, 2];

      expect(collectionUtil.unique(collection)).to.be.deep.equal([1, 2]);
    });

    it('returns unique items in collection', function() {
      const collection = [1, 2, 3, 4];

      expect(collectionUtil.unique(collection)).to.be.deep.equal([1, 2, 3, 4]);
    });
  });

  describe('uniqueDeep', () => {
    it('returns uniqueDeep items in collection', function() {
      const collection = [
        {
          id: 1
        },
        {
          id: 1
        },
        {
          id: 2
        }
      ];

      expect(collectionUtil.uniqueDeep(collection)).to.be.deep.equal([
        {
          id: 1
        },
        {
          id: 2
        }
      ]);
    });

    it('returns uniqueDeep items in collection', function() {
      const collection = [
        {
          id: 1
        },
        {
          id: 1
        }
      ];

      expect(collectionUtil.uniqueDeep(collection)).to.be.deep.equal([
        {
          id: 1
        }
      ]);
    });

    it('returns uniqueDeep items in array', function() {
      const collection = [1, 2, 2];

      expect(collectionUtil.uniqueDeep(collection)).to.be.deep.equal([1, 2]);
    });
  });

  describe('flatten', () => {
    it('should flatten arrays by one level', () => {
      const collection = [1, [2, 3], [4], [5, [6]]];

      expect(collectionUtil.flatten(collection)).to.be.deep.equal([
        1,
        2,
        3,
        4,
        5,
        [6]
      ]);
    });

    it('should do nothing for flat arrays', () => {
      const collection = [1, 2, 3, 4];

      expect(collectionUtil.flatten(collection)).to.be.deep.equal(collection);
    });
  });

  describe('flatMap', () => {
    it('should apply a fuction and flatten the results', () => {
      const collection = [1, 2, 3];
      const f = x => [x];

      expect(collectionUtil.flatMap(collection, f)).to.be.deep.equal(
        collection
      );
    });
  });

  describe('chunkBy', () => {
    it('should group items into arrays by some value', () => {
      const collection = [
        {
          id: 1,
          isBig: false
        },
        {
          id: 2,
          isBig: true
        },
        {
          id: 3,
          isBig: false
        }
      ];

      const f = item => item.isBig;

      expect(collectionUtil.chunkBy(collection, f)).to.be.deep.equal([
        [
          { id: 1, isBig: false },
          { id: 3, isBig: false }
        ],
        [{ id: 2, isBig: true }]
      ]);
    });
  });

  describe('chunkEvery', () => {
    it('should chunk an array into groups of given length', () => {
      const collection = [1, 2, 3, 4, 5, 6];

      expect(collectionUtil.chunkEvery(collection, 2)).to.deep.equal([
        [1, 2],
        [3, 4],
        [5, 6]
      ]);
    });

    it('should make the last chunk shorter if not enough items are present', () => {
      const collection = [1, 2, 3, 4, 5];

      expect(collectionUtil.chunkEvery(collection, 2)).to.deep.equal([
        [1, 2],
        [3, 4],
        [5]
      ]);
    });
  });

  describe('intersperse', () => {
    it('should intersperse an array of arrays with some value', () => {
      const collection = [
        [1, 2],
        [3, 4],
        [5, 6]
      ];

      expect(collectionUtil.intersperse(collection, 0)).to.deep.equal([
        [1, 2],
        0,
        [3, 4],
        0,
        [5, 6]
      ]);
    });
  });

  describe('weave', () => {
    it('should interleave two equal-length arrays', () => {
      const xs = [1, 2, 3];
      const ys = [4, 5, 6];

      expect(collectionUtil.weave(xs, ys)).to.deep.equal([1, 4, 2, 5, 3, 6]);
    });

    it('should fill in the remainder with the longer array if they are of unequal length', () => {
      const xs = [1, 2, 3];
      const ys = [4, 5];

      expect(collectionUtil.weave(xs, ys)).to.deep.equal([1, 4, 2, 5, 3]);

      expect(collectionUtil.weave(ys, xs)).to.deep.equal([4, 1, 5, 2, 3]);
    });
  });

  describe('pairBy', () => {
    it('should take two arrays and a predicate function factory (x) => (y) => (compare x y) and pair by it', () => {
      const xs = [
        {
          id: 1,
          value: 2
        },
        {
          id: 2,
          value: 2
        },
        {
          id: 3,
          value: 3
        }
      ];

      const ys = [
        {
          id: 1,
          value: 8
        },
        {
          id: 2,
          value: 3
        },
        {
          id: 3,
          value: 5
        }
      ];

      const predicateFactory = x => y => x.id === y.id;

      expect(collectionUtil.pairBy(xs, ys, predicateFactory)).to.deep.equal([
        [
          { id: 1, value: 2 },
          { id: 1, value: 8 }
        ],
        [
          { id: 2, value: 2 },
          { id: 2, value: 3 }
        ],
        [
          { id: 3, value: 3 },
          { id: 3, value: 5 }
        ]
      ]);
    });

    it('should preserve order of the first array', () => {
      const xs = [
        {
          id: 1,
          value: 2
        },
        {
          id: 2,
          value: 2
        },
        {
          id: 3,
          value: 3
        }
      ];

      const ys = [
        {
          id: 3,
          value: 5
        },
        {
          id: 2,
          value: 3
        },
        {
          id: 1,
          value: 8
        }
      ];

      const predicateFactory = x => y => x.id === y.id;

      expect(collectionUtil.pairBy(xs, ys, predicateFactory)).to.deep.equal([
        [
          { id: 1, value: 2 },
          { id: 1, value: 8 }
        ],
        [
          { id: 2, value: 2 },
          { id: 2, value: 3 }
        ],
        [
          { id: 3, value: 3 },
          { id: 3, value: 5 }
        ]
      ]);
    });

    it('should use `undefined` when there is no match in second array', () => {
      const xs = [
        {
          id: 1,
          value: 2
        },
        {
          id: 2,
          value: 2
        },
        {
          id: 3,
          value: 3
        }
      ];

      const ys = [
        {
          id: 3,
          value: 5
        }
      ];

      const predicateFactory = x => y => x.id === y.id;

      /* eslint-disable no-undefined */
      expect(collectionUtil.pairBy(xs, ys, predicateFactory)).to.deep.equal([
        [{ id: 1, value: 2 }, undefined],
        [{ id: 2, value: 2 }, undefined],
        [
          { id: 3, value: 3 },
          { id: 3, value: 5 }
        ]
      ]);
      /* eslint-enable no-undefined */
    });
  });

  describe('first', () => {
    it('should get the first value in an array', () => {
      expect(collectionUtil.first([1, 2])).to.equal(1);
      expect(collectionUtil.first([2])).to.equal(2);
      expect(collectionUtil.first(['a', 'b', 'c'])).to.equal('a');
    });

    it('should return undefined if the array is empty', () => {
      expect(collectionUtil.first([])).to.be.undefined;
    });
  });

  describe('second', () => {
    it('should get the second value in an array', () => {
      expect(collectionUtil.second([1, 2])).to.equal(2);
      expect(collectionUtil.second([2, 1])).to.equal(1);
      expect(collectionUtil.second(['a', 'b', 'c'])).to.equal('b');
    });

    it('should return undefined if the array is shorter than 2', () => {
      expect(collectionUtil.second([])).to.be.undefined;
      expect(collectionUtil.second([1])).to.be.undefined;
    });
  });
});
