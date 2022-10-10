import * as mutationTypes from 'store/mutation-types';
import { toastTypesEnum } from 'enums/toast-types';

import {
  login,
  getCurrentUser,
  logout,
  sendResetPasswordEmail,
  resetPassword
} from 'api/services/Authorization.service';
import { setToken } from 'api/http-client';
import { updateUser } from 'api/services/Users.service';

export default function ({ localStorage }) {
  return {
    async login({ commit }, { email, password }) {
      try {
        commit(mutationTypes.SESSION_REQUEST);

        const { user, token } = await login(email, password);

        commit(mutationTypes.SESSION_SUCCESS, {
          user,
          token
        });
      } catch (e) {
        commit(mutationTypes.SESSION_FAILURE);
        throw e;
      }
    },

    async checkSession({ commit }) {
      const token = localStorage.getItem('api-token');

      if (!token) {
        return Promise.reject();
      }

      setToken(token);

      try {
        commit(mutationTypes.SESSION_REQUEST);
        const { data: user } = await getCurrentUser();

        commit(mutationTypes.SESSION_SUCCESS, {
          user,
          token
        });
      } catch (e) {
        commit(mutationTypes.SESSION_FAILURE);
        throw e;
      }
    },

    logout({ commit }) {
      localStorage.removeItem('api-token');
      commit(mutationTypes.SESSION_DESTROY);

      logout();
    },

    async updateCurrentUser({ state, commit }, userData) {
      commit(mutationTypes.USER_UPDATE_REQUEST);

      try {
        const user = await updateUser({
          ...userData,
          id: state.session.user.id
        });

        commit(mutationTypes.USER_UPDATE_SUCCESS, { user });
      } catch (errors) {
        commit(mutationTypes.USER_UPDATE_FAILURE);

        throw errors;
      }
    },

    updateToast({ commit }, { message, type, abortable }) {
      const toast = { message, type };

      if (abortable) {
        toast.controller = new AbortController();
      }
      commit(mutationTypes.TOAST_MESSAGE_ADD, toast);

      if (type !== toastTypesEnum.LOADING) {
        setTimeout(() => {
          commit(mutationTypes.TOAST_MESSAGE_REMOVE_FIRST);
        }, 5000);
      }

      return toast.controller;
    },

    removeToast({ commit }, message) {
      commit(mutationTypes.TOAST_MESSAGE_REMOVE_TOAST, message);
    },

    async resetPasswordRequest({ commit }, email) {
      try {
        commit(mutationTypes.PASSWORD_RESET_REQUEST);

        await sendResetPasswordEmail(email);

        commit(mutationTypes.PASSWORD_RESET_SUCCESS);
      } catch (e) {
        commit(mutationTypes.PASSWORD_RESET_FAILURE);
      }
    },

    async resetPassword({ commit }, payload) {
      try {
        commit(mutationTypes.PASSWORD_PAGE_RESET_REQUEST);

        await resetPassword(payload);

        commit(mutationTypes.PASSWORD_PAGE_RESET_SUCCESS);
      } catch (e) {
        commit(mutationTypes.PASSWORD_PAGE_RESET_FAILURE);
      }
    }
  };
}
