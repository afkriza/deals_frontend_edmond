import { isPast, parseISO } from 'date-fns';
import { UNDEFINED } from 'constants/variable-types';

export default class Unit {
  constructor({
    _id,
    _rev,
    id,
    bookingDate,
    property,
    unitType,
    aggregateUnitType,
    channel,
    stopSignal,
    currentStopSignal,
    newStopSignal,
    accepted,
    stopSignalMode,
    newStopSignalMode
  }) {
    this._rev = _rev;
    this._id = _id || id;
    this.id = id;
    this.bookingDate = bookingDate;

    this.stopSignal = Boolean(stopSignal);
    this.currentStopSignal = Boolean(currentStopSignal);

    this.property = property;
    this.unitType = unitType || aggregateUnitType;
    this.aggregateUnitType = this.unitType;
    this.channel = channel;

    this.accepted = typeof accepted === 'boolean' ? accepted : false;
    this.confirmed = false;
    this.checked = false;

    this.newStopSignal =
      typeof newStopSignal === 'boolean'
        ? newStopSignal
        : this.currentStopSignal;
    this.stopSignalMode = stopSignalMode;

    this.lastActivity = null;
    this.isDateInPast = isPast(parseISO(this.bookingDate));
    this.newStopSignalMode = newStopSignalMode || stopSignalMode;
  }

  get isActive() {
    return !this.newStopSignal;
  }

  get isStopped() {
    return this.newStopSignal;
  }

  get isAccepted() {
    return this.accepted;
  }

  setValue(value) {
    const allowedBooleanProperties = ['newStopSignal', 'accepted', 'checked'];
    const allowedOtherProperties = ['newStopSignalMode'];

    allowedBooleanProperties.forEach(property => {
      if (typeof value[property] === 'boolean') {
        this[property] = value[property];
      }
    });

    allowedOtherProperties.forEach(property => {
      if (value[property] !== UNDEFINED) {
        this[property] = value[property];
      }
    });
  }

  updateUnit() {
    this.currentStopSignal = this.newStopSignal;
    this.stopSignal = this.newStopSignal;
    this.accepted = false;
  }

  isEqual(object) {
    const isInstanceOfUnit = object instanceof Unit;
    const equalID = this.id === object.id;
    const equalNewStopSignal = this.newStopSignal === object.newStopSignal;

    return isInstanceOfUnit && equalID && equalNewStopSignal;
  }

  isMatchingActivity(activity) {
    return (
      this.unitType.id === activity.unitType.id &&
      this.property.id === activity.property.id &&
      this.channel.id === activity.channel.id &&
      this.bookingDate === activity.bookingDate
    );
  }

  get hasSuggestion() {
    return this.stopSignal !== this.currentStopSignal;
  }

  get hasAvailabilitySuggestion() {
    return this.currentStopSignal !== this.stopSignal;
  }

  get isAvailabilityDirty() {
    return this.newStopSignal !== this.currentStopSignal;
  }

  get isAvailabilityModeDirty() {
    return this.newStopSignalMode !== this.stopSignalMode;
  }

  get updatedStatus() {
    if (this.isAvailabilityDirty) {
      return this.newStopSignal ? 'Stop' : 'Open';
    }

    return null;
  }

  resetChanges() {
    this.accepted = false;
    this.newStopSignal = this.currentStopSignal;
    this.newStopSignalMode = this.stopSignalMode;
  }
}
