import * as mutationTypes from 'store/mutation-types';
import * as AuthorizationService from 'api/services/Authorization.service';

export async function setPassword({ commit }, { invitationToken, password }) {
  try {
    commit(mutationTypes.PASSWORD_CREATE);

    await AuthorizationService.setPassword(password, invitationToken);

    commit(mutationTypes.PASSWORD_CREATE_SUCCESS);
  } catch (e) {
    commit(mutationTypes.PASSWORD_CREATE_FAILURE);
  }
}
