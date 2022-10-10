import { mapValues } from 'lodash';

export const memberRolesEnum = {
  ADMIN: {
    id: 'admin',
    name: 'Administrator',
    description:
      'Can change rates and inventory for all properties, has access to all modules.'
  },
  MANAGER: {
    id: 'manager',
    name: 'Editor',
    description:
      'Can change rates and inventory for assigned properties, has access to all modules.'
  },
  AVAILABILITY_EDITOR: {
    id: 'availability_editor',
    name: 'Availability Editor',
    description:
      'Can change availability for assigned properties, has access to all modules.'
  },
  SALES: {
    id: 'sales',
    name: 'Sales',
    description: 'Can create inquiries in Deals and use Analytics.'
  },
  STAFF: {
    id: 'staff',
    name: 'Viewer',
    description:
      'Can view rates and inventory for assigned properties, has access to all modules.'
  },
  SUBSCRIBER: {
    id: 'subscriber',
    name: 'Subscriber',
    description: 'Will receive email updates for assgined properties.'
  }
};

export const Roles = mapValues(memberRolesEnum, 'id');
