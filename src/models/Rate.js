import Unit from 'models/Unit';
import unitModes from 'enums/unit-modes';
import { UNDEFINED } from 'constants/variable-types';
import { padStart, zipObject } from 'lodash';

export default class Rate extends Unit {
  constructor({
    priceLevels,
    priceAmounts,
    defaultPriceLevel,
    defaultPriceAmount,
    ...unitData
  }) {
    super(unitData);

    this.currentPriceLevel =
      String(unitData.currentPriceLevel || '') || defaultPriceLevel;
    this.currentPriceAmount =
      Math.floor(Number(unitData.currentPriceAmount || '')) ||
      defaultPriceAmount;

    this.priceLevelMode = unitData.priceLevelMode;

    this.priceLevel = padStart(String(unitData.priceLevel), 2, '0');
    this.priceAmount = Math.floor(Number(unitData.priceAmount));

    this.priceLevels = priceLevels;
    this.priceAmounts = priceAmounts;

    this.newPriceLevel = unitData.newPriceLevel || this.currentPriceLevel;
    this.newPriceLevelMode = unitData.newPriceLevelMode || this.priceLevelMode;

    this.basePriceIndex = this.priceAmounts
      ? this.priceAmounts.indexOf(defaultPriceAmount)
      : -1;
  }

  get pricesByPriceLevel() {
    return zipObject(this.priceLevels, this.priceAmounts);
  }

  setValue(value) {
    if (value.newPriceLevel !== UNDEFINED) {
      this.newPriceLevel = value.newPriceLevel;
    }

    if (value.newPriceLevelMode !== UNDEFINED) {
      this.newPriceLevelMode = value.newPriceLevelMode;
    }

    super.setValue(value);
  }

  isEqual(object) {
    const isUnitEqual = super.isEqual(object);
    const equalNewPriceLevel = this.newPriceLevel === object.newPriceLevel;

    return isUnitEqual && equalNewPriceLevel;
  }

  clone() {
    return new Rate(this);
  }

  updateUnit() {
    super.updateUnit();
    this.currentPriceLevel = this.newPriceLevel;
    this.priceLevel = this.newPriceLevel;
  }

  get newPriceAmount() {
    return this.pricesByPriceLevel[this.newPriceLevel];
  }

  get hasSuggestion() {
    const isDataDiff =
      this.priceLevel !== this.currentPriceLevel &&
      this.newStopSignal === false;

    return (isDataDiff || super.hasSuggestion) && !this.accepted;
  }

  get hasPriceLevelSuggestion() {
    return this.currentPriceLevel !== this.priceLevel;
  }

  get isDirty() {
    return (
      this.isPriceLevelDirty ||
      super.isAvailabilityDirty ||
      this.isPriceLevelModeDirty ||
      super.isAvailabilityModeDirty
    );
  }

  get isPriceLevelDirty() {
    return (
      this.newPriceLevel !== this.currentPriceLevel &&
      !isNaN(this.newPriceLevel)
    );
  }

  get isValid() {
    return this.priceLevels.includes(this.newPriceLevel);
  }

  get localID() {
    return `Rate_${this.id}`;
  }

  get hasFixedState() {
    return (
      this.priceLevelMode === unitModes.FIXED ||
      this.stopSignalMode === unitModes.FIXED
    );
  }

  get isAvailabilityAuto() {
    return this.stopSignalMode === unitModes.AUTO;
  }

  get isPriceLevelAuto() {
    return this.priceLevelMode === unitModes.AUTO;
  }

  get hasAutoState() {
    return this.isAvailabilityAuto || this.isPriceLevelAuto;
  }

  get isPriceLevelModeDirty() {
    return this.priceLevelMode !== this.newPriceLevelMode;
  }

  resetChanges() {
    super.resetChanges();

    this.newPriceLevel = this.currentPriceLevel;
    this.newPriceLevelMode = this.priceLevelMode;
  }
}
