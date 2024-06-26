/* Imports */
import { USER_INFO_CHANGED, USER_INFO_RESET } from './types';

/* Exporting action fetch user information */
export const userInfo = (userInfo) => {
  return {
    type: USER_INFO_CHANGED,
    payload: { user: userInfo }
  };
};

/* Exporting action resetting user info to default value */
export const resetInfo = () => {
  return {
    type: USER_INFO_RESET
  };
};