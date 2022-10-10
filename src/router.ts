import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { intersection, without } from 'lodash';

const LoginPage = () => import('@/pages/LoginPage.vue');
const AnalyticsPage = () => import('@/pages/AnalyticsPage.vue');
const HistoryPage = () => import('@/pages/HistoryPage.vue');
const RatesPage = () => import('@/pages/RatesPage.vue');
const InventoryPage = () => import('@/pages/InventoryPage.vue');
const CheckoutPage = () => import('@/pages/CheckoutPage.vue');
const MembersPage = () => import('@/pages/MembersPage.vue');
const PasswordPage = () => import('@/pages/PasswordPage.vue');
const PasswordResetPage = () => import('@/pages/PasswordResetPage.vue');
const NotFoundPage = () => import('@/pages/NotFoundPage.vue');
const NotSupportedPage = () => import('@/pages/NotSupportedPage.vue');
const UnsubscribePage = () => import('@/pages/UnsubscribePage.vue');
const OverviewPage = () => import('@/pages/OverviewPage.vue');
const DealsPage = () => import('@/pages/DealsPage.vue');
const DealPage = () => import('@/pages/DealPage.vue');
const PriceAnalysisPage = () => import('@/pages/PriceAnalysisPage.vue');
const NewDealPage = () => import('@/pages/NewDealPage.vue');
const DashboardAnalyticsPage = () =>
  import('@/pages/DashboardAnalyticsPage.vue');
const DashboardRateShopperPage = () =>
  import('@/pages/DashboardRateShopperPage.vue');
const PdfOfferPage = () => import('@/pages/PdfOfferPage.vue');
const PdfOffersPage = () => import('@/pages/PdfOffersPage.vue');

import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/SettingsLayout.vue';

import store from '@/store';

import { memberRolesEnum } from '@/enums/member-roles';
import { pages, HOME_PAGE } from '@/enums/pages';
import { isInternetExplorer } from '@/utils/browser';
import { UNAUTHENTICATED_REQUEST } from '@/store/mutation-types';
import DealLayout from './layouts/DealLayout.vue';
import { Role } from '@/enums/Role.enum';

Vue.use(VueRouter);

const ALL_ROLES = [
  Role.Admin,
  Role.Manager,
  Role.AvailabilityEditor,
  Role.Sales,
  Role.Staff
];

const ALL_ROLES_EXCEPT_STAFF = without(ALL_ROLES, Role.Staff);
const ALL_ROLES_EXCEPT_SALES = without(ALL_ROLES, Role.Sales);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: AppLayout,
    meta: {
      authenticatedRoute: true,
      permissions: ALL_ROLES
    },
    children: [
      {
        path: '',
        name: pages.HOME
      },
      {
        path: '/analytics/dashboard/:id',
        name: pages.DASHBOARD,
        component: DashboardAnalyticsPage,
        props: true
      },
      {
        path: '/analytics',
        component: AnalyticsPage,
        name: pages.ANALYTICS,
        beforeEnter(to, from, next) {
          if (store.state.session.user.defaultAnalyticsDashboard) {
            return next({
              name: pages.DASHBOARD,
              params: {
                id: store.state.session.user.defaultAnalyticsDashboard.id
              }
            });
          }

          return next();
        }
      },
      {
        path: '/rate-shopper/dashboard/:id',
        name: pages.DASHBOARD_RATE_SHOPPER,
        component: DashboardRateShopperPage,
        props: true,
        meta: {
          permissions: ALL_ROLES_EXCEPT_SALES
        }
      },
      {
        path: '/rate-shopper',
        component: AnalyticsPage,
        name: pages.RATE_SHOPPER,
        beforeEnter(to, from, next) {
          if (store.state.session.user.defaultRateShopperDashboard) {
            return next({
              name: pages.DASHBOARD_RATE_SHOPPER,
              params: {
                id: store.state.session.user.defaultRateShopperDashboard.id
              }
            });
          }

          return next();
        },
        meta: {
          permissions: ALL_ROLES_EXCEPT_SALES
        }
      },
      {
        path: '/history',
        component: HistoryPage,
        name: pages.HISTORY,
        meta: {
          permissions: ALL_ROLES_EXCEPT_SALES
        }
      },
      {
        path: '/rates',
        component: RatesPage,
        name: pages.RATES,
        meta: {
          permissions: ALL_ROLES_EXCEPT_SALES
        }
      },
      {
        path: '/inventory',
        component: InventoryPage,
        name: pages.INVENTORY,
        meta: {
          permissions: ALL_ROLES_EXCEPT_SALES
        }
      },
      {
        path: '/checkout',
        component: CheckoutPage,
        name: pages.CHECKOUT,
        meta: {
          permissions: intersection(
            ALL_ROLES_EXCEPT_SALES,
            ALL_ROLES_EXCEPT_STAFF
          )
        }
      },
      {
        path: '/members',
        component: MembersPage,
        name: pages.MEMBERS,
        meta: {
          permissions: [Role.Admin]
        }
      },
      {
        path: '/overview',
        component: OverviewPage,
        name: pages.OVERVIEW,
        meta: {
          permissions: ALL_ROLES_EXCEPT_SALES
        }
      },
      {
        path: '/deals',
        component: DealsPage,
        name: pages.DEALS,
        props: true
      },
      {
        path: '/deals/:dealId',
        component: DealLayout,
        props: true,
        children: [
          {
            path: '',
            component: DealPage,
            name: pages.DEAL,
            props: true
          },
          {
            path: 'offers/:offerId/pdfs',
            name: pages.PDF_OFFERS,
            component: PdfOffersPage,
            props: true,
            meta: {
              permissions: [Role.Admin, Role.Sales]
            }
          },
          {
            path: 'offers/:offerId/pdfs/:pdfOfferId',
            name: pages.PDF_OFFER,
            component: PdfOfferPage,
            props: true,
            meta: {
              permissions: [Role.Admin, Role.Sales]
            }
          }
        ]
      },
      {
        path: '/new-deal',
        name: pages.NEW_INQUIRY,
        component: NewDealPage,
        meta: {
          permissions: [Role.Admin, Role.Sales]
        }
      }
    ]
  },
  {
    path: '/',
    component: SettingsLayout,
    children: [
      {
        path: '/unsubscribe',
        component: UnsubscribePage,
        name: pages.UNSUBSCRIBE
      },
      {
        path: '/user/password',
        component: PasswordPage,
        name: pages.PASSWORD
      }
    ]
  },
  {
    path: '/price-analysis',
    component: PriceAnalysisPage,
    name: pages.PRICE_ANALYSIS,
    props: route => route.query,
    meta: {
      authenticatedRoute: true,
      permissions: [Role.Admin, Role.Manager]
    }
  },
  {
    path: '/login',
    component: LoginPage,
    name: pages.LOGIN
  },
  {
    path: '/not-supported',
    component: NotSupportedPage,
    name: pages.NOT_SUPPORTED
  },
  {
    path: '/password-reset',
    component: PasswordResetPage,
    name: pages.PASSWORD_RESET,
    props: route => ({ token: route.query['reset_password_token'] })
  },
  {
    path: '*',
    component: NotFoundPage,
    name: pages.NOT_FOUND
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

function redirectToHomePage(next) {
  if (store.state.session.user.role.id === memberRolesEnum.SALES.id) {
    return next({
      name: pages.DEALS
    });
  }
  return next({
    name: HOME_PAGE
  });
}

router.beforeEach(async (to, from, next) => {
  if (to.name !== pages.NOT_SUPPORTED && isInternetExplorer) {
    return next({
      name: pages.NOT_SUPPORTED
    });
  }

  if (to.matched.some(route => route.meta.authenticatedRoute)) {
    if (!store.getters.isAuthenticated) {
      try {
        await store.dispatch('checkSession');
      } catch (error) {
        store.commit(UNAUTHENTICATED_REQUEST, to.fullPath);

        return next({
          name: pages.LOGIN
        });
      }
    }

    if (!store.state.checkout.localDatabaseLoaded) {
      await store.dispatch('checkout/loadData');
    }

    if (
      to.meta.permissions &&
      !store.getters.hasAccess(...to.meta.permissions)
    ) {
      return next({
        name: pages.NOT_FOUND
      });
    }

    if (to.name === pages.HOME) {
      return redirectToHomePage(next);
    }
  }

  return next();
});

export default router;
