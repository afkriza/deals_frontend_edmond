import { filter, map, reverse } from 'lodash';

import { Partner } from 'models/groups/Partner.model';
import Budget from 'models/groups/Budget';
import { deserialize } from 'models/groups/Message';
import Deal from '@/components/groups/new-inquiry/models/Deal.model';
import Offer from '@/components/groups/new-offer/models/Offer.model';

export class DealDetails {
  constructor(params) {
    Object.assign(this, params);
  }

  static from(deal = {}) {
    return new DealDetails(deal);
  }

  static deserialize(
    {
      id,
      budget,
      budgetCurrency,
      otherExpenses,
      otherExpensesCurrency,
      numOfGroups,
      messagesCount,
      partner,
      messages,
      inquiry,
      offers,
      comments,
      status
    },
    configuration
  ) {
    const deal = {
      id,
      inquiry: Deal.deserialize(inquiry, configuration),
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
      partner: Partner.deserialize(partner || {}),
      numberOfChanges: messagesCount,
      numOfGroups,
      offers: map(offers, offer => Offer.deserialize(offer, configuration)),
      comments,
      status
    };

    if (messages) {
      deal.messages = reverse(
        filter(
          map(messages, message => deserialize(message, configuration)),
          Boolean
        )
      );
    }

    if (inquiry) {
      deal.inquiryId = inquiry.id;
      deal.userId = inquiry.user.id;
      deal.priority = inquiry.priority;
      deal.comment = inquiry.comment;
    }

    return DealDetails.from(deal);
  }
}
