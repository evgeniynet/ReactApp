/* Imports */
import { AUTH_TOKEN_CHANGED, AUTH_TOKEN_RESET } from './types';

/* Exporting action fetch user auth token */
export const authToken = (authToken) => {
  return {
    type: AUTH_TOKEN_CHANGED,
    payload: { authToken: authToken }
  };
};

/* Exporting action resetting user auth token to default value */
export const resetAuthTokenValueToDefault = () => {
  return {
    type: AUTH_TOKEN_RESET
  };
};