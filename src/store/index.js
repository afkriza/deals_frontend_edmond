import Vue from 'vue';
import Vuex from 'vuex';

import { environments } from 'enums/environments';
import { ANALYTICS, RATE_SHOPPER, GROUPS } from 'constants/namespaces';
import * as localStorage from '@/api/local-storage';

import state from 'store/state';
import actionsGenerator from 'store/actions';
import getters from 'store/getters';
import mutations from 'store/mutations';

import dashboard from 'store/modules/dashboard';
import rates from 'store/modules/rates';
import inventory from 'store/modules/inventory';
import checkout from 'store/modules/checkout';
import history from 'store/modules/history';
import password from 'store/modules/password';
import groups from 'store/modules/groups';
import overview from 'store/modules/overview';

import AnalysisModule from 'store/modules/analysis';
import NotificationsModule from 'store/modules/notifications';
import PropertiesModule from 'store/modules/properties';
import MembersModule from 'store/modules/members/Members.module';

import { getModule } from 'vuex-module-decorators';
import GroupsModule from '@/store/modules/groups/groups.module';
import createFiltersModule from '@/store/modules/dynamic/filters.module';

Vue.use(Vuex);

const actions = actionsGenerator({ localStorage });

const store = new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
    [ANALYTICS]: dashboard(ANALYTICS),
    rates,
    inventory,
    checkout,
    history,
    password,
    groupsFilters: groups,
    [GROUPS]: GroupsModule,
    [RATE_SHOPPER]: dashboard(RATE_SHOPPER),
    overview,
    analysis: AnalysisModule,
    notifications: NotificationsModule,
    properties: PropertiesModule,
    members: {
      ...MembersModule,
      modules: { filters: createFiltersModule('members') }
    }
  },
  strict: process.env.NODE_ENV === environments.DEVELOPMENT
});

store.dispatch('rates/clearDatabase');
store.dispatch('inventory/clearDatabase');

// type safe vuex modules
export const analysisModule = getModule(AnalysisModule, store);
export const notificationsModule = getModule(NotificationsModule, store);
export const propertiesModule = getModule(PropertiesModule, store);
export const groupsModule = getModule(GroupsModule, store);
export const membersModule = getModule(MembersModule, store);

export default store;
