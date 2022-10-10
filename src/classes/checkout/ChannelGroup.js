import { flatMap } from 'utils/collection';

export default class ChannelGroup {
  constructor(channels) {
    this.channels = channels;
    this.units = this.getUnits();
    this.channelIds = this.getChannelIds();
    this.unitTypes = this.getChannelUnitTypes();
    this.criteria = this.getCriteria();
    this.accumulatedCriteria = this.getAccumulatedCriteria();
  }

  getChannelIds() {
    return this.channels.map(({ channelId }) => channelId).join(',');
  }

  getChannelUnitTypes() {
    return this.channels[0].unitTypes.join(',');
  }

  getCriteria() {
    throw new Error('Method getCriteria not implemented!');
  }

  getAccumulatedCriteria() {
    return `${this.channelIds}-${this.unitTypes}-${this.criteria}`;
  }

  getUnits() {
    return flatMap(this.channels, ({ units }) => units);
  }
}
