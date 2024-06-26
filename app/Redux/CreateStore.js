/* Imports */
import { createStore, applyMiddleware, compose } from 'redux'
import { appNavigatorMiddleware } from '../Navigation/ReduxNavigation'

// creates the store
/* Exporting methods */
export default (rootReducer) => {
  /* ------------- Redux Configuration ------------- */

  const middleware = []
  const enhancers = []

  /* ------------- Navigation Middleware ------------ */
  middleware.push(appNavigatorMiddleware)

  enhancers.push(applyMiddleware(...middleware))

  // if Reactotron is enabled (default for __DEV__), we'll create the store through Reactotron
  const createAppropriateStore = createStore

  const store = createAppropriateStore(rootReducer, compose(...enhancers))

  /* Exporting store */
  return {
    store
  }
}
