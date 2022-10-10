<template>
  <div>
    <div :class="$style.navPlaceholder" />
    <section :class="$style.sectionWrapper">
      <div :class="$style.section">
        <Logo />
        <NavigationItems
          :current-user="currentUser"
          :dashboards="dashboards"
          :total-checkout-data="totalCheckoutData"
          @dashboardModal:open="openDashboardModal"
          @logout="showLogoutModal"
          @profileModal:open="openModal('profile')"
          @resetPasswordModal:open="openModal('resetPassword')"
        />
      </div>
    </section>
    <EditProfileModal
      v-if="isProfileModalOpen"
      :user="currentUser"
      :loading="isLoadingUser"
      :errors="errors"
      @submit="onEditProfileSubmit"
      @close="closeModal"
    />

    <DashboardModal
      v-if="isDashboardModalOpen"
      :save-dashboard="saveDashboard"
      :on-cancel="closeModal"
    />

    <ResetPasswordModal
      v-if="isResetPasswordModalOpen"
      :email="currentUser.email"
      :loading="isLoadingPasswordResetRequest"
      :errors="errors"
      @submit="onResetPasswordRequestSubmit"
      @close="closeModal"
    />

    <LogoutModal
      v-if="isLogoutModalOpen"
      @close="onLogoutModalClose"
      @submit="onLogoutModalSubmit"
    />
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex';
  import { snakeCase } from 'lodash';

  import DashboardModal from 'components/app/DashboardModal';
  import LogoutModal from 'components/modals/LogoutModal';
  import EditProfileModal from 'components/app/EditProfileModal';
  import Logo from 'components/app/Logo';
  import NavigationItems from 'components/app/NavigationItems';
  import ResetPasswordModal from 'components/app/ResetPasswordModal';

  import { pages } from 'enums/pages';
  import { toastFactory } from 'utils/toast';
  import { toastTypesEnum } from 'enums/toast-types';

  import newDashboardCreateMixin from 'mixins/newDashboardCreate';
  import { navigate } from 'utils/navigation';
  import { Roles } from '@/enums/member-roles';

  export default {
    components: {
      EditProfileModal,
      Logo,
      NavigationItems,
      DashboardModal,
      LogoutModal,
      ResetPasswordModal
    },
    mixins: [newDashboardCreateMixin],

    data() {
      return {
        currentOpenModal: '',
        isProfileDropdownOpen: false,
        isLogoutModalOpen: false,
        dashboardNamespace: '',
        errors: {}
      };
    },

    computed: {
      isDashboardModalOpen() {
        return this.currentOpenModal === 'dashboard';
      },

      isProfileModalOpen() {
        return this.currentOpenModal === 'profile';
      },

      isResetPasswordModalOpen() {
        return this.currentOpenModal === 'resetPassword';
      },

      totalCheckoutData() {
        return this.rates.length + this.inventory.length;
      },

      ...mapGetters([
        'currentUser',
        'isLoadingUser',
        'isLoadingPasswordResetRequest',
        'hasAccess'
      ]),

      ...mapGetters('analytics', ['dashboards', 'isDashboardsLoaded']),

      ...mapState({
        dashboard(state, getters) {
          return getters[`${this.dashboardNamespace}/dashboard`];
        }
      }),

      ...mapGetters('checkout', ['rates', 'inventory'])
    },

    created() {
      if (!this.isDashboardsLoaded) {
        if (this.hasAccess(Roles.SALES)) {
          return this.fetchDashboards('analytics');
        }
        this.fetchDashboards();
      }
    },

    methods: {
      openProfileDropdown() {
        this.isProfileDropdownOpen = true;
      },

      closeProfileDropdown() {
        this.isProfileDropdownOpen = false;
      },

      openModal(modal) {
        this.currentOpenModal = modal;
      },

      closeModal() {
        this.currentOpenModal = '';
      },

      openDashboardModal(namespace) {
        this.dashboardNamespace = namespace;
        this.openModal('dashboard');
      },

      async onEditProfileSubmit(data) {
        try {
          await this.updateCurrentUser(data);

          this.updateToast(
            toastFactory('Profile updated', toastTypesEnum.SUCCESS)
          );
          this.closeModal('profile');

          this.errors = {};
        } catch (messages) {
          this.errors = { messages, data };
        }
      },

      updateToastAndCloseDashboardModal(toast) {
        this.updateToast(toast);
        this.closeModal('profile');
      },

      onLogoutModalClose() {
        this.isLogoutModalOpen = false;
      },

      async onLogoutModalSubmit() {
        await navigate(this.$router, {
          name: pages.LOGIN
        });

        this.logout();
      },

      showLogoutModal() {
        this.isLogoutModalOpen = true;
      },

      createNewDashboard(payload) {
        return this.$store.dispatch(
          `${payload.domain.replace('_', '-')}/createNewDashboard`,
          payload
        );
      },

      ...mapActions('analytics', ['fetchDashboards']),

      async onResetPasswordRequestSubmit(data) {
        try {
          await this.resetPasswordRequest(data);

          this.updateToast(
            toastFactory('Reset password request sent', toastTypesEnum.SUCCESS)
          );
          this.closeModal('resetPassword');

          this.errors = {};
        } catch (messages) {
          this.errors = { messages, data };
        }
      },

      saveDashboard(dashboard) {
        dashboard.domain = snakeCase(this.dashboardNamespace);

        return this.onNewDashboardSubmit(
          dashboard,
          toastFactory('Dashboard created', toastTypesEnum.SUCCESS)
        );
      },

      ...mapActions([
        'logout',
        'updateCurrentUser',
        'updateToast',
        'resetPasswordRequest'
      ])
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .nav-placeholder {
    width: $navigation-width;
  }

  .section-wrapper {
    position: fixed;
    z-index: $z-navigation;
    left: 0;

    flex-shrink: 0;
    width: $navigation-width;
    height: 100vh;

    border-bottom: 1px solid $color-border-main;
    background-color: $color-bg-light;
  }

  .section {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .bold {
    font-weight: bold;
  }
</style>
