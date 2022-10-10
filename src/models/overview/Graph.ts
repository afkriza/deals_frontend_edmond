import { ComponentModel } from '@/interfaces/ComponentModel';
import {
  AdrCurveDto,
  BookingCurveDto,
  CancellationRateDto,
  ChannelBreakdownDto,
  ExpectedBookingByAggregatedRoomDto,
  ExpectedBookingByChannelDto,
  LongtermPredictionsDto,
  MidtermBookingDto,
  PriceBasketDto,
  RateShopperPriceDto,
  RateShopperPriceVsValueDto,
  RoomBreakdownDto,
  TwinsAnalysisDto
} from '@/dtos/graphs';
import {
  DEFAULT_GRAPH_HEIGHT,
  STACKED_GRAPH_HEIGHT
} from '@/constants/overview';
import { parseISO } from 'date-fns';
import { every, isNull } from 'lodash';

interface OverviewSidebarItem {
  title: string;
  description: string;
}

export class ChannelBreakdown implements ComponentModel, OverviewSidebarItem {
  constructor(
    public channels: string[],
    public nettoBookings: number[],
    public expectedCancellations: number[],
    public nettoBookingsBase: number[],
    public expectedCancellationsBase: number[]
  ) {}

  get component() {
    return 'ChannelBreakdown';
  }

  get title() {
    return 'Channel vs Expected Cancellation Breakdown';
  }

  get description() {
    return '';
  }

  get props() {
    return {
      channels: this.channels,
      nettoBookings: this.nettoBookings,
      expectedCancellations: this.expectedCancellations
    };
  }

  static deserialize({
    channels,
    netoBookings,
    expectedCancellations,
    baseBooking,
    baseCancellations
  }: ChannelBreakdownDto) {
    return new ChannelBreakdown(
      channels,
      netoBookings,
      expectedCancellations,
      baseBooking,
      baseCancellations
    );
  }
}

export class TwinsAnalysis implements ComponentModel, OverviewSidebarItem {
  constructor(
    public dates: string[],
    public numberOfRooms: number[],
    public date: string
  ) {}

  get component() {
    return 'TwinsAnalysis';
  }

  get title() {
    return 'Twins analysis';
  }

  get description() {
    return 'Current booking compared to its similar (twin) days, i.e. 1 & 2 days before and after current date; 1 & 2 weeks before and after current date.';
  }

  get props() {
    return {
      dates: this.dates,
      numberOfRooms: this.numberOfRooms,
      date: parseISO(this.date)
    };
  }

  static deserialize({ dates, bookingRooms, date }: TwinsAnalysisDto) {
    return new TwinsAnalysis(dates, bookingRooms, date);
  }
}

export class RoomBreakdown implements ComponentModel {
  constructor(
    public rooms: string[],
    public bookings: number[],
    public base: number[]
  ) {}

  get component() {
    return 'RoomBreakdown';
  }

  get title() {
    return 'Booking vs Room Breakdown';
  }

  get description() {
    return '';
  }

  get props() {
    return {
      rooms: this.rooms,
      bookings: this.bookings,
      base: this.base
    };
  }

  static deserialize({ rooms, bookings, base }: RoomBreakdownDto) {
    return new RoomBreakdown(rooms, bookings, base);
  }
}

export class MidtermBooking implements ComponentModel {
  constructor(
    public booking: number,
    public mean: number,
    public std: number
  ) {}

  get component() {
    return 'MidtermBooking';
  }

  get title() {
    return 'Expected booking';
  }

  get description() {
    return 'Current booking compared to expected booking. Further you are away from the peak of distribution, the more unexpected current booking is.';
  }

  get props() {
    return {
      booking: this.booking,
      mean: this.mean,
      std: this.std
    };
  }

  static deserialize({
    bookingRooms,
    bookingRoomsMean,
    bookingRoomsStd
  }: MidtermBookingDto) {
    return new MidtermBooking(bookingRooms, bookingRoomsMean, bookingRoomsStd);
  }
}

export class ExpectedBookingByChannel
  implements ComponentModel, OverviewSidebarItem
{
  constructor(
    public channels: string[],
    public booking: number[],
    public median: number[],
    public q1: number[],
    public q3: number[],
    public min: number[],
    public max: number[]
  ) {}

  get component() {
    return 'ExpectedBookingByChannel';
  }

  get title() {
    return 'Expected booking by market segment';
  }

  get description() {
    return 'Current booking by channel. Box plot gives you range of values which can be expected based on historical data.';
  }

  get props() {
    return {
      channels: this.channels,
      median: this.median,
      q1: this.q1,
      q3: this.q3,
      min: this.min,
      max: this.max,
      booking: this.booking
    };
  }

  static deserialize({
    median,
    channel,
    currentBooking,
    q1,
    q3,
    min,
    max
  }: ExpectedBookingByChannelDto) {
    return new ExpectedBookingByChannel(
      channel,
      currentBooking,
      median,
      q1,
      q3,
      min,
      max
    );
  }
}

export class RateShopperPriceVsValue
  implements ComponentModel, OverviewSidebarItem
{
  constructor(
    public x: number[],
    public y: number[],
    public propertyNames: string[],
    public currentPrice: number,
    public predictedPrice: number,
    public currentScore: number,
    public a: number,
    public b: number,
    public ourProperties: string[],
    public xRange: [number, number],
    public yRange: [number, number]
  ) {}

  get component() {
    return 'RateShopperPriceVsValue';
  }

  get title() {
    return 'Rateshopper price vs. value';
  }

  get description() {
    return 'Price relation to property score on booking.com. Linear model is fitted to show expected price for property score.';
  }

  get props() {
    return {
      x: this.x,
      y: this.y,
      properties: this.propertyNames,
      currentPrice: this.currentPrice,
      predictedPrice: this.predictedPrice,
      currentScore: this.currentScore,
      a: this.a,
      b: this.b,
      ourProperties: this.ourProperties,
      xRange: this.xRange,
      yRange: this.yRange
    };
  }

  static deserialize({
    x,
    y,
    propertyNames,
    currentPrice,
    predictedPrice,
    currentScore,
    a,
    b,
    ourProperties,
    xRange,
    yRange
  }: RateShopperPriceVsValueDto) {
    return new RateShopperPriceVsValue(
      x,
      y,
      propertyNames,
      currentPrice,
      predictedPrice,
      currentScore,
      a,
      b,
      ourProperties,
      xRange,
      yRange
    );
  }
}

export class RateShopperPrice implements ComponentModel, OverviewSidebarItem {
  constructor(
    public compset: string[],
    public currentPrice: number[],
    public compsetPriceArray: number[][],
    public properties: string[][]
  ) {}

  get component() {
    return 'RateShopperPrice';
  }

  get title() {
    return 'Rateshopper price';
  }

  get description() {
    return 'Current price compared to competition prices. For different comp sets violin plot shows distribution of competition prices.';
  }

  get props() {
    return {
      compset: this.compset,
      currentPrices: this.currentPrice,
      priceMatrix: this.compsetPriceArray,
      properties: this.properties
    };
  }

  static deserialize({
    compset,
    currentPrice,
    compsetPriceArray,
    properties
  }: RateShopperPriceDto) {
    return new RateShopperPrice(
      compset,
      currentPrice,
      compsetPriceArray,
      properties
    );
  }
}

export class BookingCurve implements ComponentModel, OverviewSidebarItem {
  constructor(
    public bookingCurrentX: number[],
    public bookingCurrentY: number[],
    public bookingPastX: number[],
    public bookingPastY: number[],
    public paceXCurrent: number[],
    public paceYCurrent: number[],
    public paceXPast: number[],
    public paceYPast: number[],
    public date: string
  ) {}

  get component() {
    return 'BookingCurve';
  }

  get title() {
    return 'Booking curve';
  }

  get description() {
    return 'This year booking curve compared to last year. Bar chart displays comparison between current and last year pace for 1, 7 and 30 days.';
  }

  get props() {
    return {
      bookingCurrentX: this.bookingCurrentX,
      bookingCurrentY: this.bookingCurrentY,
      bookingPastX: this.bookingPastX,
      bookingPastY: this.bookingPastY,
      paceXCurrent: this.paceXCurrent,
      paceYCurrent: this.paceYCurrent,
      paceXPast: this.paceXPast,
      paceYPast: this.paceYPast,
      height: STACKED_GRAPH_HEIGHT,
      date: parseISO(this.date)
    };
  }

  static deserialize({
    bookingCurveCurrent,
    bookingCurvePast,
    paceDataCurrent,
    paceDataPast,
    date
  }: BookingCurveDto) {
    return new BookingCurve(
      bookingCurveCurrent.diff,
      bookingCurveCurrent.booking,
      bookingCurvePast.diff,
      bookingCurvePast.booking,
      paceDataCurrent.pace,
      paceDataCurrent.diff,
      paceDataPast.pace,
      paceDataPast.diff,
      date
    );
  }
}

export class CancellationRate implements ComponentModel, OverviewSidebarItem {
  constructor(
    public bookingWindow: number[],
    public cancellationRate: number[],
    public pieLabels: string[],
    public pieValuesCurrent: number[],
    public pieValuesHistory: number[],
    public date: string,
    public noOfOverbookedUnits: number
  ) {}

  get component() {
    return 'CancellationRate';
  }

  get title() {
    return 'Cancellation rate';
  }

  get description() {
    return `Line chart shows ratio between historical cancellation and booking.${
      this.hasPieCharts
        ? ' Pie charts show you of all reservations that were booked for this day how many have been canceled.'
        : ''
    }`;
  }

  get hasPieCharts() {
    return !(
      every(this.pieValuesCurrent, isNull) &&
      every(this.pieValuesHistory, isNull)
    );
  }

  get props() {
    return {
      bookingWindow: this.bookingWindow,
      cancellationRate: this.cancellationRate,
      pieLabels: this.pieLabels,
      pieValuesCurrent: this.pieValuesCurrent,
      pieValuesHistory: this.pieValuesHistory,
      height: this.hasPieCharts ? STACKED_GRAPH_HEIGHT : DEFAULT_GRAPH_HEIGHT,
      showPie: this.hasPieCharts,
      date: parseISO(this.date),
      expectedCancellations: this.noOfOverbookedUnits
    };
  }

  static deserialize({
    bookingWindow,
    cancellationRate,
    pieLabels,
    pieValuesCurrent,
    pieValuesHistory,
    date,
    noOfOverbookedUnits
  }: CancellationRateDto) {
    return new CancellationRate(
      bookingWindow,
      cancellationRate,
      pieLabels,
      pieValuesCurrent,
      pieValuesHistory,
      date,
      noOfOverbookedUnits
    );
  }
}

export class AdrCurve implements ComponentModel, OverviewSidebarItem {
  constructor(
    public bookingWindow: number[],
    public currentDailyRate: number[],
    public currentCumulativeRate: number[],
    public historyCumulativeRate: number[],
    public date: string
  ) {}

  get component() {
    return 'AdrCurve';
  }

  get title() {
    return 'ADR curve';
  }

  get description() {
    return 'Dots show current ADR by date. Line chart compares current and last year cumulative ADR.';
  }

  get props() {
    return {
      bookingWindow: this.bookingWindow,
      currentDailyRate: this.currentDailyRate,
      currentCumulativeRate: this.currentCumulativeRate,
      historyCumulativeRate: this.historyCumulativeRate,
      date: parseISO(this.date)
    };
  }

  static deserialize({
    bookingWindow,
    currentDailyRate,
    currentCumulativeRate,
    historyCumulativeRate,
    date
  }: AdrCurveDto) {
    return new AdrCurve(
      bookingWindow,
      currentDailyRate,
      currentCumulativeRate,
      historyCumulativeRate,
      date
    );
  }
}

export class PriceBasket implements ComponentModel, OverviewSidebarItem {
  constructor(
    public scores: number[],
    public scoreValues: number[],
    public cumulativeScoreLabels: string[],
    public scoreValuesCumulative: number[][]
  ) {}

  get component() {
    return 'PriceBasket';
  }

  get title() {
    return 'Price basket';
  }

  get description() {
    return 'Distribution of current booking by historical price categories. Reservations  created in last 1, 7 and 30 days are highlighted.';
  }

  get props() {
    return {
      scores: this.scores,
      scoreValues: this.scoreValues,
      scoreBreakdownValues: this.scoreValuesCumulative,
      scoreBreakdownCategories: this.cumulativeScoreLabels
    };
  }

  static deserialize({
    scores,
    scoreValues,
    cumulativeScoreLabels,
    scoreValuesCumulative
  }: PriceBasketDto) {
    return new PriceBasket(
      scores,
      scoreValues,
      cumulativeScoreLabels,
      scoreValuesCumulative
    );
  }
}

export class LongtermPredictions
  implements ComponentModel, OverviewSidebarItem
{
  constructor(
    public years: number[],
    public historyRealisations: number[],
    public longtermPrediction: number,
    public currentEstimate: number
  ) {}

  get component() {
    return 'LongtermPredictions';
  }

  get title() {
    return 'Longterm predictions';
  }

  get description() {
    return 'Current booking prediction in comparison with historical trend realization.';
  }

  get props() {
    return {
      years: this.years,
      historyRealisations: this.historyRealisations,
      longtermPrediction: this.longtermPrediction,
      currentEstimate: this.currentEstimate
    };
  }

  static deserialize({
    years,
    historyRealisations,
    currentEstimate,
    longtermPrediction
  }: LongtermPredictionsDto) {
    return new LongtermPredictions(
      years,
      historyRealisations,
      longtermPrediction,
      currentEstimate
    );
  }
}

export class ExpectedBookingByAggregatedRoom
  implements ComponentModel, OverviewSidebarItem
{
  constructor(
    public rooms: string[],
    public bookingCurrent: number[],
    public bookingExpected: number[]
  ) {}

  get component() {
    return 'ExpectedBookingByAggregatedRoom';
  }

  get title() {
    return 'Expected booking by room type';
  }

  get description() {
    return 'Comparison of current booking and expected booking by aggregated room.';
  }

  get props() {
    return {
      rooms: this.rooms,
      bookingCurrent: this.bookingCurrent,
      bookingExpected: this.bookingExpected
    };
  }

  static deserialize({
    rooms,
    bookingCurrent,
    bookingExpected
  }: ExpectedBookingByAggregatedRoomDto) {
    return new ExpectedBookingByAggregatedRoom(
      rooms,
      bookingCurrent,
      bookingExpected
    );
  }
}

const graphCtorByType = {
  channel_cancelation: ChannelBreakdown,
  twins_analysis: TwinsAnalysis,
  room_breakdown: RoomBreakdown,
  midterm_booking: MidtermBooking,
  channel_box_plot: ExpectedBookingByChannel,
  rateshopper_value_price: RateShopperPriceVsValue,
  rateshopper_price: RateShopperPrice,
  booking_curve: BookingCurve,
  cancellation_rate: CancellationRate,
  adr_curve: AdrCurve,
  price_basket: PriceBasket,
  longterm_predictions: LongtermPredictions,
  booking_by_aggregated_room: ExpectedBookingByAggregatedRoom
};

export function deserialize(data): ComponentModel {
  return graphCtorByType[data.type]?.deserialize(data);
}
