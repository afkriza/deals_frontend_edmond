import { unique } from 'utils/collection';

const onUnitsDateUpdate = function(isChecked, event, targetDate) {
  const lastChangedDate = isChecked
    ? this.lastCheckedDate
    : this.lastUncheckedDate;
  const isDateRange = event.shiftKey && lastChangedDate;
  const dates = this.provideDateRange(isDateRange, targetDate, lastChangedDate);

  if (isChecked) {
    this.checkedDates = unique([...this.checkedDates, ...dates]);
    this.lastCheckedDate = targetDate;
  } else {
    const startIndex = this.checkedDates.indexOf(dates[0]) !== -1 ? 0 : 1;
    const spliceLength = dates.length === 1 ? 1 : dates.length - 1;
    this.checkedDates.splice(
      this.checkedDates.indexOf(dates[startIndex]),
      spliceLength
    );
    this.lastUncheckedDate = targetDate;
  }

  this.handleUnitStatesAndChecks();
};

const handleUnitStatesAndChecks = function() {
  this.units.forEach(unit => {
    this.handleUnitStates(unit);
  });

  this.handleUnitCheck(this.checkedUnits, true);
  this.handleUnitCheck(this.uncheckedUnits, false);

  this.resetUnitChecks();
};

const onUnitTypeUpdate = function(isChecked, unitTypeId) {
  if (isChecked) {
    this.checkedUnitTypes.push(unitTypeId);
  } else {
    this.checkedUnitTypes.splice(this.checkedUnitTypes.indexOf(unitTypeId), 1);
  }

  this.handleUnitStatesAndChecks();
};

const handleUnitStates = function(unit) {
  if (!this.isChannelTypeChecked(unit)) {
    this.uncheckedUnits.push(unit.id);
  } else if (
    this.checkedUnitTypes.length &&
    this.checkedDates.length &&
    this.isUnitTypeChecked(unit) &&
    this.isUnitDateChecked(unit)
  ) {
    this.checkedUnits.push(unit.id);
  } else if (
    this.checkedUnitTypes.length &&
    this.checkedDates.length &&
    (!this.isUnitTypeChecked(unit) || !this.isUnitDateChecked(unit))
  ) {
    this.uncheckedUnits.push(unit.id);
  } else if (
    this.checkedUnitTypes.length &&
    !this.checkedDates.length &&
    this.isUnitTypeChecked(unit)
  ) {
    this.checkedUnits.push(unit.id);
  } else if (
    !this.checkedUnitTypes.length &&
    this.checkedDates.length &&
    this.isUnitDateChecked(unit)
  ) {
    this.checkedUnits.push(unit.id);
  } else {
    this.uncheckedUnits.push(unit.id);
  }
};

export const unitPage = {
  methods: {
    onUnitsDateUpdate,
    onUnitTypeUpdate,
    handleUnitStates,
    handleUnitStatesAndChecks
  }
};
