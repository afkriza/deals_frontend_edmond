import { Module, MutationAction, VuexModule } from 'vuex-module-decorators';
import { fetchAllProperties } from '@/api/services/Properties.service';

export interface Property {
  id: string;
  type: string;
  name: string;
}

@Module({
  name: 'properties',
  namespaced: true
})
export default class PropertiesModule extends VuexModule {
  properties: Property[] | null = null;

  @MutationAction({ mutate: ['properties'] })
  async loadProperties() {
    if (this.properties) {
      return;
    }

    const { data: properties } = await fetchAllProperties();

    return {
      properties
    };
  }
}
