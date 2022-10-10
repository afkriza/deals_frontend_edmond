import { toSnakeCase } from 'utils/string';
import { apify } from '@/api/json-api/apify';

import { UNDEFINED } from 'constants/variable-types';

class Serializer {
  constructor(data, { resourceType, attributes, relationships }) {
    this.data = data;
    this.payload = {};
    this.resourceType = resourceType;
    this.attributes = attributes;
    this.relationships = relationships;
    this.serialize();
  }

  serialize() {
    if (Array.isArray(this.data)) {
      this.payload.data = this.data.map(item => this.serializeData(item));
    } else {
      this.payload.data = this.serializeData(this.data);
    }
  }

  serializeData(item) {
    const payload = {};
    payload.id = item.id;
    payload.type = this.resourceType
      ? toSnakeCase(this.resourceType)
      : this.resourceType;
    payload.attributes = this.serializeAttributes(item);

    if (this.relationships && this.relationships.length) {
      payload.relationships = this.serializeRelationships(item);
    }

    return payload;
  }

  serializeAttributes(item) {
    const payload = {};

    this.attributes.forEach(attributeName => {
      if (item[attributeName] !== null && item[attributeName] !== UNDEFINED) {
        payload[attributeName] = item[attributeName];
      }
    });

    return apify(payload);
  }

  serializeRelationships(item) {
    const payload = {};
    this.relationships.forEach(relationshipName => {
      const relationship = item[relationshipName];
      const data = Array.isArray(relationship)
        ? relationship.map(relatonshipItem => relatonshipItem)
        : relationship;

      payload[relationshipName] = { data };
    });

    return apify(payload);
  }

  get result() {
    return this.payload;
  }
}

export default function (data, options) {
  const serializer = new Serializer(data, options);
  return serializer.result;
}
