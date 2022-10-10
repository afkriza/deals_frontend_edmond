import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';

import Vue from 'vue';
import PortalVue from 'portal-vue';
import Vuelidate from 'vuelidate';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginVue from '@bugsnag/plugin-vue';

import App from '@/components/Application.vue';
import router from './router';
import store from './store';

import { environments } from '@/enums/environments.js';
import { windowsCustomScroll } from '@/directives/windows-custom-scroll';
import vVisible from '@/directives/v-visible';

Vue.config.productionTip = false;

Vue.use(PortalVue);
Vue.use(Vuelidate);

Vue.directive('windows-custom-scroll', windowsCustomScroll);
Vue.directive('visible', vVisible);
Vue.directive('windows-custom-scroll', windowsCustomScroll);

function installBugsnag() {
  Bugsnag.start({
    apiKey: 'ee734a7c7ed003802a383016a3c8dc40',
    plugins: [new BugsnagPluginVue()],
    enabledReleaseStages: [environments.PRODUCTION, environments.STAGING],
    releaseStage:
      process.env.VUE_APP_BUGSNAG_RELEASE_STAGE || environments.DEVELOPMENT
  });

  const plugin = Bugsnag.getPlugin('vue');

  if (plugin) {
    plugin.installVueErrorHandler(Vue);
    console.info('Bugsnag loaded');
  } else {
    console.warn('Bugsnag failed to load');
  }
}

function bootstrap() {
  installBugsnag();

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
}

bootstrap();
