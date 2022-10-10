export const pages = {
  LOGIN: 'login',
  ANALYTICS: 'analytics',
  DASHBOARD: 'dashboard',
  DASHBOARD_RATE_SHOPPER: 'dashboard-rate-shopper',
  HISTORY: 'history',
  RATES: 'rates',
  INVENTORY: 'inventory',
  CHECKOUT: 'checkout',
  MEMBERS: 'members',
  NOT_SUPPORTED: 'not-supported',
  WIDGET: 'widget',
  WIDGET_NEW: 'widget-new',
  WIDGET_RATE_SHOPPER: 'widget-rate-shopper',
  WIDGET_NEW_RATE_SHOPPER: 'widget-new-rate-shopper',
  PROFILE: 'profile',
  UNSUBSCRIBE: 'unsubscribe',
  RATE_SHOPPER: 'rate-shopper',
  DEALS: 'deals',
  DEAL: 'deal',
  NEW_INQUIRY: 'new-deal',
  INQUIRY: 'inquiry',
  PDF_OFFER: 'pdf-offer',
  PDF_OFFERS: 'pdf-offers',
  OVERVIEW: 'overview',
  DISPLACEMENT: 'displacement',
  PRICE: 'price',
  PRICE_ANALYSIS: 'price-analysis',
  PASSWORD_RESET: 'password-reset',
  NOT_FOUND: '404'
};

export const moduleNameMapping = {
  [pages.OVERVIEW]: 'Overview',
  [pages.DEALS]: 'Deals',
  [pages.DASHBOARD]: 'Analytics',
  [pages.DASHBOARD_RATE_SHOPPER]: 'Rate Shopper',
  [pages.RATE_SHOPPER]: 'Rate Shopper',
  [pages.RATES]: 'Rates',
  [pages.INVENTORY]: 'Inventory',
  [pages.CHECKOUT]: 'Checkout',
  [pages.HISTORY]: 'History',
  [pages.MEMBERS]: 'Members'
};

export const HOME_PAGE = pages.OVERVIEW;

export default Object.values(pages);
