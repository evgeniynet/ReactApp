/* Imports */
import { CONFIG_INFO_CHANGED, CONFIG_INFO_RESET } from '../Actions/types';

/* Variables */
const INITIAL_STATE = {
  configInfo: null
};

/* Exporting reducer */
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CONFIG_INFO_CHANGED:
      return action.payload;
    case CONFIG_INFO_RESET: 
      state = INITIAL_STATE
      return state
    default:
      return state;
  }
};
