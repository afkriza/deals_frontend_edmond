export interface ChannelBreakdownDto {
  channels: string[];
  netoBookings: number[];
  expectedCancellations: number[];
  baseBooking: number[];
  baseCancellations: number[];
}

export interface TwinsAnalysisDto {
  dates: string[];
  bookingRooms: number[];
  date: string;
}

export interface RoomBreakdownDto {
  rooms: string[];
  bookings: number[];
  base: number[];
}

export interface MidtermBookingDto {
  bookingRooms: number;
  bookingRoomsMean: number;
  bookingRoomsStd: number;
}

export interface ExpectedBookingByChannelDto {
  median: number[];
  channel: string[];
  currentBooking: number[];
  q1: number[];
  q3: number[];
  min: number[];
  max: number[];
}

export interface RateShopperPriceVsValueDto {
  x: number[];
  y: number[];
  propertyNames: string[];
  currentPrice: number;
  predictedPrice: number;
  currentScore: number;
  a: number;
  b: number;
  ourProperties: string[];
  xRange: [number, number];
  yRange: [number, number];
}

export interface RateShopperPriceDto {
  compset: string[];
  currentPrice: number[];
  compsetPriceArray: number[][];
  properties: string[][];
}

export interface BookingCurveDto {
  bookingCurveCurrent: { diff: number[]; booking: number[] };
  bookingCurvePast: { diff: number[]; booking: number[] };
  paceDataCurrent: { diff: number[]; pace: number[] };
  paceDataPast: { diff: number[]; pace: number[] };
  date: string;
}

export interface CancellationRateDto {
  bookingWindow: number[];
  cancellationRate: number[];
  pieLabels: string[];
  pieValuesCurrent: number[];
  pieValuesHistory: number[];
  date: string;
  noOfOverbookedUnits: number;
}

export interface AdrCurveDto {
  bookingWindow: number[];
  currentDailyRate: number[];
  currentCumulativeRate: number[];
  historyCumulativeRate: number[];
  date: string;
}

export interface PriceBasketDto {
  scores: number[];
  scoreValues: number[];
  scoreValuesCumulative: number[][];
  cumulativeScoreLabels: string[];
}

export interface LongtermPredictionsDto {
  years: number[];
  historyRealisations: number[];
  longtermPrediction: number;
  currentEstimate: number;
}

export interface ExpectedBookingByAggregatedRoomDto {
  rooms: string[];
  bookingCurrent: number[];
  bookingExpected: number[];
}
