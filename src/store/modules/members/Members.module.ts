import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { get, keyBy, map, partial, without } from 'lodash';
import { Role } from '@/models/Role.model';
import { Role as RoleEnum } from '@/enums/Role.enum';
import { EmailReport } from '@/models/EmailReport.model';
import { Property } from '@/models/Property.model';
import { Member } from '@/models/Member.model';
import * as MembersService from '@/api/services/Members.service';
import * as SubscribersService from '@/api/services/Subscribers.service';
import * as UsersService from '@/api/services/Users.service';
import { MembersFilter } from '@/api/services/Members.service';
import { SalesDepartment } from '@/models/SalesDepartment.model';

export type MembersConfiguration = {
  properties: Property[];
  roles: Role[];
  emailReports: EmailReport[];
  salesDepartments: SalesDepartment[];
};

type MembersDto = {
  members: Member[];
  hasMore: boolean;
};

class MembersCollection {
  private memberIds: Array<Member['id']> = [];
  private membersById: Record<Member['id'], Member> = {};

  hasMoreToLoad = false;

  get members() {
    return map(this.memberIds, partial(get, this.membersById));
  }

  setMembers(members: Member[], hasMoreToLoad: boolean) {
    this.memberIds = map(members, 'id');
    this.membersById = keyBy(members, 'id');

    this.hasMoreToLoad = hasMoreToLoad;
  }

  addMembers(members: Member[], hasMoreToLoad: boolean) {
    this.setMembers([...this.members, ...members], hasMoreToLoad);
  }

  editMember(member: Member) {
    this.membersById = { ...this.membersById, [member.id]: member };
  }

  deleteMember(memberId: Member['id']) {
    this.memberIds = without(this.memberIds, memberId);
  }

  static create() {
    return new MembersCollection();
  }
}

@Module({
  name: 'members',
  namespaced: true
})
export default class MembersModule extends VuexModule {
  membersCollection: MembersCollection = MembersCollection.create();
  configuration: MembersConfiguration = null;

  get members() {
    return this.membersCollection.members;
  }

  get areMembersFullyLoaded() {
    return !this.membersCollection.hasMoreToLoad;
  }

  get isConfigurationLoaded() {
    return Boolean(this.configuration);
  }

  @Mutation
  SET_CONFIGURATION(configuration: MembersConfiguration) {
    this.configuration = configuration;
  }

  @Mutation
  SET_MEMBERS({ members, hasMore }: MembersDto) {
    this.membersCollection.setMembers(members, hasMore);
  }

  @Mutation
  ADD_MEMBERS({ members, hasMore }: MembersDto) {
    this.membersCollection.addMembers(members, hasMore);
  }

  @Mutation
  EDIT_MEMBER(member: Member) {
    this.membersCollection.editMember(member);
  }

  @Mutation
  DELETE_MEMBER(memberId: Member['id']) {
    this.membersCollection.deleteMember(memberId);
  }

  @Action({ rawError: true })
  async fetchMembers(filters: MembersFilter): Promise<MembersDto> {
    const { members, hasMore } = await MembersService.fetchMembers(filters);

    return {
      hasMore,
      members: map(members, member =>
        Member.deserialize(member, this.configuration)
      )
    };
  }

  @Action({ rawError: true })
  createMember(memberDto: Member) {
    return memberDto.role.id === RoleEnum.Subscriber
      ? SubscribersService.createSubscriber(memberDto)
      : UsersService.createUser(memberDto);
  }

  @Action({ rawError: true })
  async editMember({
    newMember,
    oldMember
  }: {
    newMember: Member;
    oldMember: Member;
  }) {
    if (newMember.role.id === RoleEnum.Subscriber) {
      if (oldMember.role.id !== RoleEnum.Subscriber) {
        await UsersService.deleteUser(newMember.id);

        return SubscribersService.createSubscriber(newMember);
      }

      return SubscribersService.updateSubscriber(newMember);
    } else if (oldMember.role.id === RoleEnum.Subscriber) {
      await SubscribersService.deleteSubscriber(newMember.id);

      return UsersService.createUser(newMember);
    }

    return UsersService.updateUser(newMember);
  }

  @Action({ rawError: true })
  async deleteMember(member: Member) {
    await (member.role.id === RoleEnum.Subscriber
      ? SubscribersService.deleteSubscriber(member.id)
      : UsersService.deleteUser(member.id));

    this.DELETE_MEMBER(member.id);
  }

  @Action({ rawError: true })
  async loadConfiguration() {
    if (this.isConfigurationLoaded) {
      return;
    }

    const { data: configurationDto } =
      await MembersService.fetchMembersConfiguration();

    const configuration: MembersConfiguration = {
      emailReports: configurationDto[0].options,
      roles: configurationDto[1].options,
      properties: configurationDto[2].options,
      salesDepartments: configurationDto[3].options
    };

    this.SET_CONFIGURATION(configuration);
  }
}
