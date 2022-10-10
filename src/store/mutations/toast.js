import * as mutationTypes from 'store/mutation-types';

export default {
  [mutationTypes.TOAST_MESSAGE_ADD](state, { message, type, controller }) {
    state.toasts.push({ message, type, controller });
  },

  [mutationTypes.TOAST_MESSAGE_REMOVE_FIRST](state) {
    state.toasts.splice(0, 1);
  },

  [mutationTypes.TOAST_MESSAGE_REMOVE_TOAST](state, message) {
    state.toasts = state.toasts.filter(toast => toast.message !== message);
  }
};
