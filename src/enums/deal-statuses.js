import DealOpenIcon from '@/assets/images/icons/Deals/deal-status/deal-open.svg';
import DealFixedIcon from '@/assets/images/icons/Deals/deal-status/deal-fixed.svg';
import DealCancelledIcon from '@/assets/images/icons/Deals/deal-status/deal-cancelled.svg';

export const OPEN = 'open';
export const FIXED = 'fixed';
export const CANCELLED = 'canceled';

export const ALL_DEAL_STATUSES = [OPEN, FIXED, CANCELLED];

export const dealsStatusEnum = {
  [OPEN]: {
    id: 'open',
    label: 'Open',
    icon: DealOpenIcon
  },
  [FIXED]: {
    id: 'fixed',
    label: 'Fixed',
    icon: DealFixedIcon
  },
  [CANCELLED]: {
    id: 'canceled',
    label: 'Canceled',
    icon: DealCancelledIcon
  }
};
