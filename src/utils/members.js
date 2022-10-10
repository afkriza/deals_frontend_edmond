import { memberRolesEnum } from 'enums/member-roles';
import { unitsTableHeaderTypes } from 'enums/units-table-header-types';

export function createHeaderItems(propertyLabels) {
  return [
    ...propertyLabels.map(label => ({
      type: unitsTableHeaderTypes.LABEL.id,
      label
    }))
  ];
}

export function getMemberRoleId(member) {
  return member.role ? member.role.id : memberRolesEnum.SUBSCRIBER.id;
}

export function serializeReports(reports) {
  return reports.map(report => {
    return {
      id: report,
      type: 'reports'
    };
  });
}
