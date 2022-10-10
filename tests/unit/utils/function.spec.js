import { expect } from 'chai';

import * as functionUtil from 'utils/function';

describe('utils/function', () => {
  describe('prop', () => {
    it('should create a function', () => {
      expect(functionUtil.prop('name')).to.be.a('function');
    });

    it('should create an property getter for a given name', () => {
      const object = {
        a: 1,
        b: 2
      };

      const getA = functionUtil.prop('a');
      const getB = functionUtil.prop('b');

      expect(getA(object)).to.equal(1);
      expect(getB(object)).to.equal(2);
    });
  });

  describe('equalBy', () => {
    it('should create a function that returns a function', () => {
      expect(functionUtil.equalBy('a')).to.be.a('function');
      expect(functionUtil.equalBy('a')({})).to.be.a('function');
    });

    it('should create a function that compares objects by some prop', () => {
      const a = { a: 1, b: 1 };
      const b = { a: 1, b: 2 };
      const c = { a: 2, b: 1 };

      const comparator = functionUtil.equalBy('a');

      expect(comparator(a)(b)).to.be.true;
      expect(comparator(b)(a)).to.be.true;
      expect(comparator(a)(c)).to.be.false;
      expect(comparator(c)(a)).to.be.false;
    });
  });

  describe('papp', () => {
    it('should return a function', () => {
      const foo = x => x;
      const fooOne = functionUtil.papp(foo, 1);

      expect(fooOne).to.be.a('function');
    });

    it('should partially apply functions', () => {
      const foo = x => x;
      const bar = (x, y) => x + y;
      const baz = (x, y, z) => x + y * z;

      const fooOne = functionUtil.papp(foo, 1);
      const barOne = functionUtil.papp(bar, 1);
      const barOneOne = functionUtil.papp(bar, 1, 1);
      const bazOne = functionUtil.papp(baz, 1);
      const bazOneTwo = functionUtil.papp(baz, 1, 2);

      expect(fooOne()).to.equal(1);
      expect(barOne(5)).to.equal(6);
      expect(barOneOne()).to.equal(2);
      expect(bazOne(5, 6)).to.equal(31);
      expect(bazOneTwo(5)).to.equal(11);
    });
  });
});
