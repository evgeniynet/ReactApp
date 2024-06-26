/* Imports */
import { AUTH_TOKEN_CHANGED, AUTH_TOKEN_RESET } from '../Actions/types';

/* Variables */
const INITIAL_STATE = {
  authToken: ''
};

/* Exporting reducer */
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_TOKEN_CHANGED:
      return action.payload;
    case AUTH_TOKEN_RESET:
      state = INITIAL_STATE
      return state
    default:
      return state;
  }
};
