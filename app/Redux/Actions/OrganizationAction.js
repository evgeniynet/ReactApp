/* Imports */
import { ORG_CHANGED, ORG_RESET } from './types';

/* Exporting action fetch org */
export const org = (org) => {
  return {
    type: ORG_CHANGED,
    payload: { org: org }
  };
};

/* Exporting action resetting org to default value */
export const resetOrgValueToDefault = () => {
  return {
    type: ORG_RESET
  };
};