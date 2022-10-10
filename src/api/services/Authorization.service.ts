import httpClient, { removeToken, setToken } from '@/api/http-client';

import serialize from '@/api/json-api/serializer';

const SESSIONS_ENDPOINT = 'users/sessions';
const PASSWORDS_ENDPOINT = 'passwords';
const FORGOT_PASSWORD_ENDPOINT = 'users/forgot-password';
const RESOURCE_TYPE = 'sessions';

export const login = async (email: string, password: string) => {
  const {
    headers: { 'x-authorization-token': token },
    data: { data: user }
  } = await httpClient.post(
    SESSIONS_ENDPOINT,
    serialize(
      {
        email,
        password
      },
      {
        resourceType: RESOURCE_TYPE,
        attributes: ['email', 'password']
      }
    ),
    {
      unpackData: false
    }
  );

  setToken(token);

  return { user, token };
};

export const logout = () => removeToken();

export const getCurrentUser = () => httpClient.get(SESSIONS_ENDPOINT);

export const setPassword = (password: string, invitationToken: string) =>
  httpClient.post(
    PASSWORDS_ENDPOINT,
    serialize(
      {
        password,
        invitationToken
      },
      {
        attributes: ['password', 'invitationToken']
      }
    )
  );

export const sendResetPasswordEmail = (email: string) =>
  httpClient.post(
    FORGOT_PASSWORD_ENDPOINT,
    serialize(email, {
      resourceType: 'users',
      attributes: ['email']
    })
  );

export const resetPassword = ({
  password,
  passwordConfirmation,
  resetPasswordToken
}) =>
  httpClient.put(
    FORGOT_PASSWORD_ENDPOINT,
    serialize(
      { resetPasswordToken, password, passwordConfirmation },
      {
        resourceType: 'users',
        attributes: ['resetPasswordToken', 'password', 'passwordConfirmation']
      }
    )
  );
