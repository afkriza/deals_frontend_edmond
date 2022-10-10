import { expect } from 'chai';
import { formatDate } from 'utils/format';

import serializer from '@/api/json-api/serializer';

const DATE_FORMAT = 'yyyy-MM-dd';

describe('JSON API Serializer', () => {
  function serializedDate(date) {
    return formatDate(date, DATE_FORMAT);
  }

  it('serializes simple object', () => {
    const mockDate = new Date();

    const data = {
      id: 5,
      name: 'name',
      number: 10,
      dateTime: mockDate
    };

    const serialized = serializer(data, {
      attributes: ['name', 'number', 'dateTime'],
      resourceType: 'example'
    });

    const expected = {
      data: {
        id: 5,
        type: 'example',
        attributes: {
          name: 'name',
          number: 10,
          date_time: serializedDate(mockDate)
        }
      }
    };

    expect(serialized).to.deep.equal(expected);
  });

  it('serializes object without id and type', () => {
    const mockDate = new Date();

    const data = {
      name: 'name',
      number: 10,
      dateTime: mockDate
    };

    const serialized = serializer(data, {
      attributes: ['name', 'number', 'dateTime']
    });

    const expected = {
      data: {
        id: undefined, // eslint-disable-line no-undefined
        type: undefined, // eslint-disable-line no-undefined
        attributes: {
          name: 'name',
          number: 10,
          date_time: serializedDate(mockDate)
        }
      }
    };

    expect(serialized).to.deep.equal(expected);
  });

  it('serializes only whitelisted atributes', () => {
    const mockDate = new Date();

    const data = {
      id: 5,
      name: 'name',
      number: 10,
      dateTime: mockDate
    };

    const serialized = serializer(data, {
      attributes: ['name', 'dateTime'],
      resourceType: 'example'
    });

    const expected = {
      data: {
        id: 5,
        type: 'example',
        attributes: {
          name: 'name',
          date_time: serializedDate(mockDate)
        }
      }
    };

    expect(serialized).to.deep.equal(expected);
  });

  it('serializes collection', () => {
    const mockDate = new Date();

    const data = [
      {
        id: 5,
        name: 'name',
        number: 10,
        dateTime: mockDate
      },
      {
        id: 6,
        name: 'name2',
        number: 5,
        dateTime: mockDate
      }
    ];

    const serialized = serializer(data, {
      attributes: ['name', 'number', 'dateTime'],
      resourceType: 'example'
    });

    const expected = {
      data: [
        {
          id: 5,
          type: 'example',
          attributes: {
            name: 'name',
            number: 10,
            date_time: serializedDate(mockDate)
          }
        },
        {
          id: 6,
          type: 'example',
          attributes: {
            name: 'name2',
            number: 5,
            date_time: serializedDate(mockDate)
          }
        }
      ]
    };

    expect(serialized).to.deep.equal(expected);
  });

  it('serializes object with relationships', () => {
    const mockDate = new Date();

    const data = {
      id: 5,
      name: 'name',
      number: 10,
      property: 'hotel infinum',
      dateTime: mockDate
    };

    const serialized = serializer(data, {
      attributes: ['name', 'dateTime'],
      relationships: ['property'],
      resourceType: 'example'
    });

    const expected = {
      data: {
        id: 5,
        type: 'example',
        attributes: {
          name: 'name',
          date_time: serializedDate(mockDate)
        },
        relationships: {
          property: {
            data: 'hotel infinum'
          }
        }
      }
    };

    expect(serialized).to.deep.equal(expected);
  });

  it('serializes object with relationship array', () => {
    const mockDate = new Date();

    const data = {
      id: 5,
      name: 'name',
      number: 10,
      property: 'hotel infinum',
      reportMembership: ['rates', 'inventory'],
      dateTime: mockDate
    };

    const serialized = serializer(data, {
      attributes: ['name', 'dateTime'],
      relationships: ['property', 'reportMembership'],
      resourceType: 'example'
    });

    const expected = {
      data: {
        id: 5,
        type: 'example',
        attributes: {
          name: 'name',
          date_time: serializedDate(mockDate)
        },
        relationships: {
          property: {
            data: 'hotel infinum'
          },
          report_membership: {
            data: ['rates', 'inventory']
          }
        }
      }
    };

    expect(serialized).to.deep.equal(expected);
  });
});
