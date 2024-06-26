/* Imports */
import { USER_INFO_CHANGED, USER_INFO_RESET } from '../Actions/types';

/* Variables */
const INITIAL_STATE = {
  user: null
};

/* Exporting reducer */
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_INFO_CHANGED:
      return action.payload;
    case USER_INFO_RESET:
      state = INITIAL_STATE
      return state
    default:
      return state;
  }
};
