/* Imports */
import { ORG_CHANGED, ORG_RESET } from '../Actions/types';

/* Variables */
const INITIAL_STATE = {
  org: null
};

/* Exporting reducer */
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ORG_CHANGED:
      return action.payload;
    case ORG_RESET:
      state = INITIAL_STATE
      return state
    default:
      return state;
  }
};
