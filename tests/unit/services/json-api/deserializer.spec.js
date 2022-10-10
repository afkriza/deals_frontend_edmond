import { expect } from 'chai';

import deserializer from '@/api/json-api/deserializer';

describe('JSON API Deserializer', function () {
  it('deserializes simple object', function () {
    const data = {
      data: {
        id: 5,
        type: 'example',
        attributes: {
          name: 'name',
          my_number: 10,
          date: '2017-08-09'
        }
      }
    };

    const deserialized = deserializer(data);

    const expected = {
      data: {
        id: 5,
        resourceType: 'example',
        name: 'name',
        myNumber: 10,
        date: '2017-08-09'
      }
    };

    expect(deserialized).to.deep.equal(expected);
  });

  it('deserializes collection', function () {
    const data = {
      data: [
        {
          id: 5,
          type: 'example',
          attributes: {
            name: 'name',
            my_number: 10,
            date: '2017-08-09'
          }
        },
        {
          id: 6,
          type: 'example',
          attributes: {
            name: 'name2',
            my_number: 5,
            date: '2017-08-09'
          }
        }
      ]
    };

    const deserialized = deserializer(data);

    const expected = {
      data: [
        {
          id: 5,
          resourceType: 'example',
          name: 'name',
          myNumber: 10,
          date: '2017-08-09'
        },
        {
          id: 6,
          resourceType: 'example',
          name: 'name2',
          myNumber: 5,
          date: '2017-08-09'
        }
      ]
    };

    expect(deserialized).to.deep.equal(expected);
  });

  it('deserializes meta data', function () {
    const data = {
      meta: {
        something_important: 10
      }
    };

    const deserialized = deserializer(data);

    const expected = {
      meta: {
        somethingImportant: 10
      }
    };

    expect(deserialized).to.deep.equal(expected);
  });

  it('deserializes relationships', function () {
    const data = {
      data: {
        id: 5,
        type: 'example',
        relationships: {
          rel: {
            data: {
              id: 10,
              type: 'something'
            }
          }
        }
      },
      included: [
        {
          id: 10,
          type: 'something',
          attributes: {
            index: 10,
            name: 'Dummy'
          }
        }
      ]
    };

    const deserialized = deserializer(data);

    const expected = {
      data: {
        id: 5,
        resourceType: 'example',
        rel: {
          id: 10,
          resourceType: 'something',
          index: 10,
          name: 'Dummy'
        }
      }
    };

    expect(deserialized).to.deep.equal(expected);
  });

  it('deserializes relationships that are not included', function () {
    const data = {
      data: {
        id: 5,
        type: 'example',
        relationships: {
          rel: {
            data: {
              id: 10,
              type: 'something'
            }
          }
        }
      },
      included: []
    };

    const deserialized = deserializer(data);

    const expected = {
      data: {
        rel: {
          id: 10,
          resourceType: 'something'
        },
        id: 5,
        resourceType: 'example'
      }
    };

    expect(deserialized).to.deep.equal(expected);
  });
});
