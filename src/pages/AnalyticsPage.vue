<template>
  <div :class="$style.pageWrapper">
    <AppHeader />

    <div :class="$style.emptyState">
      <!-- @svg("emptystate-analytics") -->
      <div :class="$style.emptyStateText">No saved dashboard views.</div>
      <ButtonRegular :class="$style.button" @click="openDashboardModal">
        Create dashboard
      </ButtonRegular>
    </div>

    <DashboardModal
      v-if="isDashboardModalOpen"
      :save-dashboard="saveDashboard"
      :on-cancel="closeDashboardModal"
    />
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex';
  import DashboardModal from 'components/app/DashboardModal';
  import AppHeader from 'components/app/AppHeader';

  import newDashboardCreateMixin from 'mixins/newDashboardCreate';
  import { pages } from 'enums/pages';
  import ButtonRegular from 'components/buttons/ButtonRegular';
  import { snakeCase } from 'lodash';
  import { toastFactory } from '@/utils/toast';
  import { toastTypesEnum } from '@/enums/toast-types';

  export default {
    components: {
      ButtonRegular,
      DashboardModal,
      AppHeader
    },
    mixins: [newDashboardCreateMixin],

    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (
          vm.namespace === pages.ANALYTICS &&
          vm.currentUser.defaultAnalyticsDashboard
        ) {
          next({
            name: pages.DASHBOARD,
            params: {
              id: vm.currentUser.defaultAnalyticsDashboard.id
            }
          });
        } else if (
          vm.namespace === pages.RATE_SHOPPER &&
          vm.currentUser.defaultRateShopperDashboard
        ) {
          next({
            name: pages.DASHBOARD_RATE_SHOPPER,
            params: {
              id: vm.currentUser.defaultRateShopperDashboard.id
            }
          });
        } else {
          next();
        }
      });
    },

    data() {
      return {
        isDashboardModalOpen: false
      };
    },

    computed: {
      ...mapGetters('analytics', ['dashboards']),

      ...mapState({
        dashboard(state, getters) {
          return getters[`${this.namespace}/dashboard`];
        }
      }),

      ...mapGetters(['currentUser'])
    },

    methods: {
      openDashboardModal() {
        this.isDashboardModalOpen = true;
      },

      closeDashboardModal() {
        this.isDashboardModalOpen = false;
      },

      updateToastAndCloseDashboardModal(toast) {
        this.updateToast(toast);
        this.closeDashboardModal();
      },

      createNewDashboard(payload) {
        return this.$store.dispatch(
          `${this.namespace}/createNewDashboard`,
          payload
        );
      },

      saveDashboard(dashboard) {
        dashboard.domain = snakeCase(this.namespace);

        return this.onNewDashboardSubmit(
          dashboard,
          toastFactory('Dashboard created', toastTypesEnum.SUCCESS)
        );
      },

      ...mapActions(['updateCurrentUser', 'updateToast'])
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .page-wrapper {
    background-color: $color-bg-main-dimmed;
  }

  .empty-state {
    @include vertical-center;
    @include flex-center;
    flex-direction: column;

    position: absolute;
    left: 0;
    width: 100%;
  }

  .empty-state-text {
    font-size: 16px;
    line-height: 1.5;

    margin: 34px auto;

    color: $color-text-main-lighter;
    margin-bottom: 60px;
  }

  .button {
    width: 200px;
    height: 48px;
  }
</style>
