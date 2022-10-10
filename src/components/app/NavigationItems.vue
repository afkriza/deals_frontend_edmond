<template>
  <nav :class="$style.navigation">
    <NavigationItem v-if="!isUserSales" :page="pages.OVERVIEW" text="Overview">
      <template #icon="{ isActive }">
        <OverviewIcon :active="isActive" />
      </template>
    </NavigationItem>

    <NavigationItem :page="pages.DEALS" text="Deals">
      <template #icon="{ isActive }">
        <DealsIcon :active="isActive" />
      </template>
    </NavigationItem>

    <!-- Not possible to iterate because of way svgs are being rendered -->
    <NavigationItem :page="pages.ANALYTICS">
      <template #icon="{ isActive }">
        <AnalyticsIcon :active="isActive" />
      </template>

      <div :class="$style.tooltipAnalytics">
        <span :class="[$style.navName, $style.lowered, $style.bold]">
          Analytics
        </span>

        <ButtonCreateNew
          :class="$style.createNewButton"
          text="Create new dashboard"
          @click="onCreateNewViewClick(namespaces.ANALYTICS)"
        />

        <div v-if="dashboardsAnalytics.length" :class="$style.dashboards">
          <NavigationTooltipDashboardsSection
            v-if="privateDashboardsAnalytics.length"
            :class="$style.dashboardsSection"
            :dashboards="privateDashboardsAnalytics"
            :namespace="namespaces.ANALYTICS"
            name="Private"
          >
            <template #dashboard="{ dashboard }">
              <span
                v-if="dashboard.id === defaultDashboardIDAnalytics"
                :class="$style.starIcon"
              >
                <!-- @svg("star-filled") -->
              </span>
            </template>
          </NavigationTooltipDashboardsSection>

          <NavigationTooltipDashboardsSection
            v-if="sortedPublicDashboardsAnalytics.length"
            :class="$style.dashboardsSection"
            :dashboards="sortedPublicDashboardsAnalytics"
            :namespace="namespaces.ANALYTICS"
            name="Public"
          >
            <template #dashboard="{ dashboard }">
              <span
                v-if="dashboard.user.id === currentUser.id"
                :class="$style.ownerBadge"
                >Owner</span
              >
              <span
                v-if="dashboard.id === defaultDashboardIDAnalytics"
                :class="$style.starIcon"
              >
                <!-- @svg("star-filled") -->
              </span>
            </template>
          </NavigationTooltipDashboardsSection>
        </div>
        <span v-else :class="$style.disclaimer">
          No saved dashboard views
        </span>
      </div>
    </NavigationItem>

    <NavigationItem v-if="!isUserSales" :page="pages.RATE_SHOPPER">
      <template #icon="{ isActive }">
        <RateShopperIcon :active="isActive" />
      </template>
      <div :class="$style.tooltipAnalytics">
        <span :class="[$style.navName, $style.lowered, $style.bold]">
          Rate Shopper
        </span>

        <ButtonCreateNew
          :class="$style.createNewButton"
          text="Create new dashboard"
          @click="onCreateNewViewClick(namespaces.RATE_SHOPPER)"
        />

        <div v-if="dashboardsRateShopper.length" :class="$style.dashboards">
          <NavigationTooltipDashboardsSection
            v-if="privateDashboardsRateShopper.length"
            :class="$style.dashboardsSection"
            :dashboards="privateDashboardsRateShopper"
            :namespace="namespaces.RATE_SHOPPER"
            name="Private"
          >
            <template #dashboard="{ dashboard }">
              <span
                v-if="dashboard.id === defaultDashboardIDRateShopper"
                :class="$style.starIcon"
              >
                <!-- @svg("star-filled") -->
              </span>
            </template>
          </NavigationTooltipDashboardsSection>

          <NavigationTooltipDashboardsSection
            v-if="sortedPublicDashboardsRateShopper.length"
            :class="$style.dashboardsSection"
            :dashboards="sortedPublicDashboardsRateShopper"
            :namespace="namespaces.RATE_SHOPPER"
            name="Public"
          >
            <template #dashboard="{ dashboard }">
              <span
                v-if="dashboard.user.id === currentUser.id"
                :class="$style.ownerBadge"
                >Owner</span
              >
              <span
                v-if="dashboard.id === defaultDashboardIDRateShopper"
                :class="$style.starIcon"
              >
                <!-- @svg("star-filled") -->
              </span>
            </template>
          </NavigationTooltipDashboardsSection>
        </div>
        <span v-else :class="$style.disclaimer">
          No saved dashboard views
        </span>
      </div>
    </NavigationItem>

    <NavigationItem v-if="!isUserSales" :page="pages.RATES" text="Rates">
      <template #icon="{ isActive }">
        <RatesIcon :active="isActive" />
      </template>
    </NavigationItem>

    <NavigationItem
      v-if="!isUserSales"
      :page="pages.INVENTORY"
      text="Inventory"
    >
      <template #icon="{ isActive }">
        <InventoryIcon :active="isActive" />
      </template>
    </NavigationItem>

    <NavigationItem
      v-if="!(isUserStaff || isUserSales)"
      :page="pages.CHECKOUT"
      text="Checkout"
    >
      <template #icon="{ isActive }">
        <CheckoutIcon :active="isActive" />
        <div v-if="totalCheckoutData" :class="$style.infoBubble">
          {{ totalCheckoutData }}
        </div>
      </template>
    </NavigationItem>

    <NavigationItem v-if="!isUserSales" :page="pages.HISTORY" text="History">
      <template #icon="{ isActive }">
        <HistoryIcon :active="isActive" />
      </template>
    </NavigationItem>

    <NavigationItem v-if="isUserAdmin" :page="pages.MEMBERS" text="Members">
      <template #icon="{ isActive }">
        <MembersIcon :active="isActive" />
      </template>
    </NavigationItem>

    <NavigationItem :tooltip-height="150">
      <template #icon="{ isActive }">
        <ProfileIcon :active="isActive" />
      </template>
      <DropdownList
        :class="$style.tooltipProfile"
        :custom-item-class="$style.tooltipProfileItem"
        :items="tooltipProfileActions"
        @select="onDropdownActionClick"
      >
        <template #item="{ item }">
          {{ item.name }}
        </template>
      </DropdownList>
    </NavigationItem>
  </nav>
</template>

<script>
  import { sortBy } from 'lodash';
  import { mapGetters } from 'vuex';
  import { pages } from 'enums/pages';
  import NavigationTooltipDashboardsSection from 'components/navigation/NavigationTooltipDashboardsSection';

  import { ANALYTICS, RATE_SHOPPER } from 'constants/namespaces';
  import DealsIcon from '../icons/navigation/DealsIcon';
  import OverviewIcon from '../icons/navigation/OverviewIcon';
  import AnalyticsIcon from '../icons/navigation/AnalyticsIcon';
  import RateShopperIcon from '../icons/navigation/RateShopperIcon';
  import RatesIcon from '../icons/navigation/RatesIcon';
  import HistoryIcon from '../icons/navigation/HistoryIcon';
  import InventoryIcon from '../icons/navigation/InventoryIcon';
  import CheckoutIcon from '../icons/navigation/CheckoutIcon';
  import MembersIcon from '../icons/navigation/MembersIcon';
  import ProfileIcon from '../icons/navigation/ProfileIcon';
  import NavigationItem from '../navigation/NavigationItem';

  import ButtonCreateNew from '@/components/buttons/ButtonCreateNew';
  import DropdownList from '@/components/core/DropdownList';

  export default {
    components: {
      DropdownList,
      ButtonCreateNew,
      NavigationItem,
      DealsIcon,
      OverviewIcon,
      AnalyticsIcon,
      RateShopperIcon,
      RatesIcon,
      InventoryIcon,
      CheckoutIcon,
      HistoryIcon,
      MembersIcon,
      ProfileIcon,
      NavigationTooltipDashboardsSection
    },

    props: {
      currentUser: {
        type: Object,
        required: true
      },

      dashboards: {
        type: Array,
        default: null
      },

      totalCheckoutData: {
        type: Number,
        default: null
      }
    },

    computed: {
      tooltipProfileActions() {
        return [
          this.createDropdownAction('My profile', this.onMyProfileClick),
          this.createDropdownAction(
            'Reset password',
            this.onResetPasswordClick
          ),
          this.createDropdownAction('Log out', this.onLogOutClick)
        ];
      },

      defaultDashboardIDAnalytics() {
        return this.currentUser.defaultAnalyticsDashboard
          ? this.currentUser.defaultAnalyticsDashboard.id
          : null;
      },

      defaultDashboardIDRateShopper() {
        return this.currentUser.defaultRateShopperDashboard
          ? this.currentUser.defaultRateShopperDashboard.id
          : null;
      },

      privateDashboardsAnalytics() {
        return this.dashboardsAnalytics.filter(dashboard => !dashboard.public);
      },

      privateDashboardsRateShopper() {
        return this.dashboardsRateShopper.filter(
          dashboard => !dashboard.public
        );
      },

      publicDashboardsAnalytics() {
        return this.dashboardsAnalytics.filter(dashboard => dashboard.public);
      },

      publicDashboardsRateShopper() {
        return this.dashboardsRateShopper.filter(dashboard => dashboard.public);
      },

      sortedPublicDashboardsAnalytics() {
        return sortBy(this.publicDashboardsAnalytics, ({ user }) =>
          user.id === this.currentUser.id ? 0 : 1
        );
      },

      sortedPublicDashboardsRateShopper() {
        return sortBy(this.publicDashboardsRateShopper, ({ user }) =>
          user.id === this.currentUser.id ? 0 : 1
        );
      },

      dashboardsAnalytics() {
        return this.dashboards.filter(({ domain }) => domain === ANALYTICS);
      },

      dashboardsRateShopper() {
        return this.dashboards.filter(({ domain }) => domain !== ANALYTICS);
      },

      ...mapGetters(['isUserAdmin', 'isUserStaff', 'isUserSales'])
    },

    methods: {
      createDropdownAction(name, handler) {
        return {
          name,
          handler
        };
      },

      onDropdownActionClick({ handler }) {
        handler();
      },

      onMyProfileClick() {
        this.$emit('profileModal:open');
      },

      onCreateNewViewClick(namespace) {
        this.$emit('dashboardModal:open', namespace);
      },

      onLogOutClick() {
        this.$emit('logout');
      },

      onResetPasswordClick() {
        this.$emit('resetPasswordModal:open');
      }
    },

    data() {
      return {
        OverviewIcon,
        AnalyticsIcon,
        RateShopperIcon,
        RatesIcon,
        InventoryIcon,
        CheckoutIcon,
        HistoryIcon,
        MembersIcon,
        ProfileIcon,
        pages,
        namespaces: { ANALYTICS, RATE_SHOPPER }
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .dashboards {
    .dashboards-section {
      &:not(:first-child) {
        margin-top: 16px;
      }

      &:last-child {
        padding-bottom: 8px;
      }
    }
  }

  .navigation-tooltip-button {
    text-transform: none;
    font-weight: normal;
    font-size: inherit;
    color: $color-text-main;
    width: 100%;
    text-align: inherit;
    padding: 15px 16px 13px 16px;
    transition: background-color, 0.2s;

    &:hover {
      background-color: $color-bg-primary-dimmed;
    }

    &:first-child:last-child {
      padding-top: 23px;
      padding-bottom: 24px;
    }
  }

  .create-new-button {
    width: 100%;

    margin: 12px 0;
  }

  .tooltip-analytics {
    min-width: 257px;
  }

  .bold {
    font-weight: bold;
  }

  .navigation {
    padding-top: 18px;
    position: relative;
    flex-grow: 1;
    box-shadow: $navigation-shadow;
  }

  .nav-name {
    display: block;
    margin: 0;
    padding: 8px 15px;
    line-height: 20px;

    &:not(.bold) {
      font-weight: normal;
    }

    &.lowered {
      padding-top: 15px;
      padding-bottom: 8px;
    }
  }

  .tooltip-profile {
    min-width: 208px;

    padding: 8px 0;

    &-item {
      height: 48px;
    }
  }

  .info-bubble {
    position: absolute;
    top: 10px;
    right: 12px;

    line-height: 14px;

    font-size: 10px;
    font-weight: bold;

    padding: 1px 5px;
    border-radius: 10px;

    color: $color-text-light;
    background-color: $color-bg-secondary;
  }

  .disclaimer {
    display: block;
    padding-right: 15px;
    padding-left: 15px;
    margin-bottom: 8px;
    color: $color-text-main-lighter;
  }

  .owner-badge {
    font-size: 10px;

    margin: auto 10px;
    padding: 1px 6px;
    line-height: 14px;

    color: $color-text-main;
    background-color: $color-bg-main-light;

    border-radius: 2px;
  }

  .star-icon {
    margin-left: auto;
    height: 16px;
  }
</style>

<style lang="scss">
  .navigation-tooltip-fade-enter-active,
  .navigation-tooltip-fade-leave-active {
    transition: opacity 0.3s;
  }

  .navigation-tooltip-fade-enter,
  .navigation-tooltip-fade-leave-to {
    opacity: 0;
  }
</style>
