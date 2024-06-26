/* Imports */
import { CONFIG_INFO_CHANGED, CONFIG_INFO_RESET } from './types';

/* Exporting action fetch user congig information */
export const configInfo = (configInfo) => {
  return {
    type: CONFIG_INFO_CHANGED,
    payload: { configInfo: configInfo }
  };
};

/* Exporting action resetting user config info to default value */
export const resetConfigInfo = () => {
  return {
    type: CONFIG_INFO_RESET
  };
};