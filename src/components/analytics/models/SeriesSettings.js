import { LINE } from 'constants/series-types';

export default class SeriesSettings {
  constructor({ seriesType = LINE, opposite = false }) {
    this.seriesType = seriesType;
    this.opposite = opposite;
  }

  static from(seriesSettings = {}) {
    return new SeriesSettings(seriesSettings);
  }

  static adaptKeys(seriesSettings) {
    return seriesSettings;
  }

  static deserialize(seriesSettings) {
    const { seriesType, opposite } = seriesSettings || {}; // handle null case

    return SeriesSettings.from({
      seriesType,
      opposite
    });
  }
}
