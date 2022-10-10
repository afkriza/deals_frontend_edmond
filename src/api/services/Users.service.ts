import { Member } from '@/models/Member.model';
import * as MembersService from '@/api/services/Members.service';

const USERS_ENDPOINT = 'users';

export const createUser = (user: Member) =>
  MembersService.createMember(user, USERS_ENDPOINT);

export const updateUser = (user: Member) =>
  MembersService.updateMember(user, USERS_ENDPOINT);

export const deleteUser = (userId: Member['id']) =>
  MembersService.deleteMember(userId, USERS_ENDPOINT);
