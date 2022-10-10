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

    <EmptyState v-if="!isInventoryDataLoaded">
      <template slot="image">
        <!-- @svg("emptystate-inventory") -->
      </template>
      <template slot="text">
        Inventory will appear when all</br>filters and parameters are selected.
      </template>
    </EmptyState>

    <template v-else-if="!isEmpty">
      <UnitsContainer
        :class="$style.unitsContainer"
        :unit-types="unitTypes"
        :units="unitsForChannel"
        :dates="dates"
        :checked-dates="checkedDates"
        :is-editable="isPageEditable"
        :unit-scope="unitScope"
        :units-by-date="unitsByDate"
        :initial-units-with-suggestion-by-date="initialUnitsWithSuggestionByDate"
        :checked-unit-types="checkedUnitTypes"
        @units:unitTypeUpdate="onUnitTypeUpdate"
        @units:dateUpdate="onUnitsDateUpdate"
      >
        <template
          slot="master"
          scope="masterProps"
        >
          <InventoryMaster
            v-if="isPageEditable"
            :channel="masterProps.channel"
            :units="masterProps.units"
            :class="$style.channelMaster"
            :allowed-placed-units="allowedPlacedUnits"
            :all-accepted="masterProps.units.every((unit) => unit.isAccepted)"
            :placed-units-controls="hasPlacedUnitsControls"
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
          <ReadOnlyInventoryUnit
            v-if="!isPageEditable"
            :unit="itemProps.unit"
          />

          <InventoryUnit
            v-else
            :unit="itemProps.unit"
            :class="$style.unit"
            :allowed-placed-units="allowedPlacedUnits"
            :saved-units="unitsInCheckout"
            :placed-units-controls="hasPlacedUnitsControls"
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
        :secondary-button-type="ButtonFlat"
        :is-secondary-button-inverted="false"
        :is-disabled="!savableUnits.length"
        :additional-button-disabled="!unitsWithSuggestion.length && !savableUnits.length"
        @click:primary="saveUnits"
        @click:secondary="onAcceptOrRevertAll"
      />

      <AppToolbar
        v-if="isPageEditable && (selectedUnits.length || !selectedChannels.length)"
        :show-secondary-section="hasPlacedUnitsControls"
        :primary-button-text="saveButtonLabel"
        :secondary-button-text="secondaryToolbarButtonLabel"
        :disabled="!savableUnits.length"
        :filter-options="toolbarFilterOptions"
        :selected-filter-options="selectedChannels"
        :switcher-modes="Object.values(unitModes)"
        primary-switcher-label="Availability"
        secondary-switcher-label="Placed Units"
        :active-primary-switcher-mode="toolbarAvailabilityMode"
        :active-secondary-switcher-mode="toolbarPlacedUnitsMode"
        :primary-dropdown-options="toolbarAvailabilityOptions"
        :is-primary-dropdown-disabled="isToolbarAvailabilityModeAuto"
        :primary-dropdown-offset="{vertical: -135, horizontal: 0}"
        :primary-dropdown-value="toolbarAvailabilityValue"
        :secondary-dropdown-options="toolbarPlacedUnitsOptions"
        :secondary-dropdown-offset="secondaryDropdownOffset"
        :is-secondary-dropdown-disabled="isToolbarPlacedUnitsModeAuto"
        :secondary-dropdown-value="toolbarPlacedUnitsValue"
        @click:primary="onActionToolbarSubmit"
        @click:secondary="onSecondaryToolbarButtonClick"
        @linkChannel:toggle="toggleLinkChannel"
        @primarySwitcher:change="updatePropertyValue($event, 'toolbarAvailabilityMode')"
        @primaryDropdown:change="updatePropertyValue($event, 'toolbarAvailability')"
        @secondarySwitcher:change="updatePropertyValue($event, 'toolbarPlacedUnitsMode')"
        @secondaryDropdown:change="updatePropertyValue($event, 'toolbarPSValue')"
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
    >It seems like you changed some data without saving. Are you sure you want to load new data?</ConfirmDialog>
  </div>
</template>

<script>
  import {mapState, mapGetters, mapActions, mapMutations} from 'vuex';
  import {sortBy, indexOf, cloneDeep, isEqual} from 'lodash';

  import * as mutationTypes from 'store/mutation-types';

  import UnitsContainer from 'components/units/UnitsContainer';
  import InventoryMaster from 'components/inventory/InventoryMaster';
  import ReadOnlyMaster from 'components/units/ReadOnlyMaster';
  import InventoryUnit from 'components/inventory/InventoryUnit';
  import ReadOnlyInventoryUnit from 'components/inventory/ReadOnlyInventoryUnit';
  import ConfirmDialog from 'components/modals/ConfirmDialog';
  import AppToolbar from 'components/toolbars/AppToolbar';
  import availabilities from 'enums/availabilities';
  import ActionToolbar from 'components/toolbars/ActionToolbar';
  import ButtonFlat from 'components/buttons/ButtonFlat';
  import EmptyState from 'components/app/EmptyState';
  import allowedPlacedUnits from 'enums/no-of-placed-units-levels';
  import unitChannels, {channels} from 'enums/channels';
  import {memberRolesEnum} from 'enums/member-roles';
  import unitModes from 'enums/unit-modes';
  import {unitPage} from 'mixins/unitPage';
  import {groupBy, unique, uniqueDeep} from 'utils/collection';
  import {isTruthyOrZero} from 'utils/number';
  import Filters from '@/components/filters/Filters';
  import ChannelsFilter from '@/components/filters/ChannelsFilter';
  import createFiltersMixin from '@/mixins/filters.mixin';
  import unitScopes from '@/enums/unit-scopes';

  export default {
    components: {
      ChannelsFilter,
      Filters,
      UnitsContainer,
      InventoryMaster,
      InventoryUnit,
      ReadOnlyMaster,
      ReadOnlyInventoryUnit,
      ConfirmDialog,
      AppToolbar,
      ActionToolbar,
      EmptyState
    },

    mixins: [unitPage, createFiltersMixin('inventory')],

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
        allowedPlacedUnits,
        channels,
        unitChannels,
        unitModes,
        ButtonFlat,
        localFilter: null,
        isWarningShown: false,
        isConfirmShown: false,
        toolbarAvailabilityMode: '',
        lastCheckedDate: '',
        lastUncheckedDate: '',
        toolbarPlacedUnitsMode: '',
        pendingFilterInfo: null,
        pendingFilterUpdateOnly: false,
        toolbarAvailability: '',
        queuedUnitScope: null,
        toolbarPSValue: null,
        checkedDates: [],
        checkedUnits: [],
        uncheckedUnits: [],
        checkedUnitTypes: [],
        selectedChannels: [channels.B2B, channels.IND],
        toolbarAvailabilityOptions: {NONE: 'Current', ...availabilities},
        toolbarPlacedUnitsOptions: ['Current', ...allowedPlacedUnits],
        areExpandedFiltersOpen: false,
        filtersSnapshot: null
      };
    },

    computed: {

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

      hasPlacedUnitsControls() {
        return (
          this.currentUser.role.id !== memberRolesEnum.AVAILABILITY_EDITOR.id
        );
      },

      hasAltAvailabilityControls() {
        return (
          this.currentUser.role.id !== memberRolesEnum.AVAILABILITY_EDITOR.id
        );
      },

      unitsByDate() {
        return groupBy(this.unitsForChannel, 'bookingDate');
      },

         unitTypes() {
        const unitTypes = uniqueDeep(
          this.unitsForChannel.map(unit => unit.unitType)
        );

        return sortBy(unitTypes, unitType => indexOf(this.unitTypeByRanking, unitType.id));
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

      saveButtonLabel() {
        return this.savableUnits.length ?
          `Save (${this.savableUnits.length})` :
          'Save';
      },

      hasAcceptableCheckedValues() {
        return this.selectedUnits.some((unit) => {
          return unit.accepted === false;
        });
      },

      secondaryToolbarButtonLabel() {
        if (!this.hasAcceptableCheckedValues) {
          return `Revert (${this.selectedUnits.length})`;
        }

        const labelText = this.isAcceptButton ? 'Accept' : 'Apply';
        return `${labelText} (${this.selectedUnits.length})`;
      },

      toolbarAvailabilityValue() {
        if (this.isToolbarAvailabilityModeAuto) {
          return 'Auto';
        } else if (this.toolbarAvailability) {
          return this.toolbarAvailability;
        }

        return 'Current';
      },

      toolbarPlacedUnitsValue() {
        if (this.isToolbarPlacedUnitsModeAuto) {
          return 'Auto';
        } else if (isTruthyOrZero(this.toolbarPSValue)) {
          return this.toolbarPSValue;
        }

        return 'Current';
      },

      unitsWithSuggestion() {
        return this.unitsForChannel.filter((unit) => {
          const shouldUpdatePS =
            this.hasPlacedUnitsControls && unit.hasPSSuggestion;
          const shouldUpdateAvailability =
            (this.hasAltAvailabilityControls ||
              unit.channel.id !== channels.ALT.id) &&
            unit.hasAvailabilitySuggestion;

          return unit.hasSuggestion && (shouldUpdatePS || shouldUpdateAvailability);
        });
      },

      unitsWithSuggestionIDs() {
        return this.unitsWithSuggestion.map((unit) => unit.id);
      },

      initialUnitsWithSuggestion() {
        return this.unitsForChannel.filter(
          (unit) => unit.hasSuggestion || unit.isDirty
        );
      },

      initialUnitsWithSuggestionByDate() {
        return groupBy(this.initialUnitsWithSuggestion, 'bookingDate');
      },

      selectedUnits() {
        return this.units.filter((unit) => unit.checked);
      },

      selectedUnitIDs() {
        return this.selectedUnits.map((unit) => unit.id);
      },

      isAcceptButton() {
        return (
          ((!this.toolbarPSValue && this.toolbarPSValue !== 0) || this.toolbarPSValue === 'Current') &&
          (!this.toolbarAvailability || this.toolbarAvailability === 'Current') &&
          !this.toolbarAvailabilityMode &&
          !this.toolbarPlacedUnitsMode
        );
      },

      isToolbarAvailabilityModeAuto() {
        return this.toolbarAvailabilityMode === unitModes.AUTO;
      },

      isToolbarPlacedUnitsModeAuto() {
        return this.toolbarPlacedUnitsMode === unitModes.AUTO;
      },

      toolbarFilterOptions() {
        return this.hasAltAvailabilityControls ?
          this.unitChannels :
          this.unitChannels.filter(({id}) => id !== this.channels.ALT.id);
      },

      secondaryDropdownOffset() {
        const numberOfOptions = this.toolbarPlacedUnitsOptions.length;
        return {
          vertical: numberOfOptions < 6 ? -(numberOfOptions * 28 + 51) : -210,
          horizontal: 0
        };
      },

      filtersQuery_() {
        const query = {...this.filtersQuery};

        if (this.unitScope === unitScopes.ALL) {
          query.inventories = 'all';
        }

        return query;
      },

      ...mapState('inventory', ['visibleChannels', 'unitScope']),

      ...mapGetters('inventory', [
        'isInventoryDataLoaded',
        'isInventoryDataLoading',
        'unitsForChannel',
        'savableUnits',
        'dirtyNotSaved',
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
      updateMaster(eventData, units) {
        units.forEach((unit) => {
          if(eventData.hasOwnProperty('newNoOfPlacedUnits') && eventData.newNoOfPlacedUnits === 'Current') {
            this.updateUnit({ newNoOfPlacedUnits: unit.currentNoOfPlacedUnits }, unit);
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
              newNoOfPlacedUnits: unit.noOfPlacedUnits
            },
            eventData
          );

          this[mutationTypes.INVENTORY_UPDATE]({
            unitID: unit.id,
            value: updateValue
          });
        });
      },

      updateUnit(eventData, unit) {
        let accepted;

        if (eventData.hasOwnProperty('newNoOfPlacedUnits')) {
          accepted =
            unit.currentNoOfPlacedUnits !== eventData.newNoOfPlacedUnits ||
            unit.currentStopSignal !== unit.newStopSignal;
        } else if (eventData.hasOwnProperty('newStopSignal')) {
          accepted =
            unit.currentNoOfPlacedUnits !== unit.newNoOfPlacedUnits ||
            unit.currentStopSignal !== eventData.newStopSignal;
        } else {
          accepted = unit.accepted;
        }

        const value = Object.assign({accepted}, eventData);

        this[mutationTypes.INVENTORY_UPDATE]({
          value,
          unitID: unit.id
        });
      },

      uncheckSelectedUnits() {
        this._resetBulkCheckboxes();

        this[mutationTypes.INVENTORY_BULK_UPDATE]({
          unitIDs: this.selectedUnitIDs,
          value: {
            checked: false
          }
        });
      },

      handleUnitCheck(units, isChecked) {
        this[mutationTypes.INVENTORY_BULK_UPDATE]({
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

      isChannelTypeChecked(unit) {
        return Boolean(
          this.selectedChannels.find(
            (selectedChannel) => selectedChannel.id === unit.channel.id
          )
        );
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

      onApply() {
        this.selectedUnits.forEach((unit) => {
          const newStopSignal = this._getNewUnitStopSignal(unit);
          const newNoOfPlacedUnits = this._getNewNoOfPlacedUnits(unit);
          const newStopSignalMode = this.toolbarAvailabilityMode ? this.toolbarAvailabilityMode : unit.stopSignalMode;
          const newPlacedUnitsMode = this.toolbarPlacedUnitsMode ? this.toolbarPlacedUnitsMode : unit.placedUnitsMode;

          const accepted =
            newStopSignal !== unit.currentStopSignal ||
            newNoOfPlacedUnits !== unit.currentNoOfPlacedUnits ||
            // This is due to the special request that you can override the
            // PS value with the toolbar
            this.toolbarPSValue === unit.currentNoOfPlacedUnits ||
            newStopSignalMode !== unit.stopSignalMode ||
            newPlacedUnitsMode !== unit.placedUnitsMode;

          this[mutationTypes.INVENTORY_UPDATE]({
            unitID: unit.id,
            value: {
              newStopSignal,
              newNoOfPlacedUnits,
              accepted,
              newStopSignalMode,
              newPlacedUnitsMode
            }
          });
        });

        this.toolbarPSValue = null;
        this.toolbarAvailability = '';
      },

      onAccept() {
        this.selectedUnits.forEach((unit) => {
          const newNoOfPlacedUnits = this.hasPlacedUnitsControls ?
            unit.noOfPlacedUnits :
            unit.currentNoOfPlacedUnits;
          const newStopSignal =
            !this.hasAltAvailabilityControls &&
              unit.channel.id === this.channels.ALT.id ?
              unit.currentStopSignal :
              unit.stopSignal;

          this[mutationTypes.INVENTORY_UPDATE]({
            unitID: unit.id,
            value: {
              newNoOfPlacedUnits,
              newStopSignal,
              accepted: true
            }
          });
        });
      },

      onRevert() {
        this.selectedUnits.forEach((unit) => {
          this[mutationTypes.INVENTORY_UPDATE]({
            unitID: unit.id,
            value: {
              newStopSignal: unit.currentStopSignal,
              newNoOfPlacedUnits: unit.currentNoOfPlacedUnits,
              newStopSignalMode: unit.stopSignalMode,
              newPlacedUnitsMode: unit.placedUnitsMode,
              accepted: false
            }
          });
        });
      },

      onAcceptOrRevertAll() {
        const action = this.unitsWithSuggestion.length ?
          this._acceptAll :
          this._revertAll;
        action();
      },

      _acceptAll() {
        this.unitsWithSuggestion.forEach((unit) => {
          const newNoOfPlacedUnits = this.hasPlacedUnitsControls ?
            unit.noOfPlacedUnits :
            unit.currentNoOfPlacedUnits;
          const newStopSignal =
            !this.hasAltAvailabilityControls &&
              unit.channel.id === this.channels.ALT.id ?
              unit.currentStopSignal :
              unit.stopSignal;

          this[mutationTypes.INVENTORY_UPDATE]({
            unitID: unit.id,
            value: {
              newNoOfPlacedUnits,
              newStopSignal,
              accepted: true
            }
          });
        });
      },

      _revertAll() {
        this.savableUnits.forEach((unit) => {
          const updateValue = {
            newStopSignal: unit.stopSignal,
            newNoOfPlacedUnits: unit.noOfPlacedUnits,
            accepted: false
          };

          this[mutationTypes.INVENTORY_UPDATE]({
            unitID: unit.id,
            value: updateValue
          });
        });
      },

      _getNewUnitStopSignal(unit) {
        return !this.toolbarAvailability || this.toolbarAvailability === 'Current' ?
          unit.currentStopSignal :
          this.toolbarAvailability === availabilities.STOP;
      },

      _getNewNoOfPlacedUnits(unit) {
        const noOfPlacedUnits = unit.currentNoOfPlacedUnits ?
          unit.currentNoOfPlacedUnits :
          unit.newNoOfPlacedUnits;
        return isTruthyOrZero(this.toolbarPSValue) && this.toolbarPSValue !== 'Current' ?
          this.toolbarPSValue :
          noOfPlacedUnits;
      },

      saveUnits() {
        this.saveInventory(this.savableUnits);
      },

      onFilterUpdate(filter) {
        if(this.savableUnits.length) {
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

      // handleUpdateWithApply(filterInfo) {
      //   if (this.savableUnits.length) {
      //     this.pendingFilterInfo = filterInfo;
      //     this.showConfirm();
      //   } else {
      //     this.updateAndApplyFilters(filterInfo);
      //   }
      // },
      //
      //
      // updateAndApplyFilters(filterInfo) {
      //   this[mutationTypes.INVENTORY_FILTER_UPDATE](filterInfo);
      //   if (this.isFiltersReady) {
      //     this.applyFilters();
      //   }
      // },
      //
      //
      // applyFilters() {
      //   if (this.localFilter.value) {
      //     this.fetchUnits();
      //     this._resetBulkCheckboxes();
      //   } else {
      //     this.clearFilterValue(this.localFilter.id);
      //   }
      // },

      updateVisibleChannels(value) {
        this[mutationTypes.INVENTORY_VISIBLE_CHANNELS_UPDATE](value);
      },

      updateSelectedUnitScope(value) {
        this._confirmAndFetchUnits(
          mutationTypes.INVENTORY_UNIT_SCOPE_UPDATE,
          value
        );
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
          this.saveInventory(this.savableUnits);
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

      onActionToolbarSubmit() {
        this.toolbarPSValue = null;
        this.saveInventory(this.savableUnits);
        this.uncheckSelectedUnits();
      },

      isUnitTypeChecked(unit) {
        return this.checkedUnitTypes.includes(unit.unitType.id);
      },

      isUnitDateChecked(unit) {
        return this.checkedDates.includes(unit.bookingDate);
      },

      discardWarning() {
        this.closeWarnings();
        this.saveInventory(this.savableUnits);
      },

      addAllUnits() {
        this.saveUnits();
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

      ...mapActions('inventory', [
        'fetchUnits',
        'saveToStorage',
        'loadFromStorage',
      ]),

      ...mapMutations('inventory', [
        mutationTypes.INVENTORY_UPDATE,
        mutationTypes.INVENTORY_BULK_UPDATE,
        mutationTypes.INVENTORY_VISIBLE_CHANNELS_UPDATE,
        mutationTypes.INVENTORY_UNIT_SCOPE_UPDATE
      ]),

      ...mapActions('checkout', ['saveInventory'])
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

  .override.action-toolbar {
    background-color: $color-white;
  }

  .units-container {
    height: calc(100vh - #{($min-filter-height + $smaller-action-footer-height)});
  }

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

  .units-filters {
    @include filters;

    background-color: $color-bg-main-dimmed;
    border-bottom: 1px solid $color-border-main;

    &.has-data {
      border-bottom: 0;
      padding-bottom: 0;
    }
  }

  .channels-filter {
    margin-left: auto;
    margin-right: 48px;
  }
</style>
