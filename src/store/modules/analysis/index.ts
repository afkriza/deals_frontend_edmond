import { Action, Module, VuexModule } from 'vuex-module-decorators';

import { fetchDisplacementAnalysis } from '@/api/services/Groups.service';

type RoomType = 'single' | 'double' | 'triple' | 'family' | 'suite';

export interface DisplacementAnalysisPayload {
  propertyId: number;
  partnerId?: number;
  subchannel: 'GRP BUSINESS'; // hardcoded for now
  dateRanges: {
    dateFrom: string;
    dateTo: string;
    rooms: { [roomId in RoomType]: number };
  }[];
}

@Module({
  name: 'analysis',
  namespaced: true
})
export default class AnalysisModule extends VuexModule {
  @Action({ rawError: true })
  async fetchDisplacementAnalysis(payload: DisplacementAnalysisPayload) {
    const { data: displacementAnalysisData } = await fetchDisplacementAnalysis(
      payload
    );

    return displacementAnalysisData;
  }
}
