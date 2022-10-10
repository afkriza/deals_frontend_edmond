import { first, keyBy, keys, map, mapValues, max } from 'lodash';
import { parseISO } from 'date-fns';

type Property = {
  id: string;
  name: string;
};

type DateRange = {
  dateFrom: Date;
  dateTo: Date;
};

type Partner = {
  id: string;
  name: string;
};

type RoomType = {
  id: string;
  name: string;
};

export enum UnitType {
  Single = 'single',
  Double = 'double',
  Triple = 'triple',
  Family = 'family',
  Suite = 'suite'
}

type AnalysisGroupUnit = {
  unitType: UnitType;
  quantity: number;
  price: number;
};

export type AnalysisGroup = {
  dateRange: DateRange;
  units: AnalysisGroupUnit[];
};

export type Range = {
  from: number;
  to: number;
};

export type AnalysisData = {
  cancellationProbability: number;
  washFactor: number;
  recommendedPriceEquations: { terms: { [key in UnitType]: number } };
  breakEvenPriceEquations: {
    fraction: {
      denominator: {
        ratios: {
          [key in UnitType]: number;
        };
      };
      numerator;
    };
  };
  initPrices: { [key in UnitType]: number };
  history: {
    [key in UnitType]: {
      count: number[];
      median: number;
      prices: number[];
      q1: number;
      q3: number;
    };
  };
  bookingPeriods: {
    all: {
      adr: {
        a: {
          [key in UnitType]: number;
        };
        b: number;
        from: number;
      };
      booking: number;
      capacity: number;
      displacement: number;
      forecast: number;
      groupRooms: number;
      missingRooms: boolean;
      occupancy: Range;
      revenue: {
        a: {
          [key in UnitType]: number;
        };
        b: number;
        from: number;
      };
    };
    byDay: {
      adr: number[];
      adrWithGroup: { a: { [key in UnitType]: number }; b: number }[];
      bookingDates: string[];
      bookings: number[];
      capacity: number;
      displacements: number[];
      forecasts: number[];
      groupRooms: number[];
    };
    name: string;
  }[];
  ranges: {
    [key in UnitType]: Range;
  };
};

export default class AnalysisCalculator {
  property: Property;
  partner: Partner;
  groups: AnalysisGroup[];
  analysisData: AnalysisData;

  selectedUnitType: UnitType = UnitType.Single;

  isLoading = false;
  isError = false;

  private constructor(
    property: Property,
    partner: Partner,
    groups: AnalysisGroup[],
    analysisData: AnalysisData
  ) {
    this.property = property;
    this.partner = partner;
    this.groups = groups;

    this.analysisData = analysisData;
  }

  get filters() {
    return {
      propertyId: this.property.id,
      partnerId: this.partner.id,
      subchannel: 'Grupe',
      dateRanges: map(this.groups, group => ({
        dateFrom: group.dateRange.dateFrom,
        dateTo: group.dateRange.dateTo,
        rooms: mapValues(keyBy(group.units, 'unitType'), 'quantity')
      }))
    };
  }

  get firstGroup() {
    return first(this.groups);
  }

  get unitTypeInfoByUnitType() {
    return keyBy(this.firstGroup.units, 'unitType');
  }

  get roomPrices() {
    return mapValues(this.unitTypeInfoByUnitType, 'price');
  }

  get cancellationProbability() {
    return this.analysisData.cancellationProbability;
  }

  get washFactor() {
    return this.analysisData.washFactor;
  }

  get breakEvenPrice() {
    const {
      breakEvenPriceEquations: {
        fraction: {
          denominator: { ratios },
          numerator
        }
      }
    } = this.analysisData;

    return Math.round(
      ((numerator /
        ((ratios[UnitType.Single] * this.roomPrices[UnitType.Single]) /
          this.roomPrices[UnitType.Double] +
          (ratios[UnitType.Double] * this.roomPrices[UnitType.Double]) /
            this.roomPrices[UnitType.Double] +
          (ratios[UnitType.Triple] * this.roomPrices[UnitType.Triple]) /
            this.roomPrices[UnitType.Double] +
          (ratios[UnitType.Family] * this.roomPrices[UnitType.Family]) /
            this.roomPrices[UnitType.Double] +
          (ratios[UnitType.Suite] * this.roomPrices[UnitType.Suite]) /
            this.roomPrices[UnitType.Double])) *
        this.roomPrices[this.selectedUnitType]) /
        this.roomPrices[UnitType.Double]
    );
  }

  get recommendedPrice() {
    const {
      recommendedPriceEquations: { terms }
    } = this.analysisData;

    return Math.max(terms[this.selectedUnitType], this.breakEvenPrice);
  }

  get selectedUnitTypePrice() {
    return this.roomPrices[this.selectedUnitType];
  }

  set selectedUnitTypePrice(newPrice: number) {
    const currentPrice =
      this.unitTypeInfoByUnitType[this.selectedUnitType].price;

    const ratio = newPrice / currentPrice;

    this.firstGroup.units = map(this.firstGroup.units, unit => ({
      ...unit,
      price: unit.price * ratio
    }));
  }

  get historyData() {
    return this.analysisData.history[this.selectedUnitType];
  }

  get bookingPeriods() {
    return this.analysisData.bookingPeriods;
  }

  get range() {
    return this.analysisData.ranges[this.selectedUnitType];
  }

  static from(
    property: Property,
    partner: Partner,
    groups,
    analysisData: AnalysisData
  ) {
    const { initPrices } = analysisData;

    const analysisGroups = map(groups, group => ({
      dateRange: {
        dateFrom: parseISO(group.dateFrom),
        dateTo: parseISO(group.dateTo)
      },
      units: map(keys(group.rooms), (roomId: UnitType) => ({
        unitType: roomId,
        quantity: group.rooms[roomId],
        price: initPrices[roomId]
      }))
    }));

    return new AnalysisCalculator(
      property,
      partner,
      analysisGroups,
      analysisData
    );
  }
}
