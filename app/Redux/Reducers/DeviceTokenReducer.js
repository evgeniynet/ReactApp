/* Imports */
import { DEVICE_TOKEN_CHANGED, DEVICE_TOKEN_RESET } from '../Actions/types';

/* Variables */
const INITIAL_STATE = {
  deviceToken: ''
};

/* Exporting reducer */
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DEVICE_TOKEN_CHANGED:
      return action.payload;
    case DEVICE_TOKEN_RESET: 
      state = INITIAL_STATE
      return state
    default:
      return state;
  }
};
