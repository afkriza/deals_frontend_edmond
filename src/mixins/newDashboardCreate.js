import { pages } from 'enums/pages';
import { ANALYTICS } from 'constants/namespaces';
import namespacedMixin from 'mixins/namespaced';
import { navigate } from 'utils/navigation';

export default {
  mixins: [namespacedMixin],

  methods: {
    handleDefaultDashboardUpdate(domain) {
      const data = {
        ...this.currentUser
      };

      const dashboard = { id: this.dashboard.id };
      if (domain === ANALYTICS) {
        data.defaultAnalyticsDashboard = dashboard;
      } else {
        data.defaultRateShopperDashboard = dashboard;
      }

      return this.updateCurrentUser(data);
    },

    async onNewDashboardSubmit(dashboard, toast) {
      return this.createNewDashboard(dashboard)
        .then(() => {
          return dashboard.default
            ? this.handleDefaultDashboardUpdate(dashboard.domain)
            : this.updateToastAndCloseDashboardModal(toast);
        })
        .then(() => {
          if (dashboard.default) {
            this.updateToastAndCloseDashboardModal(toast);
          }
        })
        .then(() => {
          this.navigateToActiveDashboard(dashboard.domain);
        });
    },

    navigateToActiveDashboard(domain) {
      return navigate(this.$router, {
        name:
          domain === ANALYTICS ? pages.DASHBOARD : pages.DASHBOARD_RATE_SHOPPER,
        params: {
          id: this.dashboard.id
        }
      });
    }
  }
};
