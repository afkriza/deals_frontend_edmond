import { memberRolesEnum } from 'enums/member-roles';
import { includes } from 'lodash';

export default {
  isAuthenticated(state, getters) {
    return Boolean(getters.currentUser);
  },

  currentUser(state) {
    return state.session.user;
  },

  fullscreen(state) {
    return state.fullscreen;
  },

  noPadding(state) {
    return state.noPadding;
  },

  session(state) {
    return state.session;
  },

  isLoadingUser(state) {
    return state.forms.user.isLoading;
  },

  isLoadingPasswordResetRequest(state) {
    return state.forms.passwordResetRequest.isLoading;
  },

  isLoadingPagePasswordResetRequest(state) {
    return state.forms.passwordPageResetRequest.isLoading;
  },

  isUserAdmin(state) {
    return (
      state.session.user &&
      state.session.user.role.id === memberRolesEnum.ADMIN.id
    );
  },

  isUserStaff(state) {
    return (
      state.session.user &&
      state.session.user.role.id === memberRolesEnum.STAFF.id
    );
  },
  isUserSales(state) {
    return (
      state.session.user &&
      state.session.user.role.id === memberRolesEnum.SALES.id
    );
  },
  hasAccess(state) {
    return (...roles) => includes(roles, state.session.user.role.id);
  },

  showLoader(state) {
    return (
      state.areFiltersLoading ||
      // state.forms.user.isLoading ||
      state.forms.passwordResetRequest.isLoading ||
      state.rates.rates.isLoading ||
      // state.rates.filters.isLoading ||
      state.inventory.inventory.isLoading ||
      // state.inventory.filters.isLoading ||
      state.checkout.isDataSaving ||
      // state.history.filters.isLoading ||
      state.history.history.isLoading ||
      // state.members.members.isLoading ||
      // state.analytics.filters.isLoading ||
      state.analytics.dashboards.isLoading ||
      state.analytics.dashboard.isLoading ||
      state.analytics.widgetCategories.isLoading ||
      state.analytics.widget.isLoading ||
      state['rate-shopper'].dashboard.isLoading ||
      state['rate-shopper'].widgetCategories.isLoading ||
      state['rate-shopper'].widget.isLoading
      // state.groups.deals.isLoading ||
      // state.groups.groupsConfiguration.isLoading ||
      // state.groups.deal.isLoading
    );
  },

  showLazyLoader(state) {
    return state.history.history.isLazyLoading;
  },

  toasts(state) {
    return state.toasts;
  }
};
