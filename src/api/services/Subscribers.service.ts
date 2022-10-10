import { Member } from '@/models/Member.model';
import * as MembersService from '@/api/services/Members.service';

const SUBSCRIBERS_ENDPOINT = 'subscribers';

export const createSubscriber = (subscriber: Member) =>
  MembersService.createMember(subscriber, SUBSCRIBERS_ENDPOINT);

export const updateSubscriber = (subscriber: Member) =>
  MembersService.updateMember(subscriber, SUBSCRIBERS_ENDPOINT);

export const deleteSubscriber = (subscriberId: Member['id']) =>
  MembersService.deleteMember(subscriberId, SUBSCRIBERS_ENDPOINT);
