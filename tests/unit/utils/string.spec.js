import { expect } from 'chai';

import * as stringUtil from 'utils/string';

describe('Utils/string', function() {
  it('converts to camelCase', function() {
    expect(stringUtil.toCamelCase('snake_case')).to.equal('snakeCase');
  });

  it('converts to snake_case', function() {
    expect(stringUtil.toSnakeCase('snakeCase')).to.equal('snake_case');
  });
});
