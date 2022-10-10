import { mapValues, groupBy, keyBy, get } from 'lodash';
import { deapify } from '@/api/json-api/apify';

class Deserializer {
  constructor(response) {
    this.response = response;
    this.payload = {};

    this.data = deapify(this.response.data);
    this.included = deapify(this.response.included);
    this.meta = deapify(this.response.meta);
    this.links = deapify(this.response.links);

    this.includedByTypeAndId = mapValues(
      groupBy(response.included, 'type'),
      values => keyBy(values, 'id')
    );

    this.deserialize();
  }

  deserializeAttributes(data) {
    const payload = {};
    let relationshipPayload = {};
    const attributes = data.attributes || {};
    Object.keys(attributes).forEach(key => {
      payload[key] = attributes[key];
    });

    if (data.relationships) {
      relationshipPayload = this.deserializeRelationships(data);
    }

    return { ...payload, ...relationshipPayload };
  }

  deserializeRelationships(data) {
    const payload = {};
    const relationships = data.relationships || {};
    Object.keys(relationships).forEach(key => {
      const relationship = relationships[key].data;
      if (Array.isArray(relationship)) {
        payload[key] = relationship.map(
          this.deserializeRelationship.bind(this)
        );
      } else {
        payload[key] = this.deserializeRelationship(relationship);
      }
    });
    return payload;
  }

  deserializeRelationship(relationship) {
    if (relationship === null) {
      return null;
    }

    const record = get(this.includedByTypeAndId, [
      relationship.type,
      relationship.id
    ]);

    if (record) {
      return this.deserializeIncludedModel(record);
    }

    return {
      id: relationship.id,
      resourceType: relationship.type
    };
  }

  deserializeIncludedModel(model) {
    return {
      ...this.deserializeAttributes(model),
      id: model.id,
      resourceType: model.type
    };
  }

  deserialize() {
    if (this.data) {
      if (Array.isArray(this.data)) {
        this.payload.data = this.data.map(item => this.deserializeData(item));
      } else {
        this.payload.data = this.deserializeData(this.data);
      }
    }

    if (this.meta) {
      this.deserializeMeta();
    }

    if (this.links) {
      this.deserializeLinks();
    }
  }

  deserializeMeta() {
    this.payload.meta = {};
    Object.keys(this.meta).forEach(key => {
      this.payload.meta[key] = this.meta[key];
    });
  }

  deserializeLinks() {
    this.payload.links = {};
    Object.keys(this.links).forEach(key => {
      this.payload.links[key] = this.links[key];
    });
  }

  deserializeData(data) {
    return {
      ...this.deserializeAttributes(data),
      ...this.deserializeRelationships(data),
      id: data.id,
      resourceType: data.type
    };
  }

  get result() {
    return deapify(this.payload);
  }
}

export default function (response) {
  const deserializer = new Deserializer(response);
  return deserializer.result;
}
