import Vue from 'vue';

Vue.config.productionTip = false;
Vue.config.devtools = false;
Vue.config.errorHandler = function(error) {
  throw error;
};

export function mountComponent(component, propsData) {
  const Component = Vue.extend(component);
  return new Component({ propsData }).$mount();
}

export function destroyComponent(component) {
  if (component) {
    component.$destroy();
  }
}
