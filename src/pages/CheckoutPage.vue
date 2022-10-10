<template>
  <article>
    <CoreModal v-if="error" title="Checkout error" @close="closeErrorModal">
      <div :class="$style.modalError">{{ error }}</div>
    </CoreModal>
    <FilterTabs
      :class="$style.tabs"
      :tabs="tabs"
      :active-tab-i-d="activeTabID"
      @tab:change="activeTabChange"
    />

    <div v-if="hasData">
      <div v-for="property in properties" :key="property.id">
        <UnitsTable
          v-if="Object.keys(unitsByProperty[property.id]).length"
          :key="property.id"
          :class="$style.unitsTable"
          :header-items="activeHeaderItems"
          :is-rates-tab="isRatesTab"
          :property="property"
          :units="unitsByProperty[property.id]"
          @units:toggleConfirm="toggleCheckStatus"
        >
          <template scope="props">
            <UnitRow
              v-if="isRatesTab"
              :date-group="props.dateGroup"
              :current-date="currentDate"
            >
              <template slot="unit" scope="items">
                <RatesItem
                  :all-unit-types="unitTypesByProperty[property.id]"
                  :channel-group="items.channelGroup"
                  :units="items.units"
                  :has-dates-in-past="items.hasDatesInPast"
                  :current-user="currentUser"
                  :show-loader="showLoader"
                  @item:delete="openWarning"
                  @item:update="updateItem"
                />
              </template>
            </UnitRow>

            <UnitRow
              v-if="isInventoryTab"
              :date-group="props.dateGroup"
              :current-date="currentDate"
            >
              <template slot="unit" scope="items">
                <InventoryItem
                  :all-unit-types="unitTypesByProperty[property.id]"
                  :channel-group="items.channelGroup"
                  :has-dates-in-past="items.hasDatesInPast"
                  :units="items.units"
                  :current-user="currentUser"
                  :show-loader="showLoader"
                  @item:delete="openWarning"
                  @item:update="updateItem"
                />
              </template>
            </UnitRow>
          </template>
        </UnitsTable>
      </div>

      <ActionFooter
        :label="submitLabel"
        :disabled="isConfirmDisabled"
        :is-multi-state-button="true"
        :secondary-button-type="ButtonFlat"
        :done="isDataSaved"
        :loading="isDataSaving"
        :active="hasSelectedOptions"
        :has-additional-button="true"
        :additional-button-disabled="isActionFooterDisabled"
        :is-additional-warning-button="true"
        :additional-button-label="deleteButtonLabel"
        @primaryAction:click="confirm"
        @secondaryAction:click="openWarning(confirmedOptions)"
      />
    </div>

    <div v-else :class="$style.emptyState">
      <div :class="$style.emptyStateImage">
        <!-- @svg("emptystate-checkout") -->
      </div>
      {{ emptyStateText }}
    </div>

    <ConfirmDialog
      v-if="isWarningShown"
      title="Unsaved Changes"
      confirm-text="Confirm"
      dismiss-text="Cancel"
      @dismiss="onWarningClose"
      @confirm="onWarningConfirm"
      >{{ removeWarningMessage }}</ConfirmDialog
    >
  </article>
</template>

<script>
  import { isBefore, parseISO, format } from 'date-fns';
  import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
  import { groupBy } from 'lodash';

  import { unique, uniqueDeep } from 'utils/collection';
  import { nameComparator } from 'utils/sort';
  import { modalSizesEnum } from 'enums/modal-sizes';
  import { memberRolesEnum } from 'enums/member-roles';
  import { toastTypesEnum } from 'enums/toast-types';
  import { toastFactory } from 'utils/toast';

  import FilterTabs from 'components/app/FilterTabs';

  import RatesItem from 'components/checkout/items/Rate';
  import UnitRow from 'components/checkout/items/UnitRow';
  import ButtonFlat from 'components/buttons/ButtonFlat';
  import InventoryItem from 'components/checkout/items/Inventory';
  import UnitsTable from 'components/checkout/UnitsTable';
  import ActionFooter from 'components/app/ActionFooter';
  import CoreModal from 'components/core/Modal';
  import ConfirmDialog from 'components/modals/ConfirmDialog';

  import { createHeaderItems } from 'utils/checkout';

  import * as mutationTypes from 'store/mutation-types';

  export default {
    components: {
      UnitsTable,
      FilterTabs,
      ActionFooter,
      RatesItem,
      UnitRow,
      InventoryItem,
      CoreModal,
      ConfirmDialog
    },

    computed: {
      unitsByProperty() {
        return groupBy(this.units, unit => unit.property.id);
      },

      activeHeaderItems() {
        return this.isRatesTab
          ? this.headerItems.rates
          : this.headerItems.inventory;
      },

      hasData() {
        return Boolean(this.units.length);
      },

      submitLabel() {
        const confirmedLength = this.confirmedOptions.length;
        return this.hasSelectedOptions
          ? `Confirm (${confirmedLength})`
          : 'Confirm';
      },

      confirmedOptions() {
        return this.units.filter(({ confirmed }) => confirmed);
      },

      confirmedOptionsDates() {
        return unique(
          this.confirmedOptions.map(({ bookingDate }) => bookingDate)
        );
      },

      hasConfirmedDatesInPast() {
        return this.confirmedOptionsDates.some(date => format(parseISO(date), 'yyyy-MM-dd') < format(this.currentDate, 'yyyy-MM-dd')
        );
      },

      isActionFooterDisabled() {
        return (
          this.isDataSaving || this.isDataSaved || !this.hasSelectedOptions
        );
      },

      isConfirmDisabled() {
        return this.isActionFooterDisabled || this.hasConfirmedDatesInPast;
      },

      hasSelectedOptions() {
        return this.confirmedOptions.length > 0;
      },

      emptyStateText() {
        return this.checkoutDataSaved
          ? 'Your checkout is all cleared.'
          : 'You have not made any rate or inventory changes yet.';
      },

      removeWarningMessage() {
        const unitsToRemoveLength = this.unitsToRemove.length;
        const unit =
          unitsToRemoveLength === 1
            ? 'this unit'
            : `${unitsToRemoveLength} units`;
        return `Are you sure you want to remove ${unit} from checkout?`;
      },

      deleteButtonLabel() {
        const unitsToRemoveLength = this.confirmedOptions.length;
        return unitsToRemoveLength > 0
          ? `Delete (${unitsToRemoveLength})`
          : 'Delete';
      },

      properties() {
        return uniqueDeep(this.units.map(({ property }) => property)).sort(
          nameComparator
        );
      },

      ...mapGetters(['currentUser', 'showLoader']),

      ...mapGetters('checkout', [
        'activeTabID',
        'error',
        'tabs',
        'isRatesTab',
        'isInventoryTab',
        'units',
        'unitTypesByProperty',
        'confirmedRateUnits'
      ]),

      ...mapState('checkout', ['isDataSaving', 'isDataSaved'])
    },

    methods: {
      activeTabChange(newTabID) {
        this[mutationTypes.CHECKOUT_ACTIVE_TAB_UPDATE](newTabID);
        this.restartActivityFetchInterval();
      },

      deleteItem(unitID) {
        this.removeUnit(unitID);
      },

      updateItem(value) {
        // TODO: add CHECKOUT_UNIT_BULK_UPDATE
        this[mutationTypes.CHECKOUT_UNIT_UPDATE](value);
      },

      async confirm() {
        try {
          await this.checkoutUnits();
          this.checkoutDataSaved = true;
        } catch (errors) {
          this.updateToast(
            toastFactory(errors[0].detail, toastTypesEnum.WARNING)
          );
        }
      },

      toggleCheckStatus(units) {
        const allConfirmed = units.every(({ confirmed }) => confirmed);
        units.forEach(unit => {
          this[mutationTypes.CHECKOUT_UNIT_UPDATE]({
            unitID: unit.id,
            value: {
              confirmed: !allConfirmed
            }
          });
        });
      },

      openWarning(units) {
        if (!Array.isArray(units)) {
          this.unitsToRemove.push(units);
        } else {
          this.unitsToRemove.push(...units);
        }
        this.isWarningShown = true;
      },

      closeErrorModal() {
        this[mutationTypes.CHECKOUT_CLEAR_UNITS_ERROR]();
      },

      onWarningClose() {
        this.resetUnitsToRemove();
        this.isWarningShown = false;
      },

      setActiveTabOnEnter() {
        const tab = this.tabs.find(({ quantity }) => quantity > 0);
        if (!tab) {
          return;
        }
        this[mutationTypes.CHECKOUT_ACTIVE_TAB_UPDATE](tab.id);
      },

      onWarningConfirm() {
        this.unitsToRemove.forEach(({ id }) => this.deleteItem(id));
        this.resetUnitsToRemove();
        this.isWarningShown = false;
      },

      resetUnitsToRemove() {
        this.unitsToRemove.splice(0, this.unitsToRemove.length);
      },

      async fetchUnitsActivityAndRelatedData() {
        await this.fetchUnitsActivity();
        this.properties.forEach(property => {
          this.fetchAllUnitTypesForProperty(property.id);
        });
      },

      ...mapMutations('checkout', [
        mutationTypes.CHECKOUT_CLEAR_UNITS_ERROR,
        mutationTypes.CHECKOUT_ACTIVE_TAB_UPDATE,
        mutationTypes.CHECKOUT_UNIT_UPDATE
      ]),

      startActivityFetchInterval() {
        this.fetchUnitsActivityAndRelatedData();
        this.activityFetchInterval = setInterval(() => {
          this.fetchUnitsActivityAndRelatedData();
        }, 180000); // 180 000 - 3 minutes
      },

      stopActivityFetchInterval() {
        clearInterval(this.activityFetchInterval);
      },

      restartActivityFetchInterval() {
        this.stopActivityFetchInterval();
        this.startActivityFetchInterval();
      },

      ...mapActions('checkout', [
        'removeUnit',
        'checkoutUnits',
        'fetchUnitsActivity',
        'fetchAllUnitTypesForProperty'
      ]),

      ...mapActions(['updateToast'])
    },

    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (vm.currentUser.role.id === memberRolesEnum.STAFF.id) {
          next('/');
        } else {
          next();
        }
      });
    },

    data() {
      const ratesLabels = [
        'Valid for',
        'Channel',
        'Room type',
        'Availability',
        '',
        'Rate',
        'Current',
        'Difference',
        'Updated'
      ];
      const inventoryLabels = [
        'Valid for',
        'Channel',
        'Room type',
        'Availability',
        '',
        'Inventory mode',
        'Current',
        'Difference',
        'Updated'
      ];
      return {
        ButtonFlat,
        headerItems: {
          rates: createHeaderItems(ratesLabels),
          inventory: createHeaderItems(inventoryLabels)
        },
        isWarningShown: false,
        unitsToRemove: [],
        activityFetchInterval: null,
        checkoutDataSaved: false,
        modalSizes: modalSizesEnum,
        currentDate: new Date()
      };
    },

    created() {
      this.setActiveTabOnEnter();
      this.startActivityFetchInterval();
    },

    beforeDestroy() {
      this.stopActivityFetchInterval();
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .empty-state {
    color: $color-text-main-lighter;
    width: 240px;
    margin: 240px auto 0;
    text-align: center;
  }

  .empty-state-image {
    width: 240px;
    height: 240px;
  }

  .tabs {
    position: sticky;
    z-index: $z-floating-content;
    top: 0;
  }

  .modal-error {
    padding: 25px 10px;
    text-align: center;
  }

  .units-table {
    padding-bottom: 60px;

    min-width: 1280px;
  }
</style>
