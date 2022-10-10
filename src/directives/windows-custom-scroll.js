import { isWindows } from '../utils/browser';

export const windowsCustomScroll = {
  inserted(el, binding) {
    if (isWindows) {
      if (binding.arg === 'dark') {
        el.classList.add('v-custom-scroll-dark');
      } else {
        el.classList.add('v-custom-scroll-light');
      }
    }
  }
};
