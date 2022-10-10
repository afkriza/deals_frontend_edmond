const CHANGED = 'changed';
const INACTIVE = 'inactive';
const NEGATIVE = 'negative';
const POSITIVE = 'positive';

export const ALL_INQUIRIES_GRID_TYPES = [CHANGED, INACTIVE, NEGATIVE, POSITIVE];

export const requestTypes = {
  submitted_request: {
    title: 'Submitted request',
    type: CHANGED
  },
  sent_offer: {
    title: 'Sent offer',
    type: CHANGED
  },
  changed_request: {
    title: 'Changed request',
    type: CHANGED
  },
  declined_request: {
    title: 'Declined request',
    type: NEGATIVE
  },
  closed_request: {
    title: 'Closed request',
    type: POSITIVE,
    canReopen: true
  },
  request_expired: {
    title: 'Request expired',
    type: INACTIVE,
    canReopen: true
  }
};

export const dealStatusTypesArray = ['canceled', 'declined', 'accepted'];

export const dealAvailableStatusTypes = {
  CANCELED: dealStatusTypesArray[0],
  DECLINED: dealStatusTypesArray[1],
  ACCEPTED: dealStatusTypesArray[2]
};

export const statusTypes = {
  canceled: {
    title: 'Offer canceled',
    type: NEGATIVE
  },
  declined: {
    title: 'Offer declined',
    type: NEGATIVE
  },
  accepted: {
    title: 'Offer accepted',
    type: POSITIVE
  }
};

// TODO update deal statuses
const CHANGES_REQUESTED = 'Changes requested';
const NEW = 'New';
const OFFER_PROPOSED = 'Offer proposed';
const CANCELED = 'Canceled';
const DECLINED = 'Declined';
const ACCEPTED = 'Accepted';
const EXPIRED = 'Expired';
const COMMENT_ADDED = 'Comment';

export const inquiryGridStatusByEventArray = [
  CHANGES_REQUESTED,
  NEW,
  OFFER_PROPOSED,
  CANCELED,
  DECLINED,
  ACCEPTED,
  EXPIRED,
  COMMENT_ADDED
];

export const inquiryGridStatusByEvent = {
  update: inquiryGridStatusByEventArray[0],
  create: inquiryGridStatusByEventArray[1],
  offer_proposed: inquiryGridStatusByEventArray[2],
  canceled: inquiryGridStatusByEventArray[3],
  declined: inquiryGridStatusByEventArray[4],
  accepted: inquiryGridStatusByEventArray[5],
  expired: inquiryGridStatusByEventArray[6],
  comment_added: inquiryGridStatusByEventArray[7]
};

// TODO: update deal statuses and icons
export const inquiryGridStatusIconsByEvent = {
  update: 'NewDealIcon',
  create: 'NewDealIcon',
  offer_proposed: 'OptionProposedIcon',
  canceled: 'CanceledDealIcon',
  declined: 'NewDealIcon',
  accepted: 'AcceptedDealIcon',
  expired: 'NewDealIcon',
  comment_added: 'NewDealIcon'
};

export const inquiryGridStatusTypeByEvent = {
  update: CHANGED,
  create: CHANGED,
  offer_proposed: CHANGED,
  canceled: NEGATIVE,
  declined: NEGATIVE,
  accepted: POSITIVE,
  expired: INACTIVE,
  comment_added: CHANGED
};

export const requestVariables = [
  'partner',
  'date_ranges',
  'rooms',
  'properties',
  'budget'
];

export const iconsByVariables = {
  partner: 'PartnerIcon',
  date_ranges: 'DateRangeIcon',
  rooms: 'RoomsIcon',
  properties: 'PropertiesIcon',
  budget: 'BudgetIcon',
  expiration_date: 'ExpirationDateIcon',
  note: 'NoteIcon'
};

export const SAME = 'SAME';
export const SIMILAR = 'SIMILAR';
export const ALL = 'ALL';

export const propertyEnum = {
  [SAME]: 'Same property',
  [SIMILAR]: 'Similar properties',
  [ALL]: 'All properties'
};

export const partnerEnum = {
  [SAME]: 'Same partner',
  [SIMILAR]: 'Similar partners',
  [ALL]: 'All partners'
};

export const monthEnum = {
  [SAME]: 'Same as date range',
  [SIMILAR]: 'Similar months',
  [ALL]: 'All months'
};

export const priceAnalysisEnum = [ALL, SIMILAR, SAME];

export const MONTH = 'MONTH';
export const PROPERTY = 'PROPERTY';
export const PARTNER = 'PARTNER';
