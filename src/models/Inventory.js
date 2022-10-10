import Unit from 'models/Unit';
import allowedPlacedUnits from 'enums/no-of-placed-units-levels';
import unitModes from 'enums/unit-modes';
import { isTruthyOrZero } from 'utils/number';
import { UNDEFINED } from 'constants/variable-types';

export default class Inventory extends Unit {
  constructor(data) {
    super(data);
    this.noOfPlacedUnits = data.noOfPlacedUnits;
    this.placedUnitsMode = data.placedUnitsMode;

    // Neccessary because checkout doesn't have noOfPlacedUnitsOnPhobs
    // Discuss potential renaming and/or refactoring with backend devs
    if (
      data.noOfPlacedUnitsOnPhobs !== UNDEFINED &&
      data.newNoOfPlacedUnits !== null
    ) {
      this.currentNoOfPlacedUnits = data.noOfPlacedUnitsOnPhobs;
    } else {
      this.currentNoOfPlacedUnits = data.currentNoOfPlacedUnits;
    }

    this.noOfFreeUnits = data.noOfFreeUnits;
    this.noOfOverbookedUnits = data.noOfOverbookedUnits;
    this.newNoOfPlacedUnits =
      isTruthyOrZero(data.newNoOfPlacedUnits) || this.currentNoOfPlacedUnits;
    this.noOfBookedUnits = data.noOfBookedUnits;
    this.currentNoOfBookedUnits = data.currentNoOfBookedUnits;

    this.newPlacedUnitsMode = data.newPlacedUnitsMode || this.placedUnitsMode;

    if (
      data.newNoOfPlacedUnits !== UNDEFINED &&
      data.newNoOfPlacedUnits !== null
    ) {
      this.newNoOfPlacedUnits = data.newNoOfPlacedUnits;
    } else {
      this.newNoOfPlacedUnits = this.currentNoOfPlacedUnits;
    }
  }

  setValue(value) {
    if (value.newNoOfPlacedUnits !== UNDEFINED) {
      this.newNoOfPlacedUnits = value.newNoOfPlacedUnits;
    }

    if (value.newPlacedUnitsMode !== UNDEFINED) {
      this.newPlacedUnitsMode = value.newPlacedUnitsMode;
    }

    super.setValue(value);
  }

  isEqual(object) {
    const isUnitEqual = super.isEqual(object);
    const equalNewNoOfPlacedUnits =
      this.newNoOfPlacedUnits === object.newNoOfPlacedUnits;

    return isUnitEqual && equalNewNoOfPlacedUnits;
  }

  clone() {
    return new Inventory(this);
  }

  updateUnit() {
    super.updateUnit();
    this.currentNoOfPlacedUnits = this.newNoOfPlacedUnits;
    this.noOfPlacedUnits = this.newNoOfPlacedUnits;
  }

  get hasSuggestion() {
    const isDataDiff =
      (this.noOfPlacedUnits !== this.currentNoOfPlacedUnits &&
        this.newStopSignal === false) ||
      this.noOfBookedUnits !== this.currentNoOfBookedUnits;

    return (isDataDiff || super.hasSuggestion) && !this.accepted;
  }

  get hasPSSuggestion() {
    return this.noOfPlacedUnits !== this.currentNoOfPlacedUnits;
  }

  get isDirty() {
    return (
      this.isNoOfPlacedUnitsDirty ||
      super.isAvailabilityDirty ||
      this.isPlacedUnitsModeDirty ||
      super.isAvailabilityModeDirty
    );
  }

  get isNoOfPlacedUnitsDirty() {
    return (
      this.newNoOfPlacedUnits !== this.currentNoOfPlacedUnits &&
      !isNaN(this.newNoOfPlacedUnits)
    );
  }

  get isValid() {
    return allowedPlacedUnits.includes(this.newNoOfPlacedUnits);
  }

  get localID() {
    return `Inventory_${this.id}`;
  }

  get hasFixedState() {
    return (
      this.placedUnitsMode === unitModes.FIXED ||
      this.stopSignalMode === unitModes.FIXED
    );
  }

  get isAvailabilityAuto() {
    return this.stopSignalMode === unitModes.AUTO;
  }

  get isPlacedUnitsAuto() {
    return this.placedUnitsMode === unitModes.AUTO;
  }

  get isPlacedUnitsModeDirty() {
    return this.placedUnitsMode !== this.newPlacedUnitsMode;
  }

  get hasAutoState() {
    return this.isAvailabilityAuto || this.isPlacedUnitsAuto;
  }

  resetChanges() {
    super.resetChanges();

    this.newNoOfPlacedUnits = this.currentNoOfPlacedUnits;
    this.newPlacedUnitsMode = this.placedUnitsMode;
  }
}
