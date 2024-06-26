/* Imports */
import { createActions } from 'reduxsauce'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  startup: null
})

/* Exporting reducer */
export const StartupTypes = Types
export default Creators
