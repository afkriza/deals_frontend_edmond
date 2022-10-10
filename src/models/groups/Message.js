import Deal from '@/components/groups/new-inquiry/models/Deal.model';
import Offer from '@/components/groups/new-offer/models/Offer.model';

import { isoToDate } from 'utils/date';

export default class Message {
  constructor({ id, type, createdAt, user }) {
    this.id = id;
    this.type = type;
    this.createdAt = isoToDate(createdAt);
    this.user = user;
  }

  get component() {
    throw new Error('Component getter not implemented!');
  }
}

export class SubmittedRequestMessage extends Message {
  constructor({ id, type, createdAt, user, deal }) {
    super({ id, type, createdAt, user });
    this.deal = deal;
  }

  get component() {
    return 'DealCreatedCard';
  }

  static from(message = {}) {
    return new SubmittedRequestMessage(message);
  }

  static deserialize(
    { id, type, createdAt, user, inquiry: deal },
    configuration
  ) {
    if (!configuration) {
      throw new Error('SubmittedRequestMessage configuration missing');
    }

    return SubmittedRequestMessage.from({
      id,
      type,
      createdAt,
      user,
      deal: Deal.deserialize(deal, configuration)
    });
  }
}

export class SentOfferMessage extends Message {
  constructor({ id, type, createdAt, user, offer }) {
    super({ id, type, createdAt, user });
    this.offer = offer;
  }

  get component() {
    return 'NewOfferCard';
  }

  static from(message = {}) {
    return new SentOfferMessage(message);
  }

  static deserialize({ id, type, createdAt, user, offer }, configuration) {
    return SentOfferMessage.from({
      id,
      type,
      createdAt,
      user,
      offer: Offer.deserialize(offer, configuration)
    });
  }
}

export class CommentMessage extends Message {
  constructor({ id, type, createdAt, user, comment }) {
    super({ id, type, createdAt, user });
    this.comment = comment;
  }

  get component() {
    return 'CommentCard';
  }

  static from(message = {}) {
    return new CommentMessage(message);
  }

  static deserialize({ id, type, createdAt, user, comment }) {
    return CommentMessage.from({
      id,
      type,
      createdAt,
      user,
      comment: comment.comment
    });
  }
}

const messageCtorByType = {
  // changed_inquiry: ChangedRequestMessage,
  sent_offer: SentOfferMessage,
  // declined: StatusOfferMessage,
  // canceled: StatusOfferMessage,
  // accepted: StatusOfferMessage,
  comment_added: CommentMessage,
  submitted_inquiry: SubmittedRequestMessage
};

export function deserialize(message, configuration) {
  const messageId = message.id;
  const actualType = messageId.replace(/\d/g, '');

  const MessageCtor = messageCtorByType[actualType];

  if (!MessageCtor) {
    return null;
  }

  return MessageCtor.deserialize(message, configuration);
}
