/* Imports */
import { DEVICE_TOKEN_CHANGED, DEVICE_TOKEN_RESET } from './types';

/* Exporting action fetch user token */
export const deviceToken = (deviceToken) => {
  return {
    type: DEVICE_TOKEN_CHANGED,
    payload: { deviceToken: deviceToken }
  };
};

/* Exporting action resetting user token to default value */
export const resetDeviceTokenValueToDefault = () => {
  return {
    type: DEVICE_TOKEN_RESET
  };
};