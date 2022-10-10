import httpClient from '@/api/http-client';
import serialize from '@/api/json-api/serializer';

import { Role } from '@/enums/Role.enum';
import { Member } from '@/models/Member.model';

const MEMBERS_ENDPOINT = 'members';

export type MembersFilter = {
  filter: {
    property?: string;
    role?: 'all' | Role;
  };
  createdAfter?: string;
};

type MembersResponse = {
  data: Member[];
  meta: { hasMore: boolean };
};

export const fetchMembers = async (filters?: MembersFilter) => {
  const { data, meta }: MembersResponse = await httpClient.get(
    MEMBERS_ENDPOINT,
    {
      params: filters
    }
  );

  return {
    members: data,
    hasMore: meta.hasMore
  };
};

export const createMember = async (member: Member, namespace) => {
  return httpClient.post(
    namespace,
    serialize(member.serialize(), {
      attributes: [
        'firstName',
        'email',
        'lastName',
        'role',
        'salesDepartments'
      ],
      relationships: ['property', 'reportMembership']
    })
  );
};

export const updateMember = (
  member: Member,
  namespace: 'subscribers' | 'users'
) => {
  const relationshipKeys = [
    'defaultAnalyticsDashboard',
    'defaultRateShopperDashboard',
    'defaultAnalyticsFilterSet',
    'defaultRateShopperFilterSet',
    'property',
    'reportMembership'
  ];

  const memberSerialized = member.serialize();
  const structure = Object.keys(memberSerialized).reduce(
    (structure, key) => {
      if (relationshipKeys.includes(key)) {
        structure.relationships.push(key);
      } else {
        structure.attributes.push(key);
      }

      return structure;
    },
    {
      attributes: [],
      relationships: []
    }
  );

  return httpClient.put(
    `${namespace}/${member.id}`,
    serialize(memberSerialized, structure)
  );
};

export const deleteMember = (
  id: Member['id'],
  namespace: 'subscribers' | 'users'
) => httpClient.delete(`${namespace}/${id}`);

export const fetchMembersConfiguration = () =>
  httpClient.get(`${MEMBERS_ENDPOINT}/configuration`);
