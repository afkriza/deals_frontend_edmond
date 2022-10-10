<template>
  <div :class="$style.page">
    <Filters
        :class="$style.filters"
        :filters="filters"
        :toggle-filter-pin="togglePin"
        @filter:update="onFilterUpdate"
        @expanded-filters:open="onExpandedFiltersOpen"
        @expanded-filters:close="onExpandedFiltersClose"
    >
      <template #append>
        <ChannelsFilter
            :class="$style.channelsFilter"
            :disabled="showLoader"
            :visible-channels="visibleChannels"
            :selected-unit-scope="unitScope"
            @unit-scope:change="updateSelectedUnitScope"
            @visible-channel:change="updateVisibleChannels"
        />
      </template>
    </Filters>

    <EmptyState v-if="!isRatesDataLoaded">
      <template slot="image">
        <!-- @svg("emptystate-rates") -->
      </template>
      <template slot="text">
        Rates will appear when all</br>filters and parameters are selected.
      </template>
    </EmptyState>

    <template v-else-if="!isEmpty">
      <UnitsContainer
          :class="$style.unitsContainer"
          :units="unitsForChannel"
          :dates="dates"
          :unit-scope="unitScope"
          :units-by-date="unitsByDate"
          :initial-units-with-suggestion-by-date="initialUnitsWithSuggestionByDate"
          :is-editable="isPageEditable"
          :unit-types="unitTypes"
          :checked-dates="checkedDates"
          :checked-unit-types="checkedUnitTypes"
          @units:unitTypeUpdate="onUnitTypeUpdate"
          @units:dateUpdate="onUnitsDateUpdate"
      >
        <template
            slot="master"
            scope="masterProps"
        >
          <RatesMaster
              v-if="isPageEditable"
              :channel="masterProps.channel"
              :units="masterProps.units"
              :class="$style.channelMaster"
              :all-accepted="masterProps.units.every((unit) => unit.isAccepted)"
              :allowed-price-levels="priceLevelsIntersectionByUnitsSorted(masterProps.units)"
              :price-level-controls="hasPriceLevelControls"
              :alt-availability-controls="hasAltAvailabilityControls"
              @master:update="updateMaster($event, masterProps.units)"
              @master:edit="editMaster($event, masterProps.units)"
          />

          <ReadOnlyMaster
              v-else
              :channel="masterProps.channel"
          />
        </template>

        <template
            slot="unit"
            scope="itemProps"
        >
          <ReadOnlyRatesUnit
              v-if="!isPageEditable"
              :unit="itemProps.unit"
          />

          <RatesUnit
              v-else
              :unit="itemProps.unit"
              :class="$style.unit"
              :saved-units="unitsInCheckout"
              :price-level-controls="hasPriceLevelControls"
              :alt-availability-controls="hasAltAvailabilityControls"
              @unit:update="updateUnit($event.value, $event.unit)"
          />
        </template>
      </UnitsContainer>

      <ActionToolbar
          v-if="isPageEditable && !(selectedUnits.length || !selectedChannels.length)"
          :class="[$style.override, $style.actionToolbar]"
          :primary-button-text="submitLabel"
          :is-primary-button-inverted="false"
          :secondary-button-text="acceptAllButtonLabel"
          :is-secondary-button-inverted="false"
          :is-disabled="!savableUnits.length"
          :additional-button-disabled="!unitsWithSuggestion.length && !savableUnits.length"
          :secondary-button-type="ButtonFlat"
          @click:primary="onSubmit"
          @click:secondary="onAcceptOrRevertAll"
      />

      <AppToolbar
          v-if="isPageEditable && (selectedUnits.length || !selectedChannels.length)"
          :show-secondary-section="hasPriceLevelControls"
          :primary-button-text="saveButtonLabel"
          :secondary-button-text="secondaryToolbarButtonLabel"
          :is-disabled="!savableUnits.length"
          :filter-options="toolbarFilterOptions"
          :selected-filter-options="selectedChannels"
          :switcher-modes="Object.values(unitModes)"
          primary-switcher-label="Availability"
          secondary-switcher-label="Rate"
          :active-primary-switcher-mode="toolbarAvailabilityMode"
          :active-secondary-switcher-mode="toolbarAmountMode"
          :primary-dropdown-options="toolbarAvailabilityOptions"
          :is-primary-dropdown-disabled="isToolbarAvailabilityModeAuto"
          :primary-dropdown-offset="{vertical: -135, horizontal: 0}"
          :primary-dropdown-value="toolbarAvailabilityValue"
          :secondary-dropdown-options="toolbarRateOptions"
          :secondary-dropdown-offset="secondaryDropdownOffset"
          :is-secondary-dropdown-disabled="isToolbarAmountModeAuto"
          :secondary-dropdown-value="toolbarAmountValue"
          @click:primary="onActionToolbarSubmit"
          @click:secondary="onSecondaryToolbarButtonClick"
          @linkChannel:toggle="toggleLinkChannel"
          @primarySwitcher:change="updatePropertyValue($event, 'toolbarAvailabilityMode')"
          @primaryDropdown:change="updatePropertyValue($event, 'toolbarAvailability')"
          @secondarySwitcher:change="updatePropertyValue($event, 'toolbarAmountMode')"
          @secondaryDropdown:change="updatePropertyValue($event, 'toolbarRateValue')"
      />
    </template>

    <EmptyState v-else>
      <template slot="image">
        <!-- @svg("emptystate-no-units") -->
      </template>
      <template slot="title">
        No units found
      </template>
      <template slot="text">
        There are no results based on your filtering criteria.
      </template>
    </EmptyState>

    <ConfirmDialog
        v-if="isWarningShown || isConfirmShown"
        title="Discard changes"
        confirm-text="Confirm"
        dismiss-text="Cancel"
        @dismiss="onWarningClose"
        @confirm="onWarningDiscard"
    >It seems like you changed some data without saving. Are you sure you want to load new data?
    </ConfirmDialog>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';
import {cloneDeep, indexOf, intersection, map, sortBy, isEqual} from 'lodash';

import * as mutationTypes from 'store/mutation-types';

import RatesMaster from 'components/rates/RatesMaster';
import ReadOnlyMaster from 'components/units/ReadOnlyMaster';
import RatesUnit from 'components/rates/RatesUnit';
import ReadOnlyRatesUnit from 'components/rates/ReadOnlyRatesUnit';
import UnitsContainer from 'components/units/UnitsContainer';
import ActionToolbar from 'components/toolbars/ActionToolbar';
import ButtonFlat from 'components/buttons/ButtonFlat';
import AppToolbar from 'components/toolbars/AppToolbar';
import availabilities from 'enums/availabilities';
import unitChannels, {channels} from 'enums/channels';
import unitModes from 'enums/unit-modes';
import {memberRolesEnum} from 'enums/member-roles';
import {unitPage} from 'mixins/unitPage';
import {groupBy, unique, uniqueDeep} from 'utils/collection';

import ConfirmDialog from 'components/modals/ConfirmDialog';
import EmptyState from 'components/app/EmptyState';
import Filters from '@/components/filters/Filters';
import createFiltersMixin from '@/mixins/filters.mixin';
import ChannelsFilter from '@/components/filters/ChannelsFilter';
import unitScopes from 'enums/unit-scopes';

export default {
  components: {
    ChannelsFilter,
    Filters,
    UnitsContainer,
    RatesMaster,
    RatesUnit,
    ReadOnlyMaster,
    ReadOnlyRatesUnit,
    ActionToolbar,
    ConfirmDialog,
    AppToolbar,
    EmptyState
  },

  mixins: [unitPage, createFiltersMixin('rates')],

  beforeRouteLeave(to, from, next) {
    this.saveToStorage().then(() => {
      next();
    });
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.loadFromStorage();
    });
  },

  data() {
    return {
      availabilities,
      channels,
      unitChannels,
      unitModes,
      ButtonFlat,
      isWarningShown: false,
      isConfirmShown: false,
      toolbarAvailabilityMode: '',
      toolbarAmountMode: '',
      lastCheckedDate: '',
      lastUncheckedDate: '',
      pendingFilterInfo: null,
      pendingFilterUpdateOnly: false,
      toolbarAvailability: '',
      queuedUnitScope: null,
      toolbarRateValue: null,
      checkedUnitTypes: [],
      checkedDates: [],
      checkedUnits: [],
      uncheckedUnits: [],
      selectedChannels: [channels.B2B, channels.IND],
      toolbarAvailabilityOptions: {NONE: 'Current', ...availabilities},
      areExpandedFiltersOpen: false,
      filtersSnapshot: null
    };
  },

  computed: {
    toolbarRateOptions() {
      return ['Current', ...this.priceLevelsIntersectionByUnitsSorted(this.selectedUnits)]
    },

    isEmpty() {
      return !this.units.length;
    },

    submitLabel() {
      const savableUnitsNum = this.savableUnits.length;
      return savableUnitsNum ? `Save (${savableUnitsNum})` : 'Save';
    },

    dates() {
      const dates = this.unitsForChannel.map((unit) => unit.bookingDate);
      return unique(dates).sort();
    },

    isPageEditable() {
      return this.currentUser.role.id !== memberRolesEnum.STAFF.id;
    },

    hasPriceLevelControls() {
      return (
          this.currentUser.role.id !== memberRolesEnum.AVAILABILITY_EDITOR.id
      );
    },

    hasAltAvailabilityControls() {
      return (
          this.currentUser.role.id !== memberRolesEnum.AVAILABILITY_EDITOR.id
      );
    },

    unitTypes() {
      const unitTypes = uniqueDeep(
          this.unitsForChannel.map(unit => unit.unitType)
      );

      return sortBy(unitTypes, unitType => indexOf(this.unitTypeByRanking, unitType.id));
    },

    unitsByDate() {
      return groupBy(this.unitsForChannel, 'bookingDate');
    },

    unitsByGroup() {
      return groupBy(this.unitsForChannel, (unit) => unit.unitType.id);
    },

    acceptAllButtonLabel() {
      const acceptableUnitsNum = this.unitsWithSuggestion.length;
      const dirtyUnitsNum = this.savableUnits.length;

      if (!acceptableUnitsNum && !dirtyUnitsNum) {
        return 'Accept/Revert All';
      }

      return acceptableUnitsNum ?
          `Accept All (${acceptableUnitsNum})` :
          `Revert All (${dirtyUnitsNum})`;
    },

    unitsWithSuggestion() {
      return this.unitsForChannel.filter((unit) => {
        const shouldUpdatePriceLevel =
            this.hasPriceLevelControls && unit.hasPriceLevelSuggestion;
        const shouldUpdateAvailability =
            (this.hasAltAvailabilityControls ||
                unit.channel.id !== channels.ALT.id) &&
            unit.hasAvailabilitySuggestion;

        return (
            unit.hasSuggestion &&
            (shouldUpdatePriceLevel || shouldUpdateAvailability)
        );
      });
    },

    initialUnitsWithSuggestion() {
      return this.unitsForChannel.filter(
          (unit) => unit.hasSuggestion || unit.isDirty
      );
    },

    initialUnitsWithSuggestionByDate() {
      return groupBy(this.initialUnitsWithSuggestion, 'bookingDate');
    },

    unitsWithSuggestionIDs() {
      return this.unitsWithSuggestion.map((unit) => unit.id);
    },

    selectedUnits() {
      return this.units.filter((unit) => unit.checked);
    },

    selectedUnitIDs() {
      return this.selectedUnits.map((unit) => unit.id);
    },

    isAcceptButton() {
      return (
          (!this.toolbarRateValue || this.toolbarRateValue === 'Current') &&
          (!this.toolbarAvailability || this.toolbarAvailability === 'Current') &&
          !this.toolbarAvailabilityMode &&
          !this.toolbarAmountMode
      );
    },

    hasAcceptableCheckedValues() {
      return this.selectedUnits.some((unit) => {
        return unit.accepted === false;
      });
    },

    isToolbarAvailabilityModeAuto() {
      return this.toolbarAvailabilityMode === unitModes.AUTO;
    },

    isToolbarAmountModeAuto() {
      return this.toolbarAmountMode === unitModes.AUTO;
    },

    toolbarAvailabilityValue() {
      if (this.isToolbarAvailabilityModeAuto) {
        return 'Auto';
      } else if (this.toolbarAvailability) {
        return this.toolbarAvailability;
      }

      return 'Current';
    },

    toolbarAmountValue() {
      if (this.isToolbarAmountModeAuto) {
        return 'Auto';
      } else if (this.toolbarRateValue) {
        return this.toolbarRateValue;
      }

      return 'Current';
    },

    secondaryToolbarButtonLabel() {
      if (!this.hasAcceptableCheckedValues) {
        return `Revert (${this.selectedUnits.length})`;
      }

      const labelText = this.isAcceptButton ? 'Accept' : 'Apply';
      return `${labelText} (${this.selectedUnits.length})`;
    },

    saveButtonLabel() {
      return this.savableUnits.length ?
          `Save (${this.savableUnits.length})` :
          'Save';
    },

    toolbarFilterOptions() {
      return this.hasAltAvailabilityControls ?
          this.unitChannels :
          this.unitChannels.filter(({id}) => id !== this.channels.ALT.id);
    },

    secondaryDropdownOffset() {
      const numberOfOptions = this.toolbarRateOptions.length;
      return {
        vertical: numberOfOptions < 6 ? -(numberOfOptions * 28 + 51) : -210,
        horizontal: 0
      };
    },

    filtersQuery_() {
      const query = {...this.filtersQuery};

      if (this.unitScope === unitScopes.ALL) {
        query.rates = 'all';
      }

      return query;
    },

    ...mapState('rates', ['visibleChannels', 'unitScope']),

    ...mapGetters('rates', [
      'isRatesDataLoaded',
      'isRatesDataLoading',
      'unitsForChannel',
      'savableUnits',
      'units',
      'unitsInCheckout',
      'unitTypeByRanking',
      'storageHasData'
    ]),

    ...mapGetters(['currentUser', 'showLoader'])
  },

   created() {
    const propertyFilter = this.filters.find(filter => filter.id === 'property');
    if (!this.storageHasData && propertyFilter && propertyFilter.value) {
      this.onFilterUpdate(this.filters);
    } else {
      this.initializeFilters();
    }
  },

  methods: {
    priceLevelsIntersectionByUnitsSorted(units) {
      return sortBy(intersection(...map(units, 'priceLevels')), Number);
    },

    updateMaster(eventData, units) {
      units.forEach((unit) => {
        if (eventData.hasOwnProperty('newPriceLevel') && eventData.newPriceLevel === 'Current') {
          this.updateUnit({newPriceLevel: unit.currentPriceLevel}, unit);
        } else {
          this.updateUnit(eventData, unit);
        }
      });
    },

    editMaster(eventData, units) {
      units.forEach((unit) => {
        const updateValue = Object.assign(
            {
              newStopSignal: unit.stopSignal,
              newPriceLevel: unit.priceLevel
            },
            eventData
        );

        this[mutationTypes.RATES_UPDATE]({
          unitID: unit.id,
          value: updateValue
        });
      });
    },

    updateUnit(eventData, unit) {
      let accepted;

      if (eventData.hasOwnProperty('newPriceLevel')) {
        accepted =
            unit.currentPriceLevel !== eventData.newPriceLevel ||
            unit.currentStopSignal !== unit.newStopSignal;
      } else if (eventData.hasOwnProperty('newStopSignal')) {
        accepted =
            unit.currentPriceLevel !== unit.newPriceLevel ||
            unit.currentStopSignal !== eventData.newStopSignal;
      } else {
        accepted = unit.accepted;
      }

      const value = Object.assign({accepted}, eventData);
      this[mutationTypes.RATES_UPDATE]({
        value,
        unitID: unit.id
      });
    },

    uncheckSelectedUnits() {
      this._resetBulkCheckboxes();

      this[mutationTypes.RATES_BULK_UPDATE]({
        unitIDs: this.selectedUnitIDs,
        value: {
          checked: false
        }
      });
    },

    onAcceptOrRevertAll() {
      const action = this.unitsWithSuggestion.length ?
          this._acceptAll :
          this._revertAll;
      action();
    },

    onApply() {
      this.selectedUnits.forEach((unit) => {
        const newStopSignal = this._getNewUnitStopSignal(unit);
        const newPriceLevel = this._getNewUnitPriceLevel(unit);
        const newStopSignalMode = this.toolbarAvailabilityMode ?
            this.toolbarAvailabilityMode :
            unit.stopSignalMode;
        const newPriceLevelMode = this.toolbarAmountMode ?
            this.toolbarAmountMode :
            unit.priceLevelMode;

        const accepted =
            newStopSignal !== unit.currentStopSignal ||
            newPriceLevel !== unit.currentPriceLevel ||
            newStopSignalMode !== unit.stopSignalMode ||
            newPriceLevelMode !== unit.priceLevelMode;

        this[mutationTypes.RATES_UPDATE]({
          unitID: unit.id,
          value: {
            newStopSignal,
            newPriceLevel,
            accepted,
            newStopSignalMode,
            newPriceLevelMode
          }
        });
      });

      this.toolbarRateValue = null;
      this.toolbarAvailability = '';
    },

    onRevert() {
      this.selectedUnits.forEach((unit) => {
        this[mutationTypes.RATES_UPDATE]({
          unitID: unit.id,
          value: {
            newStopSignal: unit.currentStopSignal,
            newPriceLevel: unit.currentPriceLevel,
            newStopSignalMode: unit.stopSignalMode,
            newPriceLevelMode: unit.priceLevelMode,
            accepted: false
          }
        });
      });
    },

    onAccept() {
      this.selectedUnits.forEach((unit) => {
        const newPriceLevel = this.hasPriceLevelControls ?
            unit.priceLevel :
            unit.currentPriceLevel;
        const newStopSignal =
            !this.hasAltAvailabilityControls &&
            unit.channel.id === this.channels.ALT.id ?
                unit.currentStopSignal :
                unit.stopSignal;

        this[mutationTypes.RATES_UPDATE]({
          unitID: unit.id,
          value: {
            newPriceLevel,
            newStopSignal,
            accepted: true
          }
        });
      });
    },

    isUnitTypeChecked(unit) {
      return this.checkedUnitTypes.includes(unit.unitType.id);
    },

    isUnitDateChecked(unit) {
      return this.checkedDates.includes(unit.bookingDate);
    },

    isChannelTypeChecked(unit) {
      return Boolean(
          this.selectedChannels.find(
              (selectedChannel) => selectedChannel.id === unit.channel.id
          )
      );
    },

    handleUnitCheck(units, isChecked) {
      this[mutationTypes.RATES_BULK_UPDATE]({
        unitIDs: units,
        value: {
          checked: isChecked
        }
      });
    },

    resetUnitChecks() {
      this.checkedUnits = [];
      this.uncheckedUnits = [];
    },

    provideDateRange(isDateRange, targetDate, lastChangedDate) {
      if (!isDateRange) {
        return [targetDate];
      }

      const lastChangedDateIndex = this.dates.indexOf(lastChangedDate);
      const dateIndex = this.dates.indexOf(targetDate);
      const activeDateIndexes = [lastChangedDateIndex, dateIndex].sort();
      const dates = this.dates.slice(
          activeDateIndexes[0],
          activeDateIndexes[1] + 1
      );

      return dates;
    },

    onSecondaryToolbarButtonClick() {
      if (!this.hasAcceptableCheckedValues) {
        this.onRevert();
      } else {
        const action = this.isAcceptButton ? this.onAccept : this.onApply;
        action();
      }
    },

    updatePropertyValue(eventData, property) {
      this[property] = eventData;
    },

    _getNewUnitStopSignal(unit) {
      return !this.toolbarAvailability || this.toolbarAvailability === 'Current' ?
          unit.currentStopSignal :
          this.toolbarAvailability === availabilities.STOP;
    },

    _getNewUnitPriceLevel(unit) {
      const priceLevel = unit.currentPriceLevel ?
          unit.currentPriceLevel :
          unit.newPriceLevel;
      return this.toolbarRateValue && this.toolbarRateValue !== 'Current' ?
          this.toolbarRateValue :
          priceLevel;
    },

    _acceptAll() {
      this.unitsWithSuggestion.forEach((unit) => {
        const newPriceLevel = this.hasPriceLevelControls ?
            unit.priceLevel :
            unit.currentPriceLevel;
        const newStopSignal =
            !this.hasAltAvailabilityControls &&
            unit.channel.id === this.channels.ALT.id ?
                unit.currentStopSignal :
                unit.stopSignal;

        const updateValue = {
          newStopSignal,
          newPriceLevel,
          accepted: true
        };

        this[mutationTypes.RATES_UPDATE]({
          unitID: unit.id,
          value: updateValue
        });
      });
    },

    _revertAll() {
      this.savableUnits.forEach((unit) => {
        const updateValue = {
          newStopSignal: unit.currentStopSignal,
          newPriceLevel: unit.currentPriceLevel,
          accepted: false
        };

        this[mutationTypes.RATES_UPDATE]({
          unitID: unit.id,
          value: updateValue
        });
      });
    },

    onSubmit() {
      this.saveRate(this.savableUnits);
    },

    onActionToolbarSubmit() {
      this.toolbarRateValue = null;
      this.saveRate(this.savableUnits);
      this.uncheckSelectedUnits();
    },

    onFilterUpdate(filter) {
      if (this.savableUnits.length) {
        this.pendingFilterInfo = filter;

        this.showConfirm();
      } else {
        this.UPDATE_FILTER(filter);

        if(this.areExpandedFiltersOpen) {
          return;
        }

        this.applyFilters();
      }
    },

    applyFilters() {
      this.fetchUnits(this.filtersQuery_);
      this._resetBulkCheckboxes();
    },

    updateVisibleChannels(value) {
      this[mutationTypes.RATES_VISIBLE_CHANNELS_UPDATE](value);
    },

    updateSelectedUnitScope(value) {
      this._confirmAndFetchUnits(mutationTypes.RATES_UNIT_SCOPE_UPDATE, value);
    },

    closeWarnings() {
      this.isWarningShown = false;
      this.isConfirmShown = false;
    },

    showWarning() {
      this.isWarningShown = true;
    },

    showConfirm() {
      this.isConfirmShown = true;
    },

    onWarningClose() {
      this.closeWarnings();

      if (this.pendingFilterInfo) {
        const originalFilter = this.filter(this.pendingFilterInfo.id);
        // artificially change filter to reset the localFilter inside Pinned/Expanded Filter components
        this.UPDATE_FILTER(this.pendingFilterInfo);
        setTimeout(() => this.UPDATE_FILTER(originalFilter), 0);
      }
      this.resetPendingFilterInfo();
    },

    onWarningDiscard() {
      if (this.isWarningShown) {
        this.saveRate(this.savableUnits);
      }
      this.closeWarnings();

      if (this.pendingFilterInfo) {
        this.UPDATE_FILTER(this.pendingFilterInfo);

        if(!this.areExpandedFiltersOpen) {
          this.applyFilters();
        }
      }
      this.resetPendingFilterInfo();
    },

    discardWarning() {
      this.closeWarnings();
      this.saveRate(this.savableUnits);
    },

    addAllUnits() {
      this.saveRate(this.savableUnits);
      this.closeWarnings();
    },

    toggleLinkChannel(isLinked, channelID) {
      const channel = unitChannels.find(({id}) => id === channelID);

      if (isLinked) {
        this.selectedChannels.push(channel);
      } else {
        this.selectedChannels.splice(this.selectedChannels.indexOf(channel), 1);
      }

      this.handleUnitStatesAndChecks();
    },

    resetPendingFilterInfo() {
      this.pendingFilterInfo = null;
    },

    _confirmAndFetchUnits(mutation, value) {
      if (this.savableUnits.length) {
        this.queuedUnitScope = value;
        this.showConfirm();
      } else {
        this[mutation](value);
      }
    },

    _resetBulkCheckboxes() {
      this.checkedDates = [];
      this.checkedUnitTypes = [];
    },

    onExpandedFiltersOpen() {
      this.areExpandedFiltersOpen = true;

      this.filtersSnapshot = cloneDeep(this.filters);
    },

    onExpandedFiltersClose() {
      this.areExpandedFiltersOpen = false;

      if (!isEqual(this.filters, this.filtersSnapshot)) {
        this.expandedFilterUpdated = false;
        this.applyFilters();
      }
    },

    ...mapActions('rates', [
      'fetchUnits',
      'saveToStorage',
      'loadFromStorage',
    ]),

    ...mapMutations('rates', [
      mutationTypes.RATES_UPDATE,
      mutationTypes.RATES_BULK_UPDATE,
      mutationTypes.RATES_UNIT_SCOPE_UPDATE,
      mutationTypes.RATES_VISIBLE_CHANNELS_UPDATE,
      mutationTypes.RATES_CLEAR
    ]),

    ...mapActions('checkout', ['saveRate'])
  },




};
</script>

<style lang="scss" module>
@import 'utils';

.page {
  display: grid;
  grid-template-rows: $min-filter-height 1fr minmax(0, $smaller-action-footer-height);
}

.filters {
  z-index: $z-filters;
}

.units-filters {
  @include filters;

  background-color: $color-bg-main-dimmed;
  border-bottom: 1px solid $color-border-main;

  &.has-data {
    border-bottom: 0;
    padding-bottom: 0;
  }
}

.empty-state {
  color: $color-text-main-lighter;
  width: 240px;
  margin: 240px auto 0;
  text-align: center;
}

.tabs {
  @extend %container;
}

.empty-state-image {
  width: 240px;
  height: 240px;
}

.override.action-toolbar {
  background-color: $color-white;
}

.units-container {
  height: calc(100vh - #{($min-filter-height + $smaller-action-footer-height)});
}

.channels-filter {
  margin-left: auto;
  margin-right: 48px;
}
</style>
