import Partner from 'models/groups/Partner';
import Room from 'models/groups/Room';
import Budget from 'models/groups/Budget';
import Property from 'models/groups/Property';

import { isoToDate } from 'utils/date';
import { inquiryGridStatusByEvent } from 'enums/groups';
import { deserialize } from './Message';
import DateRange from './DateRange';

export default class Deal {
  constructor({
    id,
    status,
    budget,
    otherExpenses,
    expirationDate,
    dateRanges,
    partner,
    properties,
    rooms,
    inquiryId,
    userId,
    priority,
    comment,
    numberOfChanges,
    messages = []
  }) {
    this.id = id;
    this.status = status;
    this.budget = budget;
    this.otherExpenses = otherExpenses;
    this.expirationDate = expirationDate;
    this.dateRanges = dateRanges;
    this.partner = partner;
    this.properties = properties;
    this.rooms = rooms;
    this.messages = messages;
    this.inquiryId = inquiryId;
    this.userId = userId;
    this.priority = priority;
    this.comment = comment;
    this.numberOfChanges = numberOfChanges;
  }

  static from(deal = {}) {
    return new Deal(deal);
  }

  static deserialize({
    id,
    budget,
    budgetCurrency,
    otherExpenses,
    otherExpensesCurrency,
    expirationDate,
    dateRanges,
    mostRecentEvent,
    partner,
    rooms,
    properties,
    messages,
    inquiry,
    messagesCount
  }) {
    const deal = {
      id,
      budget: Budget.deserialize({
        amount: budget,
        currency: budgetCurrency,
        name: 'Main budget'
      }),
      otherExpenses: Budget.deserialize({
        amount: otherExpenses || null,
        currency: otherExpensesCurrency || 'Euro',
        name: 'Other expenses'
      }),
      expirationDate: isoToDate(expirationDate),
      dateRanges: dateRanges.map(DateRange.deserialize),
      properties: properties.map(Property.deserialize),
      partner: Partner.deserialize(partner || {}),
      rooms: rooms.map(Room.deserialize),
      numberOfChanges: messagesCount
    };

    if (
      mostRecentEvent.event &&
      mostRecentEvent.createdAt &&
      mostRecentEvent.user
    ) {
      deal.status = {
        type: inquiryGridStatusByEvent[mostRecentEvent.event],
        date: isoToDate(mostRecentEvent.createdAt),
        user: mostRecentEvent.user.name
      };
    }

    if (messages) {
      deal.messages = messages.reverse().map(deserialize);
    }

    if (inquiry) {
      deal.inquiryId = inquiry.id;
      deal.userId = inquiry.user.id;
      deal.priority = inquiry.priority;
      deal.comment = inquiry.comment;
    }

    return Deal.from(deal);
  }
}
