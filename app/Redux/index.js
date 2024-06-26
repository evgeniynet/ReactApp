/* Imports */
import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import DeviceTokenReducer from './Reducers/DeviceTokenReducer';
import UserInfoReducer from './Reducers/UserInfoReducer';
import AuthTokenReducer from './Reducers/AuthTokenReducer';
import OrganizationReducer from './Reducers/OrganizationReducer';
import ConfigInfoReducer from './Reducers/ConfigInfoReducer';

/* ------------- Assemble The Reducers ------------- */
export const reducers = combineReducers({
  nav: require('./NavigationRedux').reducer,
  deviceToken: DeviceTokenReducer,
  userInfo: UserInfoReducer,
  authToken: AuthTokenReducer,
  org: OrganizationReducer,
  configInfo: ConfigInfoReducer,
})

/* Exporting redux store */
export default () => {

  let { store } = configureStore(reducers)

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('.').reducers
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
