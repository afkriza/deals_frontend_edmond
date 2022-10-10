import { assign, cloneDeep, find, map, pick } from 'lodash';
import { EmailReport } from '@/models/EmailReport.model';
import { Role } from '@/models/Role.model';
import { Property } from '@/models/Property.model';
import { MembersConfiguration } from '@/store/modules/members/Members.module';
import { Role as RoleEnum } from '@/enums/Role.enum';
import { SalesDepartment } from '@/models/SalesDepartment.model';

export class Member {
  id?: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  updatedAt?: string;
  defaultAnalyticsDashboardId?: string;
  defaultRateShopperDashboardId?: string;
  defaultAnalyticsFilterSetId?: string;
  defaultRateShopperFilterSetId?: string;
  role?: Role;
  properties?: Property[];
  reports?: EmailReport[];
  salesDepartments?: SalesDepartment[];

  constructor(memberDto: Partial<Member>) {
    assign(this, memberDto);
  }

  setRole(newRole: Role) {
    if (this.role?.id === newRole.id) {
      return;
    }

    if (this.role?.id === RoleEnum.Administrator) {
      this.properties = [];
    }

    if (this.role?.id === RoleEnum.Sales) {
      this.salesDepartments = [];
    }

    switch (newRole.id) {
      case RoleEnum.Administrator:
        this.properties = [];
        break;
      case RoleEnum.Sales:
        this.reports = [];
        break;
    }

    this.role = newRole;
  }

  copy() {
    return Member.create(cloneDeep(this));
  }

  serialize() {
    return {
      ...pick(this, 'id', 'email', 'name', 'firstName', 'lastName'),
      role: this.role.id,
      property: map(this.properties, property => ({
        id: property.id,
        type: 'property'
      })),
      reportMembership: map(this.reports, report => ({
        id: report.id,
        type: 'report'
      })),
      salesDepartments: map(this.salesDepartments, 'id')
    };
  }

  static create(memberDto: Partial<Member>) {
    return new Member(memberDto);
  }

  static deserialize(
    memberDto: Partial<Member>,
    configuration: MembersConfiguration
  ) {
    return new Member({
      ...memberDto,
      salesDepartments: map(memberDto.salesDepartments, department =>
        find(configuration.salesDepartments, ['id', department])
      ),
      role: find(configuration.roles, ['id', memberDto.role])
    });
  }

  static default() {
    return new Member({
      email: '',
      name: '',
      firstName: '',
      lastName: '',
      role: null,
      properties: [],
      reports: [],
      salesDepartments: []
    });
  }
}
